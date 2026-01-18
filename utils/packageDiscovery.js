/**
 * Shared utility for discovering openadapt-* packages from PyPI
 *
 * *** SINGLE SOURCE OF TRUTH FOR PACKAGE DISCOVERY LOGIC ***
 * This module contains the core package discovery logic used by both:
 * - /api/discover-packages.js (the API endpoint)
 * - /api/pypistats.js (for direct access to avoid HTTP calls between serverless functions)
 *
 * Since PyPI no longer has a search API, we use a hybrid approach:
 * 1. Check a list of known/potential package names (POTENTIAL_PACKAGES)
 * 2. Verify each package exists via PyPI's JSON API
 * 3. Cache the results for 24 hours
 * 4. Return a fallback list only if discovery fails
 */

// Known and potential openadapt packages to check
// This list can include packages that don't exist yet - they'll be filtered out during discovery
const POTENTIAL_PACKAGES = [
    'openadapt',
    'openadapt-ml',
    'openadapt-capture',
    'openadapt-evals',
    'openadapt-viewer',
    'openadapt-grounding',
    'openadapt-retrieval',
    'openadapt-privacy',
    'openadapt-tray',
    'openadapt-telemetry',
    'openadapt-agent',
    'openadapt-web',
    'openadapt-api',
    'openadapt-core',
    'openadapt-server',
    'openadapt-client',
];

// FALLBACK LIST - Only returned if PyPI discovery completely fails
// This is the single source of truth for the fallback package list
// Last updated: 2025-01-18
const FALLBACK_PACKAGES = [
    'openadapt',
    'openadapt-ml',
    'openadapt-capture',
    'openadapt-evals',
    'openadapt-viewer',
    'openadapt-grounding',
    'openadapt-retrieval',
    'openadapt-privacy',
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

    try {
        // Check all potential packages in parallel
        const results = await Promise.all(
            POTENTIAL_PACKAGES.map(async (pkg) => ({
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
export { POTENTIAL_PACKAGES, FALLBACK_PACKAGES, CACHE_DURATION };
