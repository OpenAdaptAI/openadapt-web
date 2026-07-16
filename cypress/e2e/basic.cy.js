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
            cy.contains('Offer unavailable').should('be.visible')
            cy.contains('Hosted checkout unavailable').should('be.disabled')
            cy.contains('could not be verified').should('be.visible')
            cy.contains('$500').should('not.exist')
            cy.contains('workflow runs/month').should('not.exist')
            cy.contains('sanitized derivative').should('be.visible')
        })
    })

    it('renders the Stripe Product run allowance without a website fallback', () => {
        cy.intercept('GET', '**/_next/data/**/pricing.json*', {
            statusCode: 200,
            body: {
                pageProps: {
                    hostedOffer: {
                        amount: '$500.00',
                        cadence: '/month',
                        product: 'OpenAdapt Cloud',
                        monthlyRunCap: 10000,
                    },
                },
                __N_SSG: true,
            },
        }).as('hostedOffer')

        cy.visit('/about')
        cy.window().then((win) => win.next.router.push('/pricing'))
        cy.wait('@hostedOffer')
        cy.location('pathname').should('equal', '/pricing')
        cy.get('[data-testid="hosted-run-cap"]')
            .should('be.visible')
            .and('have.text', 'Up to 10,000 workflow runs/month')
    })

    it('keeps the maturity and availability routes reachable on mobile', () => {
        cy.viewport(375, 667)
        cy.visit('/')
        cy.get('button[aria-controls="nav-mobile-menu"]').click()
        cy.get('#nav-mobile-menu').within(() => {
            cy.contains('Maturity').scrollIntoView().should('be.visible')
            cy.contains('Launch').scrollIntoView().should('be.visible')
            cy.contains('Open source').should('have.attr', 'href').and(
                'include',
                'openadapt-flow'
            )
        })
    })

    it('starts the configured hosted checkout path', () => {
        cy.intercept('GET', '**/_next/data/**/pricing.json*', {
            statusCode: 200,
            body: {
                pageProps: {
                    hostedOffer: {
                        amount: '$500.00',
                        cadence: '/month',
                        product: 'OpenAdapt Cloud',
                        monthlyRunCap: 10000,
                    },
                },
                __N_SSG: true,
            },
        }).as('hostedCheckoutOffer')
        cy.intercept('POST', '**/api/create-checkout-session', {
            statusCode: 303,
            headers: { location: '/hosted/welcome' },
        }).as('checkout')

        cy.visit('/about')
        cy.window().then((win) => win.next.router.push('/pricing'))
        cy.wait('@hostedCheckoutOffer')
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

    it('refuses direct checkout when the offer cannot be verified', () => {
        cy.request({
            method: 'POST',
            url: '/api/create-checkout-session',
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.equal(503)
            expect(response.body.error).to.equal('checkout_not_configured')
        })
    })

    it('documents the exact hosted checkout environment contract', () => {
        cy.readFile('.env.example').then((source) => {
            expect(source).to.include('STRIPE_SECRET_KEY=')
            expect(source).to.include('STRIPE_PRICE_ID=')
            expect(source).to.include('STRIPE_EXPECTED_MODE=live')
            expect(source).to.include('rk_live_')
            expect(source).to.include(
                'NEXT_PUBLIC_SITE_URL=https://openadapt.ai'
            )
            expect(source).to.include(
                'NEXT_PUBLIC_CLOUD_APP_URL=https://app.openadapt.ai'
            )
            expect(source).to.include(
                'Web and Cloud must use the same Stripe account, mode, and recurring price.'
            )
            expect(source).to.include(
                'There is no request-host or concierge checkout fallback.'
            )
            expect(source).not.to.include('$500')
            expect(source).not.to.include('STRIPE_WEBHOOK_SECRET')
            expect(source).not.to.include('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
        })

        cy.readFile('pages/api/create-checkout-session.js').then((source) => {
            ;[
                'STRIPE_SECRET_KEY',
                'STRIPE_PRICE_ID',
                'STRIPE_EXPECTED_MODE',
                'NEXT_PUBLIC_SITE_URL',
                'NEXT_PUBLIC_CLOUD_APP_URL',
            ].forEach((name) => expect(source).to.include(`process.env.${name}`))
            expect(source.indexOf('stripe.prices.retrieve')).to.be.lessThan(
                source.indexOf('stripe.checkout.sessions.create')
            )
            expect(source).to.include('checkout_offer_unverified')
        })
    })

    it('publishes the managed subscription and data-boundary terms', () => {
        cy.visit('/terms-of-service')
        cy.contains('Effective July 16, 2026').should('be.visible')
        cy.contains('Subscription, Renewal, and Usage').should('be.visible')
        cy.contains('renews automatically').should('be.visible')
        cy.contains('Cancellation and Refunds').should('be.visible')
        cy.contains('charges already paid are non-refundable').should('be.visible')
        cy.contains('Artifact and Runtime Data Boundaries').should('be.visible')
        cy.contains('self-serve hosted subscription does not include a BAA').should(
            'be.visible'
        )
        cy.contains('no uptime, response-time, support, retention, recovery').should(
            'be.visible'
        )
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
