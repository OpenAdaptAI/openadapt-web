/**
 * API route to discover all openadapt-* packages from PyPI
 *
 * *** SINGLE SOURCE OF TRUTH FOR PACKAGE LISTS ***
 * This API endpoint uses the shared packageDiscovery utility module.
 * The discovery logic itself is in utils/packageDiscovery.js
 *
 * This endpoint provides an HTTP interface to the discovery logic for:
 * - Client-side code that needs to fetch package lists
 * - External services that need the package list via HTTP
 *
 * Server-side code (like other API routes) should import the utility directly
 * instead of making HTTP calls to this endpoint.
 */

import { discoverPackages, CACHE_DURATION } from '../../utils/packageDiscovery.js';

export default async function handler(req, res) {
    try {
        const result = await discoverPackages();
        const { packages, timestamp, fallback, stale } = result;

        // Set cache headers based on result type
        if (fallback || stale) {
            // Cache fallback/stale for shorter duration (1 hour) to retry discovery sooner
            res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        } else {
            // Cache for 24 hours on client side, use stale-while-revalidate for resilience
            res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
        }

        return res.status(200).json({
            packages,
            count: packages.length,
            timestamp,
            cacheExpiresAt: new Date(timestamp + CACHE_DURATION).toISOString(),
            ...(fallback && { fallback: true, warning: 'Using fallback package list' }),
            ...(stale && { stale: true, warning: 'Using stale cache due to discovery error' }),
        });
    } catch (error) {
        console.error('Unexpected error in discover-packages handler:', error);

        // This should rarely happen since discoverPackages has its own error handling
        return res.status(500).json({
            error: 'Failed to discover packages',
            message: error.message,
        });
    }
}
