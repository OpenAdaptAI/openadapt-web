const RELEASES_API =
    'https://api.github.com/repos/OpenAdaptAI/openadapt-desktop/releases?per_page=20'

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

describe('desktop downloads', () => {
    it('does not imply installers exist before a complete prerelease is public', () => {
        cy.intercept('GET', RELEASES_API, {
            body: [
                {
                    draft: false,
                    prerelease: false,
                    tag_name: 'v0.3.2',
                    assets: [asset('openadapt_desktop-0.3.2-py3-none-any.whl')],
                },
            ],
        })
        cy.visit('/download')

        cy.contains('Experimental desktop')
        cy.contains('No public desktop installer yet')
        cy.contains('Install the working CLI')
            .should('have.attr', 'href')
            .and('equal', 'https://docs.openadapt.ai')
        cy.contains('All downloads').should('not.exist')
        cy.contains('First launch').should('not.exist')
    })

    it('selects a complete desktop-v Experimental prerelease and exact assets', () => {
        const incomplete = experimentalRelease({
            tag_name: 'desktop-v0.2.0',
            assets: [asset('unrelated.msi')],
        })
        cy.intercept('GET', RELEASES_API, {
            body: [incomplete, experimentalRelease()],
        })
        cy.visit('/download')

        cy.contains('Experimental prerelease desktop-v0.1.0')
        cy.contains('All downloads')
        cy.contains('Windows (x64)')
            .parents('.rounded-xl')
            .contains('Download')
            .should(
                'have.attr',
                'href',
                'https://downloads.example/OpenAdapt-Desktop-Experimental-v0.1.0-windows-x86_64-unsigned.msi'
            )
        cy.contains('macOS (Apple Silicon)')
        cy.contains('macOS (Intel)')
        cy.contains('Linux (x64)')
        cy.contains('The DMGs are ad-hoc signed')
        cy.contains('The Windows installers are not yet Authenticode signed')
        cy.contains('Download SHA256SUMS')
            .should('have.attr', 'href')
            .and('equal', 'https://downloads.example/SHA256SUMS')
    })
})
