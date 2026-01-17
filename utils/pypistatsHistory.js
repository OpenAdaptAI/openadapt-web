/**
 * Utility functions for fetching historical PyPI download statistics
 *
 * Uses local API route to proxy pypistats.org requests (to avoid CORS issues)
 * Original API documentation: https://pypistats.org/api/
 */

const PYPI_PACKAGES = [
    'openadapt',
    'openadapt-ml',
    'openadapt-capture',
    'openadapt-evals',
    'openadapt-viewer',
    'openadapt-grounding',
    'openadapt-retrieval',
    'openadapt-privacy',
];

/**
 * Fetches overall download history for a single PyPI package
 * @param {string} packageName - The name of the PyPI package
 * @param {string} period - The time period: 'day', 'week', or 'month'
 * @returns {Promise<Array>} - Array of {date, downloads} objects
 */
async function getPackageHistory(packageName, period = 'month') {
    try {
        // Use local API route to avoid CORS issues
        const response = await fetch(
            `/api/pypistats?package=${packageName}&endpoint=overall&period=${period}`
        );

        if (!response.ok) {
            console.warn(`Failed to fetch history for ${packageName}: ${response.status}`);
            return [];
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
            console.warn(`Unexpected data format for ${packageName}:`, data);
            return [];
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
        return [];
    }
}

/**
 * Fetches recent download history for a single PyPI package (last 180 days)
 * @param {string} packageName - The name of the PyPI package
 * @returns {Promise<Array>} - Array of {date, downloads} objects
 */
async function getPackageRecentHistory(packageName) {
    try {
        // Use local API route to avoid CORS issues
        // Note: Do NOT pass period parameter - without it, the API returns all three:
        // last_day, last_week, and last_month. With period=month, only last_month is returned.
        const response = await fetch(
            `/api/pypistats?package=${packageName}&endpoint=recent`
        );

        if (!response.ok) {
            console.warn(`Failed to fetch recent history for ${packageName}: ${response.status}`);
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
    const results = await Promise.all(
        PYPI_PACKAGES.map(async (pkg) => ({
            name: pkg,
            history: await getPackageHistory(pkg, period),
        }))
    );

    // Create a map of date -> downloads for combined data
    const combinedMap = new Map();
    const packageHistories = {};

    results.forEach(({ name, history }) => {
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
        packageNames: PYPI_PACKAGES,
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
    const results = await Promise.all(
        PYPI_PACKAGES.map(async (pkg) => {
            const recent = await getPackageRecentHistory(pkg);
            return { name: pkg, recent };
        })
    );

    const totals = {
        last_day: 0,
        last_week: 0,
        last_month: 0,
    };
    const perPackage = {};
    let topPackage = { name: '', downloads: 0 };

    results.forEach(({ name, recent }) => {
        if (recent) {
            const day = recent.last_day || 0;
            const week = recent.last_week || 0;
            const month = recent.last_month || 0;

            totals.last_day += day;
            totals.last_week += week;
            totals.last_month += month;

            perPackage[name] = { last_day: day, last_week: week, last_month: month };

            if (month > topPackage.downloads) {
                topPackage = { name, downloads: month };
            }
        }
    });

    return {
        totals,
        perPackage,
        topPackage,
        packageCount: results.filter(r => r.recent).length,
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
