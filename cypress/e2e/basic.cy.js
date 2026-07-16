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
        cy.get('[data-testid="github-proof"]')
            .should('have.attr', 'href', 'https://github.com/OpenAdaptAI/OpenAdapt')
        cy.get('[data-testid="github-proof"]')
            .should('contain.text', 'stars on OpenAdapt')
            .and('contain.text', 'forks')
    })

    it('explains the governed workflow and execution choices', () => {
        cy.contains('What “repair” means, and where it stops').should('be.visible')
        cy.contains('Unsupported drift').should('be.visible')
        cy.get('#product-status').within(() => {
            cy.contains('One governed workflow, end to end').should('be.visible')
            cy.contains('Capture the workflow').should('be.visible')
            cy.contains('Run through the governed gate').should('be.visible')
            cy.contains('Managed browser execution').should('be.visible')
            cy.contains('Customer-controlled deployment').should('be.visible')
            cy.contains('Execution substrate evidence').should('be.visible')
            cy.contains('Browser / Playwright').should('be.visible')
            cy.contains('Windows UIA').should('be.visible')
            cy.contains('Native macOS').should('be.visible')
            cy.contains('RDP / Citrix').should('be.visible')
            cy.contains('Experimental').should('be.visible')
            cy.contains('Research').should('be.visible')
            cy.contains('Research spike').should('not.exist')
            cy.contains('Product maturity').should('not.exist')
        })
        cy.get('#pricing').within(() => {
            cy.contains('Run it yourself or launch with us').should('be.visible')
            cy.contains('Managed browser').should('be.visible')
            cy.contains('Hosted execution').should('be.visible')
            cy.contains('Start with our team').should('be.visible')
            cy.contains('Offer unavailable').should('not.exist')
            cy.contains('Hosted checkout unavailable').should('not.exist')
            cy.contains('$500').should('not.exist')
            cy.contains('workflow runs/month').should('not.exist')
            cy.contains('approved sanitized copy').should('be.visible')
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

    it('keeps deployment and launch routes reachable on mobile', () => {
        cy.viewport(375, 667)
        cy.visit('/')
        cy.get('button[aria-controls="nav-mobile-menu"]').click()
        cy.get('#nav-mobile-menu').within(() => {
            cy.contains('How it runs').scrollIntoView().should('be.visible')
            cy.contains('Launch').scrollIntoView().should('be.visible')
            cy.contains('Open source').should('have.attr', 'href').and(
                'include',
                'openadapt-flow'
            )
        })
    })

    it('keeps benchmark proof concise and bounded', () => {
        cy.get('[data-testid="benchmark-proof"]').within(() => {
            cy.contains(
                'Repeated work should not pay an agent to rethink the same task.'
            ).should('be.visible')
            cy.contains('In a bounded browser benchmark').should('be.visible')
            cy.contains('not a production reliability claim').should('be.visible')
            cy.contains(
                'Review scope, samples, pricing basis, caveats, and raw results'
            ).should('have.attr', 'href').and('include', 'benchmark/BENCHMARK.md')
            cy.contains('N=').should('not.exist')
            cy.contains('resets daily').should('not.exist')
            cy.contains('introductory').should('not.exist')
        })

        cy.visit('/compare')
        cy.get('h1').should(
            'contain.text',
            'Choose repeatable automation for work that repeats.'
        )
        cy.get('#side-by-side').within(() => {
            cy.contains('Choose by the operating model you need.').should(
                'be.visible'
            )
            cy.contains('Repeated, consequential browser workflows').should(
                'be.visible'
            )
            cy.contains('Novel or changing tasks').should('be.visible')
        })
        cy.get('#benchmark-evidence').within(() => {
            cy.contains('On MockMed').should('be.visible')
            cy.contains('Faster repeat runs without per-run model spend.').should(
                'be.visible'
            )
            cy.contains('100 compiled replays').should('not.exist')
            cy.contains('$3/$15').should('not.exist')
            cy.contains('introductory').should('not.exist')
            cy.contains('resets daily').should('not.exist')
            cy.contains('N=10').should('not.exist')
            cy.contains(
                'Method, raw results, and rerun instructions'
            ).should('have.attr', 'href').and('include', 'benchmark/BENCHMARK.md')
            cy.contains(
                'OpenEMR cross-check'
            ).should('have.attr', 'href').and('include', 'openemr/BENCHMARK.md')
        })
        cy.contains("We'd rather tell you").should('not.exist')
        cy.contains('Versus traditional RPA platforms').should('not.exist')

        cy.viewport(375, 812)
        cy.visit('/compare')
        cy.contains('Scroll horizontally to compare all approaches.').should(
            'be.visible'
        )
        cy.get('#side-by-side [role="region"]')
            .should('be.visible')
            .and('have.attr', 'tabindex', '0')
        cy.contains('Start hosted').scrollIntoView().should('be.visible')
        cy.contains('Book a workflow review').should('be.visible')
    })

    it('keeps buyer claims inside the shipped browser and tested safety scope', () => {
        cy.get('#faq').within(() => {
            cy.contains('Does hosted validation certify my workflow?').should(
                'not.exist'
            )
            cy.contains('approved sanitized copy').should('be.visible')
        })

        cy.get('#industries').within(() => {
            cy.contains("Who it's for").should('be.visible')
            cy.contains('Automation teams & BPO operators').should('be.visible')
            cy.contains('RCM & vertical-software vendors').should('be.visible')
            cy.contains('Regulated enterprise operations').should('be.visible')
            cy.contains('Healthcare workflow reference').should('be.visible')
            cy.contains('Lending operations reference').should('be.visible')
            cy.contains('Mortgage & lending ops').should('not.exist')
        })

        cy.visit('/solutions/healthcare')
        cy.get('h1').should('contain.text', 'browser-based intake work')
        cy.contains('prove production EMR safety').should('be.visible')
        cy.contains('OpenAdapt does the retyping').should('not.exist')
        cy.contains('Certified workflows halt before').should('not.exist')

        cy.visit('/solutions/lending')
        cy.get('h1')
            .should('contain.text', 'Prefer supported APIs')
            .and('contain.text', 'remaining UI-only browser gap')
            .and('not.contain.text', 'Encompass')
            .and('not.contain.text', 'Mortgage')
        cy.contains('not evidence of a production lending integration').should(
            'be.visible'
        )
        cy.contains('customer-controlled deployment').should('be.visible')
        cy.contains('experimental').should('not.exist')
        cy.get('[data-testid="lending-evidence-placeholder"]')
            .should('be.visible')
            .and('contain.text', 'awaiting oracle verification')
        cy.get('img[alt*="OpenEMR"]').should('not.exist')

        cy.visit('/safety')
        cy.get('h1').should('contain.text', 'needs verified identity')
        cy.contains('do not establish end-to-end or production EMR reliability').should(
            'be.visible'
        )
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
            expect(source).to.include('HOSTED_CHECKOUT_QUALIFIED=false')
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
            expect(source).to.include('isHostedCheckoutQualified')
        })
    })

    it('publishes the managed subscription and data-boundary terms', () => {
        cy.visit('/terms-of-service')
        cy.contains('Effective July 16, 2026').should('be.visible')
        cy.contains('Launch legal-review requirement').should('be.visible')
        cy.contains('Subscription, Renewal, and Usage').should('be.visible')
        cy.contains('renews automatically').should('be.visible')
        cy.contains('Cancellation and Refunds').should('be.visible')
        cy.contains('charges already paid are non-refundable').should('be.visible')
        cy.contains('Artifact and Runtime Data Boundaries').should('be.visible')
        cy.contains('Managed browser recording is a different path').should(
            'be.visible'
        )
        cy.contains('no fixed retention, backup-deletion, or recovery').should(
            'be.visible'
        )
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
        cy.contains('Launch legal-review requirement').should('be.visible')
        cy.contains('Compilation does not de-identify them').should(
            'be.visible'
        )
        cy.contains('approved by exact archive hash').should('be.visible')
        cy.contains('Managed browser recording is separate').should('be.visible')
        cy.contains('Current Service Providers').should('be.visible')
        cy.contains('Healthy deterministic replay makes no model calls').should(
            'be.visible'
        )
        cy.contains('customer-controlled boundary').should('be.visible')

        cy.visit('/hosted/welcome')
        cy.contains('Continue hosted onboarding').should('be.visible')
        cy.contains('does not prove payment').should('be.visible')
        cy.contains('sanitized derivative').should('be.visible')
        cy.contains('Unknown or unresolved content is refused').should('be.visible')
        cy.contains('validate-hosted').should('be.visible')
        cy.contains('consumes the challenge once').should('be.visible')
    })
})
