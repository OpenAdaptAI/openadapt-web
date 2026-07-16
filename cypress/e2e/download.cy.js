import {
    assetForPlatform,
    DESKTOP_PLATFORMS,
    detectDesktopPlatform,
    releaseSigningState,
    selectExperimentalDesktopRelease,
} from '../../utils/desktopRelease'

function asset(name, size = 1048576) {
    return {
        name,
        size,
        browser_download_url: `https://downloads.example/${name}`,
    }
}

function experimentalRelease(overrides = {}) {
    const prefix = 'OpenAdapt-Desktop-Experimental-v0.1.0'
    return {
        draft: false,
        prerelease: true,
        tag_name: 'desktop-v0.1.0',
        assets: [
            asset(`${prefix}-macos-arm64-adhoc.dmg`),
            asset(`${prefix}-macos-x86_64-adhoc.dmg`),
            asset(`${prefix}-windows-x86_64-unsigned.msi`),
            asset(`${prefix}-windows-x86_64-unsigned-nsis-setup.exe`),
            asset(`${prefix}-linux-x86_64-unsigned.AppImage`),
            asset(`${prefix}-linux-x86_64-unsigned.deb`),
            asset('SHA256SUMS', 512),
        ],
        ...overrides,
    }
}

describe('desktop release contract', () => {
    it('ignores legacy, draft, and incomplete releases', () => {
        const legacy = {
            draft: false,
            prerelease: false,
            tag_name: 'v0.3.2',
            assets: [asset('openadapt_desktop-0.3.2-py3-none-any.whl')],
        }
        const draft = experimentalRelease({ draft: true })
        const incomplete = experimentalRelease({
            tag_name: 'desktop-v0.2.0',
            assets: [asset('unrelated.msi')],
        })

        expect(
            selectExperimentalDesktopRelease([legacy, draft, incomplete])
        ).to.equal(null)
    })

    it('selects the newest complete desktop-v Experimental prerelease', () => {
        const incomplete = experimentalRelease({
            tag_name: 'desktop-v0.2.0',
            assets: [asset('unrelated.msi')],
        })
        const complete = experimentalRelease()
        const selected = selectExperimentalDesktopRelease([
            incomplete,
            complete,
        ])

        expect(selected).to.equal(complete)
        const windows = DESKTOP_PLATFORMS.find(
            (platform) => platform.id === 'windows'
        )
        expect(assetForPlatform(selected.assets, windows).name).to.equal(
            'OpenAdapt-Desktop-Experimental-v0.1.0-windows-x86_64-unsigned.msi'
        )
        expect(releaseSigningState(selected.assets)).to.deep.equal({
            macosNotarized: false,
            windowsSigned: false,
        })
    })

    it('does not guess unsupported or ambiguous architectures', () => {
        expect(
            detectDesktopPlatform({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
                platform: 'MacIntel',
            })
        ).to.equal(null)
        expect(
            detectDesktopPlatform({
                userAgent: 'Mozilla/5.0 (X11; Linux aarch64)',
                platform: 'Linux armv8l',
            })
        ).to.equal(null)
        expect(
            detectDesktopPlatform({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                platform: 'Win32',
            })
        ).to.equal('windows')
    })
})
