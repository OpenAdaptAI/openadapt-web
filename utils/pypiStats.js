/**
 * Utility functions for fetching PyPI download statistics via Shields.io API
 */

let cachedPackages = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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
 * Gets just the package names (for backward compatibility with stats fetching).
 * @returns {Promise<string[]>}
 */
async function getPackageList() {
    const packages = await getPackageData();
    return packages.map((p) => (typeof p === 'string' ? p : p.name));
}

/**
 * Fetches monthly download count for a single PyPI package from Shields.io
 * @param {string} packageName - The name of the PyPI package
 * @returns {Promise<number>} - The monthly download count
 */
async function getPackageDownloads(packageName) {
    try {
        const response = await fetch(
            `https://img.shields.io/pypi/dm/${packageName}.json`
        );

        if (!response.ok) {
            console.warn(`Failed to fetch stats for ${packageName}: ${response.status}`);
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
 * Formats download count for display (e.g., 1500 -> "1,500")
 * @param {number} count - The download count
 * @returns {string} - Formatted string
 */
/**
 * Gets discovered packages with descriptions.
 * @returns {Promise<Array<{name: string, description: string}>>}
 */
export { getPackageData };

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
