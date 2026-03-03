# Package List Architecture - Auto-Discovery

## Overview

Package discovery automatically finds all `openadapt-*` repos from the OpenAdaptAI GitHub org and verifies them against PyPI. No manual list maintenance needed.

## Discovery Flow

```
1. Fetch all public repos from github.com/OpenAdaptAI
2. Filter to names matching openadapt or openadapt-*
3. Verify each exists on PyPI (HEAD request)
4. Cache results for 24 hours
5. If GitHub fails → use static FALLBACK_PACKAGES
6. If PyPI fails → use stale cache or fallback
```

## Architecture

```
GitHub API (orgs/OpenAdaptAI/repos)
        │
        ▼
utils/packageDiscovery.js  ← SINGLE SOURCE OF TRUTH
  - fetchGitHubRepoNames()   (auto-discover candidates)
  - packageExists()           (verify on PyPI)
  - discoverPackages()        (orchestrate + cache)
  - FALLBACK_PACKAGES         (last resort)
        │
        ▼
/pages/api/discover-packages.js  (HTTP endpoint)
        │
        ├──► utils/pypiStats.js
        ├──► utils/pypistatsHistory.js
        └──► components/PyPIDownloadChart.js
```

## Adding a New Package

**No code changes needed.** Just:
1. Create a repo named `openadapt-*` under `OpenAdaptAI` on GitHub
2. Publish it to PyPI

It will appear automatically after the 24-hour cache expires (or on next deployment).

If you want it in the fallback list (shown when both GitHub and PyPI are down), add it to `FALLBACK_PACKAGES` in `utils/packageDiscovery.js`.

## File Responsibilities

| File | Role |
|------|------|
| `utils/packageDiscovery.js` | Core discovery logic (GitHub + PyPI) |
| `pages/api/discover-packages.js` | HTTP endpoint for client code |
| `utils/pypiStats.js` | Shields.io download stats |
| `utils/pypistatsHistory.js` | Historical stats |
| `components/PyPIDownloadChart.js` | UI chart component |

## Testing

```bash
curl https://openadapt.ai/api/discover-packages
```

## Caching

- **Server-side**: 24 hours in `packageDiscovery.js`
- **Client-side**: 24 hours in utility functions
- **GitHub API**: 60 req/hr unauthenticated (one call per 24h = fine)
