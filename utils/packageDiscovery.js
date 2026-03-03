/**
 * Shared utility for discovering openadapt-* packages from PyPI
 *
 * *** SINGLE SOURCE OF TRUTH FOR PACKAGE DISCOVERY LOGIC ***
 * This module contains the core package discovery logic used by both:
 * - /api/discover-packages.js (the API endpoint)
 * - /api/pypistats.js (for direct access to avoid HTTP calls between serverless functions)
 *
 * Discovery flow:
 * 1. Fetch all public openadapt-* repos from the OpenAdaptAI GitHub org
 * 2. Verify each repo name exists as a package on PyPI
 * 3. Cache the results for 24 hours
 * 4. Fall back to a static list if GitHub + PyPI discovery both fail
 */

const GITHUB_ORG = 'OpenAdaptAI';

/**
 * Fetches all public openadapt-* repo names from the GitHub org.
 * Uses the unauthenticated API (60 req/hr limit, fine with 24h cache).
 * @returns {Promise<string[]>} - Lowercase repo names matching openadapt-*
 */
async function fetchGitHubRepoNames() {
    const repos = [];
    let page = 1;
    while (true) {
        const response = await fetch(
            `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&page=${page}`,
            { headers: { Accept: 'application/vnd.github.v3+json' } }
        );
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        const batch = await response.json();
        if (batch.length === 0) break;
        repos.push(...batch);
        page++;
    }
    return repos
        .filter((r) => !r.private)
        .map((r) => r.name.toLowerCase())
        .filter((name) => name === 'openadapt' || name.startsWith('openadapt-'));
}

// FALLBACK LIST - Only returned if both GitHub and PyPI discovery fail
// Last updated: 2026-03-02
const FALLBACK_PACKAGES = [
    'openadapt',
    'openadapt-ml',
    'openadapt-capture',
    'openadapt-evals',
    'openadapt-consilium',
    'openadapt-viewer',
    'openadapt-grounding',
    'openadapt-retrieval',
    'openadapt-privacy',
    'openadapt-tray',
];

let cachedPackages = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Checks if a package exists on PyPI
 * @param {string} packageName - The package name to check
 * @returns {Promise<boolean>} - True if package exists
 */
async function packageExists(packageName) {
    try {
        const response = await fetch(`https://pypi.org/pypi/${packageName}/json`, {
            method: 'HEAD',
        });
        return response.ok;
    } catch (error) {
        console.warn(`Error checking package ${packageName}:`, error);
        return false;
    }
}

/**
 * Discovers all existing openadapt-* packages
 * This is the core discovery logic used by all package-related endpoints
 * @returns {Promise<{packages: string[], timestamp: number, fallback?: boolean}>}
 */
export async function discoverPackages() {
    // Return cached result if still valid
    if (cachedPackages && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return {
            packages: cachedPackages,
            timestamp: cacheTimestamp,
            cached: true,
        };
    }

    // Build candidate list: prefer GitHub org discovery, fall back to static list
    let candidates;
    try {
        candidates = await fetchGitHubRepoNames();
    } catch (error) {
        console.warn('GitHub discovery failed, using static list:', error.message);
        candidates = FALLBACK_PACKAGES;
    }

    try {
        // Check all candidates against PyPI in parallel
        const results = await Promise.all(
            candidates.map(async (pkg) => ({
                name: pkg,
                exists: await packageExists(pkg),
            }))
        );

        // Filter to only existing packages
        const existingPackages = results
            .filter(({ exists }) => exists)
            .map(({ name }) => name);

        // Update cache
        cachedPackages = existingPackages;
        cacheTimestamp = Date.now();

        return {
            packages: existingPackages,
            timestamp: cacheTimestamp,
            cached: false,
        };
    } catch (error) {
        console.error('Error discovering packages:', error);

        // If we have a stale cache, use it
        if (cachedPackages) {
            console.warn('Using stale package cache due to discovery error');
            return {
                packages: cachedPackages,
                timestamp: cacheTimestamp,
                stale: true,
            };
        }

        // If no cache exists, return fallback
        console.warn('No cache available, using fallback package list');
        return {
            packages: FALLBACK_PACKAGES,
            timestamp: Date.now(),
            fallback: true,
        };
    }
}

/**
 * Gets the list of discovered packages (packages only, for backward compatibility)
 * @returns {Promise<string[]>} - Array of package names
 */
export async function getDiscoveredPackages() {
    const result = await discoverPackages();
    return result.packages;
}

/**
 * Exports for direct access to constants
 */
export { FALLBACK_PACKAGES, CACHE_DURATION };
