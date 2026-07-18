function preferReducedMotion(win) {
    const defaultMatchMedia = win.matchMedia.bind(win)
    win.matchMedia = (query) => {
        if (query !== '(prefers-reduced-motion: reduce)') {
            return defaultMatchMedia(query)
        }
        return {
            matches: true,
            media: query,
            onchange: null,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            dispatchEvent() {
                return false
            },
        }
    }
}

function preferMotion(win) {
    const defaultMatchMedia = win.matchMedia.bind(win)
    win.matchMedia = (query) => {
        if (query !== '(prefers-reduced-motion: reduce)') {
            return defaultMatchMedia(query)
        }
        return {
            matches: false,
            media: query,
            onchange: null,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            dispatchEvent() {
                return false
            },
        }
    }
}

function emulateReducedMotion(value) {
    return Cypress.automation('remote:debugger:protocol', {
        command: 'Emulation.setEmulatedMedia',
        params: {
            features: [
                {
                    name: 'prefers-reduced-motion',
                    value,
                },
            ],
        },
    })
}

describe('Cloud product preview', () => {
    it('autoplays a labeled demonstration walkthrough with a pause control', () => {
        cy.viewport(1280, 1700)
        cy.then(() => emulateReducedMotion('no-preference'))
        cy.visit('/', { onBeforeLoad: preferMotion })

        cy.get('#cloud-product').scrollIntoView().should('be.visible')
        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            cy.get('[data-testid="dashboard-preview-media-label"]')
                .should('be.visible')
                .and('have.text', 'Product preview · demonstration data')
            cy.get('video').should(($video) => {
                expect($video).to.have.attr('autoplay')
                expect($video).to.have.attr('loop')
                expect($video).to.have.attr('playsinline')
            })
            cy.get('video').then(($video) => {
                expect($video[0].muted).to.equal(true)
            })
            cy.contains('button', 'Pause')
                .should('be.visible')
                .click()
            cy.contains('button', 'Play').should('be.visible')
        })

        cy.screenshot('dashboard-showcase-desktop', {
            capture: 'viewport',
        })
    })

    it('shows the labeled static fallback for reduced motion', () => {
        cy.viewport(390, 844)
        cy.then(() => emulateReducedMotion('reduce'))
        cy.visit('/', { onBeforeLoad: preferReducedMotion })

        cy.get('#cloud-product').scrollIntoView().should('be.visible')
        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            cy.get('[data-reduced-motion="true"]').should('exist')
            cy.get('video').should('not.be.visible')
            cy.get('img[alt*="synthetic demonstration workflows"]')
                .should('be.visible')
            cy.get('[data-testid="dashboard-preview-media-label"]')
                .should('be.visible')
                .and('have.text', 'Product preview · demonstration data')
            cy.get('button[aria-label$="product preview"]').should(
                'not.be.visible'
            )
        })

        cy.get('#cloud-product').screenshot(
            'dashboard-showcase-mobile-reduced-motion'
        )
    })
})
