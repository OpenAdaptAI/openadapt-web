function getReleaseData(data) {
    const queryParams = new URLSearchParams({
        per_page: 30,
        page: 1,
        ...data,
    })
    return fetch(
        `https://api.github.com/repos/OpenAdaptAI/OpenAdapt/releases?${queryParams.toString()}`
    )
        .then((response) => response.json())
        .then((data) => {
            return data
        })
}

export async function getReleasesDownloadCount() {
    function getWindowsDownloadCount(release) {
        return release.assets.reduce((acc, asset) => {
            if (!asset.name.includes('.app')) {
                return acc + asset.download_count
            }
            return acc
        }, 0)
    }

    function getMacDownloadCount(release) {
        return release.assets.reduce((acc, asset) => {
            if (asset.name.includes('.app')) {
                return acc + asset.download_count
            }
            return acc
        }, 0)
    }

    let page = 1
    let releaseData = await getReleaseData({ page: page })
    let windowsDownloadCount = releaseData.reduce((acc, release) => {
        return acc + getWindowsDownloadCount(release)
    }, 0)
    let macDownloadCount = releaseData.reduce((acc, release) => {
        return acc + getMacDownloadCount(release)
    }, 0)

    while (releaseData.length === 30) {
        page++
        releaseData = await getReleaseData({ page: page })
        windowsDownloadCount += releaseData.reduce((acc, release) => {
            return acc + getWindowsDownloadCount(release)
        }, 0)
        macDownloadCount += releaseData.reduce((acc, release) => {
            return acc + getMacDownloadCount(release)
        }, 0)
    }
    return { windowsDownloadCount, macDownloadCount }
}
