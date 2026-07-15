const BOOKING_URL =
    'https://cal.com/richard-abrich/30min?overlayCalendar=true'

function assertCanonicalBooking() {
    cy.get('iframe[title="Book a call with OpenAdapt"]')
        .should('have.attr', 'src')
        .and('equal', BOOKING_URL)
    cy.get('iframe[src*="calendly.com"]').should('not.exist')
}

describe('canonical booking destination', () => {
    it('uses Cal.com on the dedicated booking page', () => {
        cy.visit('/book')
        assertCanonicalBooking()
    })

    it('uses Cal.com after continuing through the homepage form', () => {
        cy.visit('/')
        cy.contains('button', 'Skip form and book now')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true })
        assertCanonicalBooking()
    })
})

describe('public product truth', () => {
    beforeEach(() => {
        cy.viewport(1280, 900)
        cy.visit('/')
    })

    it('leads with the governed compiler and routes each audience', () => {
        cy.get('h1').should(
            'contain.text',
            'Compile repeated GUI work into governed, deterministic workflows.'
        )
        cy.contains('Developer').should('be.visible')
        cy.contains('Automation & operations').should('be.visible')
        cy.contains('Regulated enterprise').should('be.visible')
        cy.get('a[href$="#open-source"]').should('exist')
        cy.get('a[href$="#product-status"]').should('exist')
        cy.get('a[href="/security"]').should('exist')
    })

    it('states repair, maturity, and commercial boundaries', () => {
        cy.contains('What “repair” means, and where it stops').should('be.visible')
        cy.contains('Unsupported drift').should('be.visible')
        cy.get('#product-status').within(() => {
            cy.contains('Browser recording and replay').should('be.visible')
            cy.contains('Research spike').should('be.visible')
            cy.contains('Managed hosted execution').should('be.visible')
            cy.contains('Launching · browser').should('be.visible')
        })
        cy.get('#pricing').within(() => {
            cy.contains('Run it yourself or launch with us').should('be.visible')
            cy.contains('Launching now').should('be.visible')
            cy.contains('Start hosted subscription').should('be.visible')
            cy.contains('$500').should('not.exist')
            cy.contains('sanitized derivative').should('be.visible')
        })
    })

    it('keeps the maturity and availability routes reachable on mobile', () => {
        cy.viewport(375, 812)
        cy.get('button[aria-controls="nav-mobile-menu"]').click()
        cy.get('#nav-mobile-menu').within(() => {
            cy.contains('Maturity').should('be.visible')
            cy.contains('Launch').should('be.visible')
            cy.contains('Open source').should('have.attr', 'href').and(
                'include',
                'openadapt-flow'
            )
        })
    })

    it('starts the configured hosted checkout path', () => {
        cy.intercept('POST', '**/api/create-checkout-session', {
            statusCode: 303,
            headers: { location: '/hosted/welcome' },
        }).as('checkout')

        cy.get('[data-testid="hosted-checkout"]')
            .should('contain.text', 'Start hosted subscription')
            .should('not.be.disabled')
            .parents('form')
            .should('have.attr', 'action', '/api/create-checkout-session')
            .should('have.attr', 'method', 'post')
            .then(($form) => $form[0].submit())
        cy.wait('@checkout').its('request.method').should('equal', 'POST')
        cy.location('pathname').should('equal', '/hosted/welcome')
    })
})

describe('security boundary', () => {
    it('discloses sensitive artifacts and missing certifications', () => {
        cy.visit('/security')
        cy.contains('Questions a security review should answer first').should(
            'be.visible'
        )
        cy.contains('Which components see screenshots?').should('be.visible')
        cy.contains('not a signed, append-only audit ledger').should(
            'be.visible'
        )
        cy.contains('OpenAdapt does not hold a SOC 2 attestation today').should(
            'be.visible'
        )
        cy.contains('Scrubbing creates a reviewable derivative').should('be.visible')
        cy.contains('approve that exact hash').should('be.visible')
        cy.contains('Risk-based hybrid').should('be.visible')
        cy.contains('Hosted runtime gate').should('be.visible')
        cy.contains('operator self-attestation').should('be.visible')
        cy.contains('its policy and risk-class allowlists').should('be.visible')
        cy.contains('deployed compiler-version allowlist').should('be.visible')
        cy.contains('Does Cloud independently witness local sanitation review?').should('be.visible')
        cy.contains('Can managed execution reach private-network targets?').should('be.visible')
        cy.contains('What does break reporting send?').should('be.visible')
        cy.contains('It does not upload the recording or compiled bundle').should(
            'be.visible'
        )
    })

    it('states the same boundary in privacy and hosted onboarding', () => {
        cy.visit('/privacy-policy')
        cy.contains('A compiled bundle is not de-identified or PHI-free').should(
            'be.visible'
        )
        cy.contains('binds approval to').should('be.visible')
        cy.contains('trusted execution boundary').should('be.visible')

        cy.visit('/hosted/welcome')
        cy.contains('Continue hosted onboarding').should('be.visible')
        cy.contains('does not prove payment').should('be.visible')
        cy.contains('sanitized derivative').should('be.visible')
        cy.contains('Unknown or unresolved content is refused').should('be.visible')
        cy.contains('validate-hosted').should('be.visible')
        cy.contains('consumes the challenge once').should('be.visible')
    })
})
