// Server-only GitHub API access.
//
// Visitor browsers must NEVER call api.github.com: unauthenticated requests
// are limited to 60/hour per client IP, so anyone on a shared IP (offices,
// VPNs, CGNAT) gets 403s and sees broken release lists and social proof.
// All GitHub data is fetched here from server-side loaders: getStaticProps
// during build/revalidation or same-origin API routes at runtime (dynamic
// imports only — keep this module out of client bundles).
//
// An optional GITHUB_TOKEN environment variable raises the rate limit for
// server/build requests. It is never shipped to the client.

const GITHUB_API_BASE = 'https://api.github.com'

function githubHeaders() {
    const headers = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'OpenAdapt-Web/1.0 (https://openadapt.ai)',
    }
    const token = process.env.GITHUB_TOKEN
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    return headers
}

async function fetchGitHubJson(pathname) {
    const response = await fetch(`${GITHUB_API_BASE}${pathname}`, {
        headers: githubHeaders(),
    })
    if (!response.ok) {
        throw new Error(`GitHub API ${response.status} for ${pathname}`)
    }
    return response.json()
}

/**
 * Fetch current star/fork social proof and throw on failure.
 * Server-side cache/fallback policy belongs to the caller.
 */
export async function fetchRepoSocialProof(repository) {
    const data = await fetchGitHubJson(`/repos/${repository}`)
    if (
        typeof data.stargazers_count !== 'number' ||
        typeof data.forks_count !== 'number'
    ) {
        throw new Error(`GitHub repository stats malformed for ${repository}`)
    }
    return {
        stars: data.stargazers_count,
        forks: data.forks_count,
    }
}

/**
 * Star/fork social proof for a repository.
 * Returns the provided verified fallback on any failure so a network miss
 * never becomes misleading 0/0 social proof.
 */
export async function getRepoSocialProof(repository, fallback) {
    try {
        return await fetchRepoSocialProof(repository)
    } catch (err) {
        // Fall through to the dated, verified fallback.
    }
    return { ...fallback }
}

/**
 * Open issues carrying a label (e.g. main-broken) as {id, url} objects.
 * Returns [] on any failure — the warning banner simply does not render.
 */
export async function getOpenIssuesByLabel(repository, label) {
    try {
        const issues = await fetchGitHubJson(
            `/repos/${repository}/issues?state=open&labels=${encodeURIComponent(label)}`
        )
        return (Array.isArray(issues) ? issues : [])
            .filter((issue) => issue && typeof issue.number === 'number')
            .map((issue) => ({ id: issue.number, url: issue.html_url }))
    } catch (err) {
        return []
    }
}

/**
 * The newest complete Experimental desktop prerelease, slimmed to the fields
 * the download page renders (getStaticProps props must stay small and
 * JSON-serializable).
 *
 * Returns { release, fetchFailed }:
 * - release: slim release object, or null
 * - fetchFailed: true when GitHub could not be reached (renders the
 *   "open releases on GitHub" fallback), false when GitHub answered but no
 *   complete prerelease exists yet.
 */
export async function getExperimentalDesktopRelease() {
    const { DESKTOP_REPO, selectExperimentalDesktopRelease } = await import(
        '../utils/desktopRelease'
    )
    try {
        const releases = await fetchGitHubJson(
            `/repos/${DESKTOP_REPO}/releases?per_page=20`
        )
        const selected = selectExperimentalDesktopRelease(releases)
        if (!selected) {
            return { release: null, fetchFailed: false }
        }
        return {
            release: {
                tag_name: selected.tag_name || null,
                name: selected.name || null,
                assets: (selected.assets || [])
                    .filter(
                        (asset) =>
                            asset &&
                            typeof asset.name === 'string' &&
                            typeof asset.browser_download_url === 'string'
                    )
                    .map((asset) => ({
                        name: asset.name,
                        size: typeof asset.size === 'number' ? asset.size : null,
                        browser_download_url: asset.browser_download_url,
                    })),
            },
            fetchFailed: false,
        }
    } catch (err) {
        return { release: null, fetchFailed: true }
    }
}
