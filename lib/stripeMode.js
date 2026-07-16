function stripeModeMatches(secretKey, expectedMode) {
    if (!secretKey || !expectedMode) return false
    if (expectedMode === 'live') {
        return secretKey.startsWith('sk_live_') || secretKey.startsWith('rk_live_')
    }
    if (expectedMode === 'test') {
        return secretKey.startsWith('sk_test_') || secretKey.startsWith('rk_test_')
    }
    return false
}

module.exports = { stripeModeMatches }
