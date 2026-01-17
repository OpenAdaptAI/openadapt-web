/**
 * Utility functions for fetching and processing PyPI package version history
 */

/**
 * Helper function to determine release type from semantic version
 * @param {string} version - Semantic version string (e.g., "1.0.0")
 * @returns {string} - "major", "minor", or "patch"
 */
export function getReleaseType(version) {
    try {
        const [major, minor, patch] = version.split('.').map(Number);

        // If it's a pre-release (has letters), treat as patch
        if (version.includes('a') || version.includes('b') || version.includes('rc')) {
            return 'patch';
        }

        // Major release: X.0.0 (but not 0.0.0)
        if (major > 0 && minor === 0 && patch === 0) {
            return 'major';
        }

        // Minor release: 0.X.0 (patch is 0)
        if (patch === 0) {
            return 'minor';
        }

        // Otherwise it's a patch
        return 'patch';
    } catch (error) {
        console.error('Error parsing version:', version, error);
        return 'patch';
    }
}

/**
 * Fetches version history for a package from PyPI API
 * @param {string} packageName - Name of the PyPI package
 * @returns {Promise<Array>} - Array of version objects with version, date, type, yanked
 */
export async function getPackageVersionHistory(packageName) {
    try {
        const response = await fetch(`https://pypi.org/pypi/${packageName}/json`);

        if (!response.ok) {
            throw new Error(`Failed to fetch version history: ${response.status}`);
        }

        const data = await response.json();

        // Extract version history from releases
        const versionHistory = Object.entries(data.releases)
            .map(([version, files]) => {
                // Some versions might not have files
                if (!files || files.length === 0) {
                    return null;
                }

                const firstFile = files[0];
                const uploadTime = firstFile.upload_time_iso_8601 || firstFile.upload_time;

                if (!uploadTime) {
                    return null;
                }

                // Extract just the date (YYYY-MM-DD)
                const date = uploadTime.split('T')[0];

                return {
                    version,
                    date,
                    type: getReleaseType(version),
                    yanked: firstFile.yanked || false,
                    requiresPython: firstFile.requires_python || null,
                };
            })
            .filter(v => v !== null) // Filter out malformed entries
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending

        return versionHistory;
    } catch (error) {
        console.error(`Error fetching version history for ${packageName}:`, error);
        return [];
    }
}

/**
 * Finds the version that was current on a specific date
 * @param {Array} versionHistory - Array of version objects
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {object|null} - Version object or null if no version found
 */
export function getVersionForDate(versionHistory, dateStr) {
    if (!versionHistory || versionHistory.length === 0) {
        return null;
    }

    const targetDate = new Date(dateStr);

    // Find the most recent version before or on the target date
    const currentVersion = versionHistory
        .filter(v => new Date(v.date) <= targetDate)
        .pop(); // Get the last (most recent) one

    return currentVersion || null;
}

/**
 * Checks if a version was released on a specific date
 * @param {Array} versionHistory - Array of version objects
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {object|null} - Version object if released on that date, null otherwise
 */
export function getVersionReleasedOnDate(versionHistory, dateStr) {
    if (!versionHistory || versionHistory.length === 0) {
        return null;
    }

    return versionHistory.find(v => v.date === dateStr) || null;
}
