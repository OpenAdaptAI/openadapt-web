import {
    assetForPlatform,
    DESKTOP_PLATFORMS,
    detectDesktopPlatform,
    detectDesktopPlatformWithHints,
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

    it('gives Macs an explicit architecture chooser when the browser withholds CPU details', () => {
        cy.visit('/download', {
            onBeforeLoad(win) {
                Object.defineProperty(win.navigator, 'platform', {
                    configurable: true,
                    value: 'MacIntel',
                })
                Object.defineProperty(win.navigator, 'userAgent', {
                    configurable: true,
                    value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
                })
                Object.defineProperty(win.navigator, 'userAgentData', {
                    configurable: true,
                    value: undefined,
                })
            },
        })

        cy.get('#desktop-builds').then(($builds) => {
            // A local/no-token build may intentionally render the
            // server-side GitHub-unavailable state. Production and
            // authenticated CI exercise the chooser when release props exist.
            if ($builds.text().includes('We could not reach GitHub')) return
            cy.wrap($builds)
                .should('contain.text', 'macOS detected')
                .and('contain.text', 'Choose your Mac processor')
                .and('contain.text', 'Download for Apple Silicon')
                .and('contain.text', 'Download for Intel')
                .and('not.contain.text', 'We could not safely choose')
        })
    })
})

describe('download page does not scroll horizontally on mobile', () => {
    // Common small-phone widths (iPhone SE / mini and iPhone 12/13/14).
    for (const width of [375, 390]) {
        it(`fits the viewport at ${width}px with no horizontal overflow`, () => {
            cy.viewport(width, 800)
            cy.visit('/download')
            // The desktop-preview section always renders; wait for it so the
            // measurement covers the real, fully laid-out page.
            cy.get('[data-testid="desktop-preview"]').should('exist')
            // Let the async PyPI chart and any client hints settle.
            cy.wait(1500)

            // globals.css sets `overflow-x: hidden` on html/body. That clamps
            // documentElement.scrollWidth in Chrome, so measuring it directly
            // would trivially pass and hide a real regression — and it does NOT
            // reliably stop horizontal panning on iOS Safari, which is exactly
            // the surface this guards. Neutralize the mask so scrollWidth
            // reflects the true content width before asserting.
            cy.document().then((doc) => {
                const style = doc.createElement('style')
                style.setAttribute('data-test-unmask', 'overflow')
                style.innerHTML =
                    'html, body { overflow-x: visible !important; width: auto !important; }'
                doc.head.appendChild(style)
            })

            cy.document()
                .its('documentElement.scrollWidth')
                .should('be.lte', width)
        })
    }
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

    it('routes ambiguous Macs to a macOS chooser and refuses unsupported architectures', () => {
        expect(
            detectDesktopPlatform({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
                platform: 'MacIntel',
            })
        ).to.equal('macos')
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

    it('uses architecture client hints when a Mac browser exposes them', async () => {
        expect(
            await detectDesktopPlatformWithHints({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
                platform: 'MacIntel',
                userAgentData: {
                    getHighEntropyValues: async () => ({
                        platform: 'macOS',
                        architecture: 'arm',
                        bitness: '64',
                    }),
                },
            })
        ).to.equal('macos-arm')

        expect(
            await detectDesktopPlatformWithHints({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
                platform: 'MacIntel',
                userAgentData: {
                    getHighEntropyValues: async () => {
                        throw new Error('withheld')
                    },
                },
            })
        ).to.equal('macos')
    })
})
