# Package List Architecture - Single Source of Truth

## Overview

This document describes the architecture for managing the list of OpenAdapt packages across the codebase. The design ensures a single source of truth to avoid duplication and inconsistencies.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│         /pages/api/discover-packages.js                     │
│         *** SINGLE SOURCE OF TRUTH ***                       │
│                                                               │
│  1. POTENTIAL_PACKAGES list (packages to check)             │
│  2. Verifies each against PyPI API                          │
│  3. Returns only packages that exist                        │
│  4. Falls back to FALLBACK list if discovery fails          │
│  5. 24-hour server-side cache                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ API Call: /api/discover-packages
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────────┐          ┌──────────────────────┐
│ utils/pypiStats.js│          │ utils/pypistats      │
│                   │          │ History.js           │
│ - getPackageList()│          │                      │
│ - 24h client cache│          │ - getPackageList()   │
└───────┬───────────┘          │ - 24h client cache   │
        │                      └──────────┬───────────┘
        │                                 │
        │                                 │
        └────────┬────────────────────────┘
                 │
                 │ Called by client-side code
                 │
                 ▼
        ┌────────────────────┐
        │ components/        │
        │ PyPIDownloadChart  │
        └────────────────────┘
```

## Key Principles

### 1. Single Source of Truth
- **ONLY** `/pages/api/discover-packages.js` defines package lists
- All other code fetches from this API endpoint
- No duplicate hardcoded lists elsewhere in the codebase

### 2. Two-Level Caching
- **Server-side cache**: 24 hours (in `discover-packages.js`)
- **Client-side cache**: 24 hours (in utility functions)
- Minimizes API calls while keeping data fresh

### 3. Graceful Degradation
```
1. Try to fetch from /api/discover-packages
2. If API succeeds → use fresh data
3. If API fails → use stale client-side cache (if exists)
4. If no cache → API returns its own fallback list
```

### 4. Fallback Strategy
The fallback list in `discover-packages.js` is only returned when:
- PyPI API is completely unreachable
- Network issues prevent discovery
- Critical errors during package verification

## File Responsibilities

### `/pages/api/discover-packages.js`
**Single source of truth for package lists**
- Maintains `POTENTIAL_PACKAGES` list (packages to check)
- Maintains `FALLBACK_PACKAGES` list (only used if discovery fails)
- Verifies packages exist on PyPI
- 24-hour server-side cache
- Returns JSON: `{ packages: [...], count: N, timestamp: ... }`

### `/pages/api/pypistats.js`
**PyPI stats proxy API**
- Calls `/api/discover-packages` to get package list
- Uses list to validate incoming package name requests
- No hardcoded package lists
- 24-hour server-side cache for package list

### `/utils/pypiStats.js`
**Client-side utility for Shields.io stats**
- Calls `/api/discover-packages` to get package list
- 24-hour client-side cache
- Falls back to stale cache if API unavailable
- No hardcoded package lists

### `/utils/pypistatsHistory.js`
**Client-side utility for historical stats**
- Calls `/api/discover-packages` to get package list
- 24-hour client-side cache
- Falls back to stale cache if API unavailable
- No hardcoded package lists

### `/components/PyPIDownloadChart.js`
**UI component**
- Uses utilities from `utils/pypistatsHistory.js`
- Never directly fetches package list
- Relies entirely on utility functions

## Adding a New Package

To add a new OpenAdapt package to the system:

1. **Add to POTENTIAL_PACKAGES** in `/pages/api/discover-packages.js`:
   ```javascript
   const POTENTIAL_PACKAGES = [
       'openadapt',
       'openadapt-ml',
       // ... existing packages
       'openadapt-newpackage', // Add here
   ];
   ```

2. **Optionally add to FALLBACK list** (if package already exists on PyPI):
   ```javascript
   const fallbackPackages = [
       'openadapt',
       'openadapt-ml',
       // ... existing packages
       'openadapt-newpackage', // Add here if already published
   ];
   ```

3. **That's it!** All other code will automatically pick up the new package after cache expires (max 24 hours) or on next deployment.

## Testing

### Test Package Discovery
```bash
curl https://openadapt.ai/api/discover-packages
```

Expected response:
```json
{
  "packages": ["openadapt", "openadapt-ml", ...],
  "count": 8,
  "timestamp": 1705612800000,
  "cacheExpiresAt": "2025-01-19T12:00:00.000Z"
}
```

### Test with Fallback
If discovery fails, you'll see:
```json
{
  "packages": ["openadapt", ...],
  "count": 8,
  "fallback": true,
  "error": "Failed to discover packages, using fallback list"
}
```

## Migration Notes

### What Changed (PR #123)

**Before:**
- Package lists duplicated in 4+ files
- Each file had its own fallback logic
- Inconsistent package lists across codebase
- Hard to maintain and update

**After:**
- Single source of truth in `discover-packages.js`
- All code fetches from one API endpoint
- Consistent package lists everywhere
- Easy to add new packages (one file)

### Removed Duplication
The following duplicate lists were removed:
- ❌ Fallback list in `/pages/api/pypistats.js`
- ❌ Fallback list in `/utils/pypiStats.js`
- ❌ Fallback list in `/utils/pypistatsHistory.js`

### Updated Error Handling
- Client utilities now rely on stale cache if API fails
- Better error messages and logging
- Graceful degradation instead of hard failures

## Benefits

1. **Maintainability**: Update package list in ONE place
2. **Consistency**: All code uses same package list
3. **Reliability**: Multiple levels of caching and fallbacks
4. **Performance**: Efficient caching reduces API calls
5. **Debugging**: Clear data flow and error messages

## Future Improvements

Potential enhancements:
- Add webhook to refresh cache when new packages published
- Implement package metadata caching (versions, descriptions)
- Add monitoring for package discovery failures
- Consider Redis for distributed cache in production

## Questions?

For questions or issues with package list management, refer to:
- This document
- Code comments in `/pages/api/discover-packages.js`
- PR #123 discussion

---

Last updated: 2025-01-18
