/**
 * API route to proxy pypistats.org requests (avoids client CORS issues).
 *
 * The package name lives in the URL PATH (`/api/pypistats/<package>`), not the
 * query string. This is deliberate: Netlify's CDN keys its durable cache on the
 * path, so putting the package in the path gives every package a naturally
 * unique cache entry. The previous implementation passed the package as a query
 * param and had to DISABLE CDN caching entirely, because the CDN collapsed all
 * packages onto one cache key and served the same data for every package.
 * `endpoint`/`period` remain query params; we additionally emit `Netlify-Vary`
 * so those are folded into the cache key too, so nothing collides.
 *
 * Two layers of caching cut upstream hits:
 *   1. A module-level in-memory cache (survives across requests on a warm
 *      serverless instance). Stale entries are still served if pypistats.org is
 *      failing/rate-limiting — a slightly old number beats an empty chart.
 *   2. Durable CDN + browser caching via Cache-Control headers.
 *
 * On a 429 from pypistats.org we retry a couple of times with backoff before
 * giving up, and fall back to any cached value we have.
 */

import { getDiscoveredPackages } from '../../../utils/packageDiscovery.js';

// Module-level cache. Keyed by `<package>|<endpoint>|<period>`.
// Persists for the life of a warm serverless instance.
const responseCache = new Map();
const FRESH_TTL_MS = 12 * 60 * 60 * 1000; // 12h: served without hitting upstream
const STALE_TTL_MS = 48 * 60 * 60 * 1000; // up to 48h: served only as a fallback

const ALLOWED_ENDPOINTS = ['overall', 'recent'];

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function cacheKey(packageName, endpoint, period) {
    return `${packageName}|${endpoint}|${period || ''}`;
}

/**
 * Fetches from pypistats.org with a short server-side backoff on 429 / transient
 * errors. Returns the parsed JSON, or throws on unrecoverable failure.
 */
async function fetchFromUpstream(url) {
    const maxRetries = 3;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        let response;
        try {
            response = await fetch(url);
        } catch (error) {
            if (attempt === maxRetries) throw error;
            await sleep(Math.min(4000, 400 * 2 ** attempt) * (0.5 + Math.random()));
            continue;
        }

        if (response.ok) {
            return response.json();
        }

        // Retry rate limits and server errors; give up on other 4xx.
        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt === maxRetries) {
            const err = new Error(`pypistats.org returned ${response.status}`);
            err.status = response.status;
            throw err;
        }

        const retryAfter = Number(response.headers.get('retry-after'));
        const backoff = Math.min(4000, 400 * 2 ** attempt) * (0.5 + Math.random());
        const wait = Number.isFinite(retryAfter) && retryAfter > 0
            ? Math.min(retryAfter * 1000, 6000)
            : backoff;
        await sleep(wait);
    }
    // Unreachable, but keeps the compiler happy.
    throw new Error('pypistats.org fetch failed');
}

export default async function handler(req, res) {
  try {
    const { package: packageName, endpoint = 'overall', period } = req.query;

    if (!packageName) {
        return res.status(400).json({ error: 'Package name is required' });
    }
    if (!packageName.startsWith('openadapt')) {
        return res.status(400).json({ error: 'Only openadapt-* packages are allowed' });
    }
    if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    try {
        const allowedPackages = await getDiscoveredPackages();
        if (!allowedPackages.includes(packageName)) {
            return res.status(400).json({
                error: 'Package not found in discovered openadapt packages',
                hint: 'Package may not exist on PyPI yet',
            });
        }
    } catch (error) {
        console.error('Error validating package:', error);
        return res.status(500).json({ error: 'Failed to validate package', message: error.message });
    }

    const key = cacheKey(packageName, endpoint, period);
    const cached = responseCache.get(key);
    const now = Date.now();

    // Caching headers: package is in the path (unique CDN key); vary the rest by query.
    // Durable CDN cache for 12h with a day of stale-while-revalidate; browser 1h.
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.setHeader(
        'Netlify-CDN-Cache-Control',
        'public, durable, s-maxage=43200, stale-while-revalidate=86400',
    );
    res.setHeader('Netlify-Vary', 'query=endpoint|period');
    res.setHeader('Cache-Tag', `pypistats-${packageName}-${endpoint}`);

    // Fresh in-memory hit: serve without touching upstream.
    if (cached && now - cached.timestamp < FRESH_TTL_MS) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cached.data);
    }

    // Build upstream URL. 'recent' with no period returns last_day/week/month.
    let url = `https://pypistats.org/api/packages/${packageName}/${endpoint}?mirrors=true`;
    if (period) {
        url += `&period=${period}`;
    }

    try {
        const data = await fetchFromUpstream(url);
        responseCache.set(key, { data, timestamp: now });
        res.setHeader('X-Cache', cached ? 'REVALIDATED' : 'MISS');
        return res.status(200).json(data);
    } catch (error) {
        // Upstream failed (often 429). Prefer a stale cached value over an error.
        if (cached && now - cached.timestamp < STALE_TTL_MS) {
            console.warn(
                `pypistats upstream failed for ${packageName}/${endpoint} (${error.message}); serving stale cache`,
            );
            res.setHeader('X-Cache', 'STALE');
            return res.status(200).json(cached.data);
        }
        // pypistats.org has no record of this package (404). Expected for a
        // package that exists on PyPI but has no download history yet, or any
        // name that slipped past discovery. Degrade quietly to an empty payload
        // so the client excludes it from the chart — never a 502.
        if (error.status === 404) {
            console.warn(`pypistats has no data for ${packageName}/${endpoint}; excluding from chart`);
            return res.status(404).json({
                error: 'Package not found on pypistats.org',
                package: packageName,
                data: [],
            });
        }
        console.warn(`pypistats upstream failed for ${packageName}/${endpoint}: ${error.message}`);
        const status = error.status === 429 ? 429 : 502;
        return res.status(status).json({ error: `pypistats.org error: ${error.message}` });
    }
  } catch (error) {
    // Last-resort guard: no matter what threw above, return JSON rather than
    // letting the serverless function crash (which surfaces as a 502).
    console.error(`Unexpected error in pypistats handler for ${req.query?.package}:`, error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal error', message: error.message });
    }
  }
}
