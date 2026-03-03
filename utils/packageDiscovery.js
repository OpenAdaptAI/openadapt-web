/**
 * Shared utility for discovering openadapt-* packages
 *
 * *** SINGLE SOURCE OF TRUTH FOR PACKAGE DISCOVERY LOGIC ***
 * Used by:
 * - /api/discover-packages.js (HTTP endpoint)
 * - /api/pypistats.js (server-side direct import)
 *
 * Discovery flow:
 * 1. Fetch all public openadapt-* repos from the OpenAdaptAI GitHub org
 *    (includes name + description for free)
 * 2. Verify each repo name exists as a package on PyPI
 * 3. Cache results for 24 hours
 * 4. Fall back to a static list if GitHub + PyPI discovery both fail
 */

const GITHUB_ORG = 'OpenAdaptAI';

/**
 * Fetches all public openadapt-* repos from the GitHub org.
 * Uses the unauthenticated API (60 req/hr limit, fine with 24h cache).
 * @returns {Promise<Array<{name: string, description: string}>>}
 */
async function fetchGitHubRepos() {
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
        .filter((r) => !r.private && !r.archived)
        .filter((r) => {
            const name = r.name.toLowerCase();
            return name === 'openadapt' || name.startsWith('openadapt-');
        })
        .map((r) => ({
            name: r.name.toLowerCase(),
            description: r.description || '',
            stars: r.stargazers_count || 0,
            language: r.language || '',
            pushed_at: r.pushed_at || '',
            html_url: r.html_url || '',
        }));
}

// FALLBACK - only used when both GitHub and PyPI discovery fail
// Must include ALL public openadapt-* repos from the OpenAdaptAI org
// Last updated: 2026-03-03
const FALLBACK_PACKAGES = [
    { name: 'openadapt', description: 'AI-First process automation with large multimodal models', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-agent', description: 'Production execution engine for OpenAdapt GUI automation agents', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-bootstrap', description: 'Self-hosting infrastructure for OpenAdapt recursive development', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-capture', description: 'GUI interaction capture with time-aligned media', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-consilium', description: 'Multi-LLM council for consensus-driven AI responses with cross-model review', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-crier', description: 'Event-driven social media approval bot with Telegram', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-desktop', description: 'Cross-platform system tray app for continuous screen recording and AI training data', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-evals', description: 'Evaluation infrastructure for GUI agent benchmarks', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-grounding', description: 'Temporal smoothing for UI element detection with OmniParser integration', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-herald', description: 'LLM-powered social media announcements from your git history', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-ml', description: 'ML toolkit for training and evaluating multimodal GUI-action models', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-privacy', description: 'PII/PHI detection and redaction for GUI automation data', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-retrieval', description: 'Multimodal demo retrieval for GUI automation', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-telemetry', description: 'Unified error tracking and usage analytics for OpenAdapt packages', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-tray', description: 'System tray application for OpenAdapt', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-viewer', description: 'HTML viewer components for ML dashboards and benchmarks', stars: 0, language: 'Python', pushed_at: '', html_url: '' },
    { name: 'openadapt-web', description: 'Marketing website for OpenAdapt.AI', stars: 0, language: 'JavaScript', pushed_at: '', html_url: '' },
    { name: 'openadapt-wright', description: 'AI-powered dev automation: iterative code generation, testing, and PR creation', stars: 0, language: 'TypeScript', pushed_at: '', html_url: '' },
];

let cachedResult = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Checks if a package exists on PyPI
 * @param {string} packageName
 * @returns {Promise<boolean>}
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
 * Discovers all openadapt-* packages with descriptions.
 * @returns {Promise<{packages: Array<{name: string, description: string}>, timestamp: number, cached?: boolean, stale?: boolean, fallback?: boolean}>}
 */
export async function discoverPackages() {
    if (cachedResult && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return { ...cachedResult, cached: true };
    }

    // Build candidate list: prefer GitHub, fall back to static
    let candidates;
    try {
        candidates = await fetchGitHubRepos();
    } catch (error) {
        console.warn('GitHub discovery failed, using static list:', error.message);
        candidates = FALLBACK_PACKAGES;
    }

    try {
        const packages = await Promise.all(
            candidates.map(async (pkg) => ({
                ...pkg,
                on_pypi: await packageExists(pkg.name),
            }))
        );

        cachedResult = { packages, timestamp: Date.now() };
        cacheTimestamp = cachedResult.timestamp;

        return { ...cachedResult, cached: false };
    } catch (error) {
        console.error('Error discovering packages:', error);

        if (cachedResult) {
            console.warn('Using stale cache due to discovery error');
            return { ...cachedResult, stale: true };
        }

        console.warn('No cache available, using fallback');
        return {
            packages: FALLBACK_PACKAGES,
            timestamp: Date.now(),
            fallback: true,
        };
    }
}

/**
 * Gets just the package names (backward compatibility).
 * @returns {Promise<string[]>}
 */
export async function getDiscoveredPackages() {
    const result = await discoverPackages();
    return result.packages.map((p) => p.name);
}

export { FALLBACK_PACKAGES, CACHE_DURATION };
