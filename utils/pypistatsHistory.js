/**
 * Utility functions for fetching historical PyPI download statistics
 *
 * Uses local API route to proxy pypistats.org requests (to avoid CORS issues).
 * Requests are spread across a bounded concurrency pool with exponential
 * backoff + jitter on 429 (see utils/fetchPool.js) so we never burst the
 * upstream and trip its rate limiter.
 * Original API documentation: https://pypistats.org/api/
 */

import { fetchWithBackoff, mapWithConcurrency } from './fetchPool.js';

let cachedPackages = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Max simultaneous requests to our /api/pypistats proxy. Kept small so the
// upstream (pypistats.org) sees a trickle, not a burst, of requests.
const STATS_CONCURRENCY = 3;

/**
 * Builds the proxy URL for a package's stats. The package name goes in the URL
 * PATH so Netlify's CDN caches each package under a distinct key.
 * @param {string} packageName
 * @param {string} endpoint - 'overall' or 'recent'
 * @param {string} [period] - Optional period; omit for 'recent' to get day/week/month
 * @returns {string}
 */
function statsUrl(packageName, endpoint, period) {
    const query = new URLSearchParams({ endpoint });
    if (period) query.set('period', period);
    return `/api/pypistats/${encodeURIComponent(packageName)}?${query.toString()}`;
}

/**
 * Fetches core package names from the discover-packages API with client-side caching.
 * Filters to core packages only (excludes hidden and devtools).
 * @returns {Promise<string[]>} - Array of package names
 */
async function getPackageList() {
    if (cachedPackages && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return cachedPackages;
    }

    try {
        const response = await fetch('/api/discover-packages');
        if (!response.ok) {
            throw new Error(`Failed to discover packages: ${response.status}`);
        }

        const data = await response.json();
        // Filter to core packages that actually exist on PyPI, extract names for
        // stats. Excluding on_pypi === false stops us requesting download data for
        // repos that were never published (which 404 upstream).
        const packages = (data.packages || [])
            .filter((p) => typeof p === 'string' || (p.category === 'core' && p.on_pypi !== false))
            .map((p) => (typeof p === 'string' ? p : p.name));
        cachedPackages = packages;
        cacheTimestamp = Date.now();

        return cachedPackages;
    } catch (error) {
        console.error('Error fetching package list from discover-packages API:', error);

        if (cachedPackages) {
            console.warn('Using stale package cache due to API failure');
            return cachedPackages;
        }

        throw new Error('Unable to fetch package list and no cache available');
    }
}

/**
 * Fetches overall download history for a single PyPI package
 * @param {string} packageName - The name of the PyPI package
 * @param {string} period - The time period: 'day', 'week', or 'month'
 * @returns {Promise<Array>} - Array of {date, downloads} objects
 */
