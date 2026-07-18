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

function completeRelease(tag, publishedAt) {
    const version = tag.replace('desktop-v', '')
    const prefix = `OpenAdapt-Desktop-Experimental-v${version}`
    return experimentalRelease({
        tag_name: tag,
        published_at: publishedAt,
        assets: [
            asset(`${prefix}-macos-arm64-adhoc.dmg`),
            asset(`${prefix}-macos-x86_64-adhoc.dmg`),
            asset(`${prefix}-windows-x86_64-unsigned.msi`),
            asset(`${prefix}-windows-x86_64-unsigned-nsis-setup.exe`),
            asset(`${prefix}-linux-x86_64-unsigned.AppImage`),
            asset(`${prefix}-linux-x86_64-unsigned.deb`),
            asset('SHA256SUMS', 512),
        ],
    })
}

describe('download page is server-rendered', () => {
    it('ships the desktop release state in the initial HTML', () => {
        // The release list is resolved in getStaticProps, so the raw HTML
        // (before any JavaScript runs) must already contain a definite
        // state — never a client-side loading placeholder.
        cy.request('/download').its('body').then((html) => {
            expect(html).to.not.include('Finding the latest release')
            const definiteStates = [
                'Experimental prerelease', // ready
                'No public desktop installer yet', // none
                'We could not reach GitHub just now', // build-time fetch miss
            ]
            expect(
                definiteStates.some((state) => html.includes(state)),
                'initial HTML contains a server-resolved release state'
            ).to.equal(true)
        })
    })

    it('never calls api.github.com from the visitor browser', () => {
        // api.github.com allows 60 unauthenticated requests/hour per client
        // IP, so any browser-side call 403s on shared IPs. Fail loudly if
        // one reappears.
        cy.intercept('https://api.github.com/**', { statusCode: 418 }).as(
            'githubApi'
        )
        cy.visit('/download')
        cy.get('#desktop-builds').should('be.visible')
        cy.contains('Finding the latest release').should('not.exist')
        cy.get('@githubApi.all').should('have.length', 0)
    })
})

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

    it('uses publication metadata instead of relying on API response order', () => {
        const older = completeRelease(
            'desktop-v0.1.1',
            '2026-07-16T17:03:15Z'
        )
        const latest = completeRelease(
            'desktop-v0.5.1',
            '2026-07-18T20:03:56Z'
        )

        expect(selectExperimentalDesktopRelease([older, latest])).to.equal(
            latest
        )
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
