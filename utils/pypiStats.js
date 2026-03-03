/**
 * Utility functions for fetching PyPI download statistics via Shields.io API
 */

let cachedPackages = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetches a URL with retry logic and exponential backoff.
 * Returns null if all retries fail.
 * @param {string} url - The URL to fetch
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} baseDelayMs - Base delay in ms before first retry (default: 500)
 * @returns {Promise<Response|null>} - The fetch Response, or null if all retries failed
 */
async function fetchWithRetry(url, maxRetries = 3, baseDelayMs = 500) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return response;
            }
            if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                console.warn(`fetchWithRetry: ${url} returned ${response.status}, not retrying`);
                return null;
            }
            console.warn(`fetchWithRetry: ${url} returned ${response.status}, attempt ${attempt + 1}/${maxRetries + 1}`);
        } catch (error) {
            console.warn(`fetchWithRetry: ${url} threw error, attempt ${attempt + 1}/${maxRetries + 1}:`, error.message);
        }

        if (attempt < maxRetries) {
            const delay = baseDelayMs * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    console.error(`fetchWithRetry: ${url} failed after ${maxRetries + 1} attempts`);
    return null;
}

/**
 * Fetches the discovered packages from the API.
 * Returns the full objects ({ name, description }) and caches them.
 * @returns {Promise<Array<{name: string, description: string}>>}
 */
async function getPackageData() {
    if (cachedPackages && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return cachedPackages;
    }

    try {
        const response = await fetch('/api/discover-packages');
        if (!response.ok) {
            throw new Error(`Failed to discover packages: ${response.status}`);
        }

        const data = await response.json();
        cachedPackages = data.packages || [];
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
 * Gets just the core package names (for backward compatibility with stats fetching).
 * Filters to core packages only (excludes hidden and devtools).
 * @returns {Promise<string[]>}
 */
async function getPackageList() {
    const packages = await getPackageData();
    return packages
        .filter((p) => typeof p === 'string' || p.category === 'core')
        .map((p) => (typeof p === 'string' ? p : p.name));
}

/**
 * Fetches monthly download count for a single PyPI package from Shields.io
 * @param {string} packageName - The name of the PyPI package
 * @returns {Promise<number>} - The monthly download count
 */
async function getPackageDownloads(packageName) {
    try {
        const url = `https://img.shields.io/pypi/dm/${packageName}.json`;
        const response = await fetchWithRetry(url);

        if (!response) {
            console.warn(`Failed to fetch stats for ${packageName} after retries`);
            return 0;
        }

        const data = await response.json();
        // Response format: { "message": "333/month" } or { "message": "1.2k/month" }
        const message = data.message || '';

        // Parse the number from the message
        const match = message.match(/^([\d.]+)([km])?\/month$/i);
        if (!match) {
            console.warn(`Unexpected format for ${packageName}: ${message}`);
            return 0;
        }

        let count = parseFloat(match[1]);
        const suffix = match[2]?.toLowerCase();

        if (suffix === 'k') {
            count *= 1000;
        } else if (suffix === 'm') {
            count *= 1000000;
        }

        return Math.round(count);
    } catch (error) {
        console.error(`Error fetching PyPI stats for ${packageName}:`, error);
        return 0;
    }
}

/**
 * Fetches and aggregates monthly download counts for all OpenAdapt packages
 * @returns {Promise<{total: number, packages: Object<string, number>}>}
 */
export async function getPyPIDownloadStats() {
    const packageList = await getPackageList();
    const results = await Promise.all(
        packageList.map(async (pkg) => ({
            name: pkg,
            downloads: await getPackageDownloads(pkg),
        }))
    );

    const packages = {};
    let total = 0;

    results.forEach(({ name, downloads }) => {
        packages[name] = downloads;
        total += downloads;
    });

    return { total, packages };
}

/**
 * Gets discovered packages with descriptions.
 * @returns {Promise<Array<{name: string, description: string}>>}
 */
export { getPackageData };

/**
 * Formats download count for display (e.g., 1500 -> "1,500")
 * @param {number} count - The download count
 * @returns {string} - Formatted string
 */
export function formatDownloadCount(count) {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    } else if (count > 0) {
        return `${count.toLocaleString()}`;
    }
    return '0';
}