async function getPackageHistory(packageName, period = 'month') {
    try {
        // Use local API route to avoid CORS issues, with backoff on 429.
        const url = statsUrl(packageName, 'overall', period);
        const response = await fetchWithBackoff(url);

        if (!response || !response.ok) {
            console.warn(`Excluding ${packageName} from chart: history fetch failed`);
            return null; // null signals a failed fetch (distinct from empty data [])
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
            console.warn(`Unexpected data format for ${packageName}:`, data);
            return null;
        }

        // Filter to only include 'with_mirrors' category and sort by date
        const history = data.data
            .filter(item => item.category === 'with_mirrors')
            .map(item => ({
                date: item.date,
                downloads: item.downloads
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return history;
    } catch (error) {
        console.error(`Error fetching pypistats history for ${packageName}:`, error);
        return null;
    }
}

/**
 * Fetches recent download history for a single PyPI package (last 180 days)
 * @param {string} packageName - The name of the PyPI package
 * @returns {Promise<Array>} - Array of {date, downloads} objects
 */
async function getPackageRecentHistory(packageName) {
    try {
        // Use local API route to avoid CORS issues, with backoff on 429.
        // Note: Do NOT pass period parameter - without it, the API returns all three:
        // last_day, last_week, and last_month. With period=month, only last_month is returned.
        const url = statsUrl(packageName, 'recent');
        const response = await fetchWithBackoff(url);

        if (!response || !response.ok) {
            console.warn(`Recent stats unavailable for ${packageName}`);
            return null;
        }

        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error(`Error fetching recent stats for ${packageName}:`, error);
        return null;
    }
}

/**
 * Fetches and aggregates historical download data for all OpenAdapt packages
 * @param {string} period - The time period: 'day', 'week', or 'month'
 * @returns {Promise<Object>} - Object containing combined history and per-package data
 */
export async function getPyPIDownloadHistory(period = 'month') {
    const packageList = await getPackageList();
    // Bounded concurrency: at most STATS_CONCURRENCY requests hit the proxy
    // (and therefore pypistats.org) at once, instead of all packages at once.
    const results = await mapWithConcurrency(
        packageList,
        async (pkg) => ({
            name: pkg,
            history: await getPackageHistory(pkg, period),
        }),
        STATS_CONCURRENCY,
    );

    // Filter out packages whose fetch failed (null), keeping only successful results.
    // This prevents failed requests from corrupting the graph with missing/zero data.
    const successfulResults = results.filter(({ name, history }) => {
        if (history === null) {
            console.warn(`Excluding ${name} from chart due to fetch failure`);
            return false;
        }
        return true;
    });

    const successfulPackageNames = successfulResults.map(r => r.name);

    // Create a map of date -> downloads for combined data
    const combinedMap = new Map();
    const packageHistories = {};

    successfulResults.forEach(({ name, history }) => {
        packageHistories[name] = history;

        history.forEach(({ date, downloads }) => {
            const existing = combinedMap.get(date) || 0;
            combinedMap.set(date, existing + downloads);
        });
    });

    // Convert combined map to sorted array
    const combined = Array.from(combinedMap.entries())
        .map(([date, downloads]) => ({ date, downloads }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate cumulative downloads
    let cumulative = 0;
    const cumulativeHistory = combined.map(({ date, downloads }) => {
        cumulative += downloads;
        return { date, downloads: cumulative };
    });

    return {
        combined,
        cumulativeHistory,
        packages: packageHistories,
        packageNames: successfulPackageNames,
    };
}

/**
 * Fetches download history with optional date range filtering
 * @param {string} period - The time period: 'day', 'week', or 'month'
 * @param {number} limit - Maximum number of data points to return (most recent)
 * @returns {Promise<Object>} - Filtered download history
 */
export async function getPyPIDownloadHistoryLimited(period = 'month', limit = 12) {
    const data = await getPyPIDownloadHistory(period);

    // Limit the combined data to the most recent entries
    const limitedCombined = data.combined.slice(-limit);
    const limitedCumulative = data.cumulativeHistory.slice(-limit);

    // Limit each package's history
    const limitedPackages = {};
    Object.entries(data.packages).forEach(([name, history]) => {
        limitedPackages[name] = history.slice(-limit);
    });

    return {
        combined: limitedCombined,
        cumulativeHistory: limitedCumulative,
        packages: limitedPackages,
        packageNames: data.packageNames,
    };
}

/**
 * Formats a date string for display
 * @param {string} dateStr - ISO date string
 * @param {string} period - The time period: 'day', 'week', or 'month'
 * @returns {string} - Formatted date string
 */
export function formatDate(dateStr, period = 'month') {
    const date = new Date(dateStr);

    if (period === 'day') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (period === 'week') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
}

/**
 * Calculates growth statistics from download history
 * @param {Array} history - Array of {date, downloads} objects
 * @returns {Object} - Growth statistics
 */
export function calculateGrowthStats(history) {
    if (!history || history.length < 2) {
        return { growth: 0, growthPercent: 0, trend: 'stable' };
    }

    const recent = history.slice(-3);
    const older = history.slice(-6, -3);

    if (recent.length === 0 || older.length === 0) {
        return { growth: 0, growthPercent: 0, trend: 'stable' };
    }

    const recentAvg = recent.reduce((sum, item) => sum + item.downloads, 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item.downloads, 0) / older.length;

    const growth = recentAvg - olderAvg;
    const growthPercent = olderAvg > 0 ? ((growth / olderAvg) * 100) : 0;

    let trend = 'stable';
    if (growthPercent > 10) trend = 'growing';
    else if (growthPercent < -10) trend = 'declining';

    return {
        growth: Math.round(growth),
        growthPercent: Math.round(growthPercent),
        trend,
        recentAvg: Math.round(recentAvg),
        olderAvg: Math.round(olderAvg),
    };
}

/**
 * Fetches aggregated recent download stats for all packages
 * @returns {Promise<Object>} - Object with last_day, last_week, last_month totals and per-package breakdown
 */
export async function getRecentDownloadStats() {
    const packageList = await getPackageList();
    // Bounded concurrency (same pool size as the history fetch) so recent-stats
    // requests also trickle to the upstream rather than firing all at once.
    const results = await mapWithConcurrency(
        packageList,
        async (pkg) => ({ name: pkg, recent: await getPackageRecentHistory(pkg) }),
        STATS_CONCURRENCY,
    );

    const totals = {
        last_day: 0,
        last_week: 0,
        last_month: 0,
    };
    const perPackage = {};
    let topPackage = { name: '', downloads: 0 };
    let successCount = 0;

    results.forEach((result) => {
        const recent = result && result.recent;
        if (recent) {
            successCount++;
            const day = recent.last_day || 0;
            const week = recent.last_week || 0;
            const month = recent.last_month || 0;

            totals.last_day += day;
            totals.last_week += week;
            totals.last_month += month;

            perPackage[result.name] = { last_day: day, last_week: week, last_month: month };

            if (month > topPackage.downloads) {
                topPackage = { name: result.name, downloads: month };
            }
        }
    });

    return {
        totals,
        perPackage,
        topPackage,
        packageCount: successCount,
    };
}

/**
 * Fetches GitHub stats for the main OpenAdapt repository
 * @returns {Promise<Object>} - Object with stars, forks, watchers
 */
export async function getGitHubStats() {
    try {
        const response = await fetch('https://api.github.com/repos/OpenAdaptAI/OpenAdapt');
        if (!response.ok) {
            console.warn('Failed to fetch GitHub stats:', response.status);
            return null;
        }
        const data = await response.json();
        return {
            stars: data.stargazers_count,
            forks: data.forks_count,
            watchers: data.subscribers_count,
            openIssues: data.open_issues_count,
        };
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        return null;
    }
}
