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
    it('supports the guided tour and interactive reference states', () => {
        cy.viewport(1280, 1700)
        cy.then(() => emulateReducedMotion('no-preference'))
        cy.visit('/hosted/welcome', { onBeforeLoad: preferMotion })

        cy.get('#cloud-product').scrollIntoView().should('be.visible')
        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            cy.get('[data-testid="dashboard-preview-brand"]')
                .should('be.visible')
                .and('contain.text', 'OpenAdapt')
                .and('contain.text', 'Cloud')
            cy.get('[data-reference="healthcare"]')
                .should('have.attr', 'data-view', 'workflow')
                .and('have.attr', 'data-playing', 'true')
            cy.wait(4300)
            cy.get('[data-reference="healthcare"]').should(
                'have.attr',
                'data-view',
                'run'
            )
            cy.contains('button', 'Pause tour').click()
            cy.get('[data-reference="healthcare"]').should(
                'have.attr',
                'data-playing',
                'false'
            )
        })
        cy.get('[data-testid="dashboard-reference-lending"]')
            .focus()
            .should('be.focused')
            .click()
        cy.get('[data-testid="dashboard-reference-lending"]')
            .should('have.attr', 'aria-pressed', 'true')
        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            cy.contains('h3', 'Frappe Lending').should('be.visible')
            cy.get('[data-testid="dashboard-view-evidence"]')
                .click()
                .should('have.attr', 'aria-pressed', 'true')
            cy.contains('h4', 'Independent readback').should('be.visible')
            cy.contains('dt', 'SQL delta').should('be.visible')
            // Footage keeps playing (animated GIF) even though selecting a
            // reference/view pauses the guided tour — only reduced motion
            // shows the static still.
            cy.get('[data-testid="dashboard-reference-media"]')
                .should('have.attr', 'src')
                .and('include', '/cloud-preview/lending-evidence.gif')
            // EVERY view renders real Cloud app footage as an animated .gif
            // in normal motion mode — no view is a static-only slot.
            for (const view of ['workflow', 'run', 'evidence', 'report']) {
                cy.get(`[data-testid="dashboard-view-${view}"]`).click()
                cy.get('[data-testid="dashboard-reference-media"]')
                    .should('be.visible')
                    .and('have.attr', 'src')
                    .and('include', `/cloud-preview/lending-${view}.gif`)
            }
            cy.contains('button', 'Play tour').click()
            cy.get('[data-reference="lending"]').should(
                'have.attr',
                'data-playing',
                'true'
            )
        })

        cy.contains('Reference workflows using synthetic records').should(
            'be.visible'
        )
        cy.get('#cloud-product').should(
            'not.contain.text',
            'demo.openadapt.ai'
        )
        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            cy.contains('button', 'Pause tour').click()
            cy.get('[data-playing="false"]').should('exist')
        })
        cy.get('[data-testid="dashboard-preview-brand"]').scrollIntoView({
            offset: { top: -70, left: 0 },
        })
        cy.screenshot('dashboard-showcase-desktop', {
            capture: 'viewport',
        })
        cy.get('[data-reference="lending"]').screenshot(
            'dashboard-showcase-detail-desktop'
        )
    })

    it('keeps the interactive preview static for reduced motion on mobile', () => {
        cy.viewport(390, 844)
        cy.then(() => emulateReducedMotion('reduce'))
        cy.visit('/hosted/welcome', { onBeforeLoad: preferReducedMotion })

        cy.get('#cloud-product').scrollIntoView().should('be.visible')
        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            cy.get('[data-reduced-motion="true"]')
                .should('have.attr', 'data-playing', 'false')
            cy.get('[data-testid="dashboard-tour-status"]')
                .should('be.visible')
                .and('have.text', 'Tour paused for reduced motion')
            cy.get('[data-testid="dashboard-reference-media"]')
                .should('be.visible')
                .and('have.attr', 'src')
                .and('include', '/cloud-preview/healthcare-workflow.jpg')
        })
        cy.get('[data-testid="dashboard-reference-insurance"]')
            .click()
            .should('have.attr', 'aria-pressed', 'true')
        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            cy.get('[data-testid="dashboard-view-report"]')
                .focus()
                .should('be.focused')
                .click()
            cy.get('[data-testid="dashboard-view-report"]')
                .should('have.attr', 'aria-pressed', 'true')
            cy.contains('h4', 'openIMIS reference').should('be.visible')
            cy.contains('dt', 'Wrong-policyholder writes').should(
                'be.visible'
            )
            cy.get('[data-testid="dashboard-reference-media"]')
                .should('have.attr', 'src')
                .and('include', '/cloud-preview/insurance-report.jpg')
            cy.contains('button', /tour/i).should('not.exist')
        })

        cy.get('#cloud-product').screenshot(
            'dashboard-showcase-mobile-reduced-motion'
        )
    })
})
