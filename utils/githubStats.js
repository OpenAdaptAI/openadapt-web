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
        const releaseName = release.name;
        return release.assets.reduce((acc, asset) => {
            if (asset.name === `OpenAdapt-${releaseName}.zip`) {
                return acc + asset.download_count;
            }
            return acc;
        }, 0);
    }

    function getMacDownloadCount(release) {
        const releaseName = release.name;
        return release.assets.reduce((acc, asset) => {
            if (asset.name === `OpenAdapt-${releaseName}.app.zip`) {
                return acc + asset.download_count;
            }
            return acc;
        }, 0);
    }

    let page = 1;
    let windowsDownloadCount = 0;
    let macDownloadCount = 0;
    let releaseData = [];

    do {
        releaseData = await getReleaseData({ page: page });
        if (releaseData.length > 0) {
            windowsDownloadCount += releaseData.reduce((acc, release) => {
                return acc + getWindowsDownloadCount(release);
            }, 0);
            macDownloadCount += releaseData.reduce((acc, release) => {
                return acc + getMacDownloadCount(release);
            }, 0);
        }
        page++;
    } while (releaseData.length === 30);

    return { windowsDownloadCount, macDownloadCount };
}
