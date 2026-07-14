/**
 * Shared client-side fetch helpers for spreading load across upstream APIs.
 *
 * Two building blocks:
 *  - fetchWithBackoff: retries a single request with exponential backoff + jitter,
 *    retrying only on rate-limit (429) and transient server/network errors, and
 *    honoring a Retry-After header when the server provides one.
 *  - mapWithConcurrency: runs an async mapper over a list with a bounded number of
 *    requests in flight at once (a small worker pool), preserving input order.
 *
 * Together these stop the homepage from firing ~all package requests at once,
 * which was overwhelming pypistats.org and triggering 429 rate limiting.
 */

/**
 * Sleeps for the given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parses a Retry-After header value into milliseconds.
 * Supports both the delta-seconds form ("120") and the HTTP-date form.
 * @param {string|null} value
 * @returns {number|null} - Delay in ms, or null if not parseable / not present.
 */
function parseRetryAfter(value) {
    if (!value) return null;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) {
        return Math.max(0, seconds * 1000);
    }
    const dateMs = Date.parse(value);
    if (Number.isFinite(dateMs)) {
        return Math.max(0, dateMs - Date.now());
    }
    return null;
}

/**
 * Fetches a URL with exponential backoff + jitter on rate-limit / transient errors.
 *
 * Retry policy:
 *  - 2xx/3xx: returned immediately.
 *  - 429: retried with backoff; honors Retry-After if present (capped).
 *  - 5xx and network errors: retried with backoff.
 *  - other 4xx: returned as-is (not retryable) so the caller can inspect status.
 *
 * Never throws — network errors are swallowed and surface as a null return once
 * retries are exhausted. Intentionally quiet: the caller emits a single concise
 * warning per resource on failure rather than logging every attempt.
 *
 * @param {string} url
 * @param {Object} [options]
 * @param {number} [options.maxRetries=4] - Max retry attempts after the first try.
 * @param {number} [options.baseDelayMs=500] - Base backoff delay.
 * @param {number} [options.maxDelayMs=8000] - Cap for any single backoff wait.
 * @param {RequestInit} [options.fetchOptions] - Passed through to fetch().
 * @returns {Promise<Response|null>} - The final Response, or null on total failure.
 */
export async function fetchWithBackoff(url, options = {}) {
    const {
        maxRetries = 4,
        baseDelayMs = 500,
        maxDelayMs = 8000,
        fetchOptions,
    } = options;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        let retryAfterMs = null;
        try {
            const response = await fetch(url, fetchOptions);

            if (response.ok) {
                return response;
            }

            // Non-retryable client errors (bad request, not found, ...) — return as-is.
            if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                return response;
            }

            // 429 rate limit: prefer the server's Retry-After hint when present.
            if (response.status === 429) {
                retryAfterMs = parseRetryAfter(response.headers.get('retry-after'));
            }

            // Out of retries: hand the failing response back for status inspection.
            if (attempt === maxRetries) {
                return response;
            }
        } catch (error) {
            // Network error / abort. Exhausted retries -> signal total failure.
            if (attempt === maxRetries) {
                return null;
            }
        }

        // Exponential backoff with full jitter, capped. Honor Retry-After if larger.
        const backoff = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
        const jittered = Math.random() * backoff;
        const delay = Math.max(jittered, retryAfterMs != null ? Math.min(retryAfterMs, maxDelayMs) : 0);
        await sleep(delay);
    }

    return null;
}

/**
 * Maps an async function over items with a bounded concurrency pool.
 * Results preserve the order of the input array. Never rejects on individual
 * failures — the mapper is responsible for catching and encoding its own errors
 * (e.g. returning null), mirroring Promise.allSettled semantics per item.
 *
 * @template T, R
 * @param {T[]} items
 * @param {(item: T, index: number) => Promise<R>} mapper
 * @param {number} [concurrency=3] - Max in-flight calls at any moment.
 * @returns {Promise<R[]>}
 */
export async function mapWithConcurrency(items, mapper, concurrency = 3) {
    const results = new Array(items.length);
    let nextIndex = 0;

    const worker = async () => {
        while (true) {
            const current = nextIndex++;
            if (current >= items.length) return;
            try {
                results[current] = await mapper(items[current], current);
            } catch (error) {
                results[current] = undefined;
            }
        }
    };

    const poolSize = Math.max(1, Math.min(concurrency, items.length));
    await Promise.all(Array.from({ length: poolSize }, worker));
    return results;
}
