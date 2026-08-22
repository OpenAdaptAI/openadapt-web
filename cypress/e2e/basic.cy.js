const BOOKING_URL = 'https://cal.com/richard-abrich/30min?overlayCalendar=true'

function isProductionDeployment() {
    const baseUrl = Cypress.config('baseUrl')
    const hostname = baseUrl ? new URL(baseUrl).hostname : ''

    // Netlify's onSuccess plugin receives the deploy context. The hostname
    // fallback also supports intentional local Cypress runs against the
    // canonical production site.
    return (
        Cypress.expose('deploymentContext') === 'production' ||
        hostname === 'openadapt.ai'
    )
}

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

    it('publishes the structured qualification entry point', () => {
        cy.visit('/qualify')
        cy.get('form[name="workflow-qualification"]').should('be.visible')
        cy.contains('Bring one workflow. Leave with a go/no-go answer.').should(
            'be.visible'
        )
    })
})

describe('public product truth', () => {
    beforeEach(() => {
        cy.viewport(1280, 900)
        cy.visit('/')
    })

    it('leads with the buyer outcome and routes to a workflow review', () => {
        cy.get('h1').should(
            'contain.text',
            'Automate the work your systems still make people do.'
        )
        cy.get('[data-testid="workflow-fit-cta"]').should(
            'have.attr',
            'href',
            '/qualify'
        )
        cy.get('nav[aria-label="Primary"]').within(() => {
            cy.contains('button', 'Solutions').click()
            cy.get('#nav-solutions-menu')
                .find('a[href="/solutions/insurance"]')
                .should('be.visible')
        })
        cy.get('h1').click()
        cy.get('[data-testid="github-proof"]').should(
            'have.attr',
            'href',
            'https://github.com/OpenAdaptAI/OpenAdapt'
        )
        cy.get('[data-testid="github-proof"]')
            .should('contain.text', 'stars on OpenAdapt')
            .and('contain.text', 'forks')
    })

    it('surfaces a concise, keyboard-accessible primary navigation', () => {
        // A pointer hover may open a dropdown before the ensuing
        // click. The click pins it open, including for touch browsers
        // that synthesize hover events before click.
        cy.contains('button', 'Solutions').trigger('mouseover')
        cy.get('#nav-solutions-menu').should('be.visible')
        cy.contains('button', 'Solutions').click().trigger('mouseout')
        cy.get('#nav-solutions-menu').should('be.visible')
        cy.get('h1').click()
        cy.get('#nav-solutions-menu').should('not.exist')

        // ArrowDown opens the menu and focuses its first item; focus
        // moving outside the dropdown dismisses it.
        cy.contains('button', 'Product').focus().type('{downarrow}')
        cy.get('#nav-product-menu a').first().should('be.focused')
        cy.focused().type('{downarrow}')
        cy.get('#nav-product-menu a').eq(1).should('be.focused')
        cy.contains('nav[aria-label="Primary"] a', 'Pricing').focus()
        cy.get('#nav-product-menu').should('not.exist')

        cy.get('nav[aria-label="Primary"]').within(() => {
            cy.contains('a', 'Pricing')
                .should('be.visible')
                .and('have.attr', 'href', '/pricing')
            cy.contains('a', 'Open source')
                .should('be.visible')
                .and(
                    'have.attr',
                    'href',
                    'https://github.com/OpenAdaptAI/OpenAdapt'
                )
            cy.contains('a', 'About').should('not.exist')
            // Blog consolidated into the Developers dropdown, so it is not a
            // top-level link while every dropdown is closed.
            cy.contains('a', 'Blog').should('not.exist')

            cy.contains('button', 'Solutions')
                .should('be.visible')
                .and('have.attr', 'aria-expanded', 'false')
            cy.contains('button', 'Solutions').click()
            cy.get('#nav-solutions-menu').within(() => {
                cy.contains('a', 'Healthcare').should(
                    'have.attr',
                    'href',
                    '/solutions/healthcare'
                )
                cy.contains('a', 'Lending').should(
                    'have.attr',
                    'href',
                    '/solutions/lending'
                )
                cy.contains('a', 'Insurance').should(
                    'have.attr',
                    'href',
                    '/solutions/insurance'
                )
            })

            cy.contains('button', 'Product').click()
            cy.get('#nav-solutions-menu').should('not.exist')
            cy.get('#nav-product-menu').within(() => {
                cy.contains('a', 'Platforms & deployment').should(
                    'have.attr',
                    'href',
                    '/#product-status'
                )
                cy.contains('a', 'Safety').should(
                    'have.attr',
                    'href',
                    '/safety'
                )
                cy.contains('a', 'Compare').should(
                    'have.attr',
                    'href',
                    '/compare'
                )
                cy.contains('a', 'Templates').should(
                    'have.attr',
                    'href',
                    '/templates'
                )
                cy.contains('a', 'Download').should(
                    'have.attr',
                    'href',
                    '/download'
                )
            })

            cy.contains('button', 'Developers')
                .should('be.visible')
                .and('have.attr', 'aria-expanded', 'false')
            cy.contains('button', 'Developers').click()
            cy.get('#nav-product-menu').should('not.exist')
            cy.contains('button', 'Developers').should(
                'have.attr',
                'aria-expanded',
                'true'
            )
            cy.get('#nav-developers-menu').within(() => {
                cy.contains('a', 'Compiler/runtime source')
                    .should('be.visible')
                    .and(
                        'have.attr',
                        'href',
                        'https://github.com/OpenAdaptAI/openadapt-flow'
                    )
                cy.contains('a', 'Docs')
                    .should('be.visible')
                    .and('have.attr', 'href', 'https://docs.openadapt.ai')
                cy.contains('a', 'Technical paper')
                    .should('be.visible')
                    .and('have.attr', 'href', '/openadapt-paper.pdf')
                cy.contains('a', 'Discord')
                    .should('be.visible')
                    .and('have.attr', 'href', 'https://discord.gg/yF527cQbDG')
                cy.contains('a', 'Report an issue')
                    .should('be.visible')
                    .and(
                        'have.attr',
                        'href',
                        'https://github.com/OpenAdaptAI/openadapt-flow/issues/new/choose'
                    )
                // Blog is consolidated into the Developers dropdown.
                cy.contains('a', 'Blog')
                    .should('be.visible')
                    .and('have.attr', 'href', 'https://blog.openadapt.ai')
            })
        })

        // A primary evaluation CTA and a secondary "Sign in" affordance
        // (the hosted control plane) sit in the header action cluster. Scope to
        // the first <header> (the site banner); the homepage DashboardShowcase
        // renders its own decorative <header> inside a section further down.
        cy.get('header')
            .first()
            .within(() => {
                cy.contains('a', 'Start your first workflow').should(
                    'have.attr',
                    'href',
                    '/qualify'
                )
                cy.contains('a', 'Sign in')
                    .should('be.visible')
                    .and('have.attr', 'href', 'https://app.openadapt.ai')
            })

        // Escape closes and returns focus to the trigger.
        cy.contains('button', 'Developers').type('{esc}')
        cy.get('#nav-developers-menu').should('not.exist')
        cy.contains('button', 'Developers').should(
            'have.attr',
            'aria-expanded',
            'false'
        )
        cy.contains('button', 'Developers').should('be.focused')

        // Reopen, then a click outside the dropdown closes it. The
        // right-aligned Developers panel overlays the hero heading, so
        // dismiss from a point on the left that the panel never covers.
        cy.contains('button', 'Developers').click()
        cy.get('#nav-developers-menu').should('be.visible')
        cy.get('body').click(20, 500)
        cy.get('#nav-developers-menu').should('not.exist')
    })

    it('explains the governed workflow and execution choices', () => {
        cy.get('#product-status').within(() => {
            cy.contains('Managed execution').should('be.visible')
            cy.contains('Customer-controlled deployment').should('be.visible')
            cy.contains('Browser').should('be.visible')
            cy.contains('Native desktop').should('be.visible')
            cy.contains('Remote applications').should('be.visible')
        })
        cy.get('#commercial-offer').within(() => {
            cy.contains('Workflow Qualification Sprint').should('be.visible')
            cy.contains('From $15,000').should('be.visible')
            cy.contains('OpenAdapt Cloud').should('be.visible')
            cy.contains('$500.00').should('be.visible')
            cy.contains('/month').should('be.visible')
            cy.contains('Up to 10,000 workflow runs/month').should('be.visible')
        })
    })

    it('keeps the drift-outcome deep dive on the how-it-works page', () => {
        // The compiled-program and drift-outcome deep dives moved off the
        // landing to /how-it-works. Assert they still exist there so the
        // "what repair means, and where it stops" honesty coverage travels
        // with the content instead of being deleted.
        cy.visit('/how-it-works')
        cy.contains('What “repair” means, and where it stops').should(
            'be.visible'
        )
        cy.contains('Unsupported drift').should('be.visible')
        cy.contains('Deterministic re-resolution').should('be.visible')
        cy.contains('Refuse instead of improvise').should('be.visible')
        cy.contains('See what a demonstration compiled into').should(
            'be.visible'
        )
    })

    it('renders the verified Stripe Product allowance supplied by SSG', () => {
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
        cy.get('header').then(($header) => {
            expect($header[0].getBoundingClientRect().left).to.equal(0)
        })
        cy.get('button[aria-controls="nav-mobile-menu"]').click()
        cy.get('#nav-mobile-menu').should('be.visible')
        cy.get('#nav-mobile-menu').within(() => {
            cy.contains('Solutions').scrollIntoView().should('be.visible')
            cy.contains('a', 'Healthcare')
                .should('have.attr', 'href')
                .and('equal', '/solutions/healthcare')
            cy.contains('a', 'Lending')
                .should('have.attr', 'href')
                .and('equal', '/solutions/lending')
            cy.contains('a', 'Insurance')
                .should('have.attr', 'href')
                .and('equal', '/solutions/insurance')
            cy.contains('Product').scrollIntoView().should('be.visible')
            cy.contains('a', 'Platforms & deployment').should(
                'have.attr',
                'href',
                '/#product-status'
            )
            cy.contains('a', 'Safety')
                .should('have.attr', 'href')
                .and('equal', '/safety')
            cy.contains('a', 'Compare')
                .should('have.attr', 'href')
                .and('equal', '/compare')
            cy.contains('a', 'Templates')
                .should('have.attr', 'href')
                .and('equal', '/templates')
            cy.contains('a', 'Download')
                .should('have.attr', 'href')
                .and('equal', '/download')
            cy.contains('a', 'Pricing').should('have.attr', 'href', '/pricing')
            cy.contains('a', 'Blog')
                .should('have.attr', 'href')
                .and('equal', 'https://blog.openadapt.ai')
            // The Developers dropdown renders as a labeled flat group.
            cy.contains('Developers').scrollIntoView().should('be.visible')
            cy.contains('a', 'Compiler/runtime source')
                .should('have.attr', 'href')
                .and('equal', 'https://github.com/OpenAdaptAI/openadapt-flow')
            cy.contains('a', 'Docs')
                .should('have.attr', 'href')
                .and('equal', 'https://docs.openadapt.ai')
            cy.contains('a', 'Technical paper')
                .should('have.attr', 'href')
                .and('equal', '/openadapt-paper.pdf')
            cy.contains('a', 'Discord')
                .should('have.attr', 'href')
                .and('equal', 'https://discord.gg/yF527cQbDG')
            cy.contains('a', 'Report an issue')
                .should('have.attr', 'href')
                .and(
                    'equal',
                    'https://github.com/OpenAdaptAI/openadapt-flow/issues/new/choose'
                )
            cy.contains('Open source')
                .scrollIntoView()
                .should('have.attr', 'href')
                .and('equal', 'https://github.com/OpenAdaptAI/OpenAdapt')
            cy.contains('a', 'Sign in')
                .scrollIntoView()
                .should('have.attr', 'href')
                .and('equal', 'https://app.openadapt.ai')
        })
        cy.get('#nav-mobile-menu').then(($menu) => {
            expect($menu[0].scrollHeight).to.be.greaterThan(
                $menu[0].clientHeight
            )
            expect($menu[0].getBoundingClientRect().bottom).to.be.at.most(
                $menu[0].ownerDocument.defaultView.visualViewport.height
            )
        })
        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(375)
        })

        cy.viewport(1024, 768)
        cy.visit('/')
        cy.get('nav[aria-label="Primary"]')
            .contains('button', 'Solutions')
            .should('not.be.visible')
        cy.get('button[aria-controls="nav-mobile-menu"]')
            .should('be.visible')
            .click()
        cy.get('#nav-mobile-menu')
            .find('a[href="/solutions/insurance"]')
            .scrollIntoView()
            .should('be.visible')
    })

    it('keeps benchmark proof concise and bounded', () => {
        // The homepage benchmark teaser was relocated to /compare, which holds
        // the canonical measured evidence.
        cy.visit('/compare')
        cy.get('h1').should(
            'contain.text',
            'Choose repeatable automation for work that repeats.'
        )
        cy.get('#side-by-side').within(() => {
            cy.contains('Choose by the operating model you need.').should(
                'be.visible'
            )
            cy.contains(
                'Repeated, consequential GUI workflows without a practical API'
            ).should('be.visible')
            cy.contains('Novel or changing tasks').should('be.visible')
        })
        cy.get('#benchmark-evidence').within(() => {
            cy.contains('On MockMed').should('be.visible')
            cy.contains(
                'Faster repeat runs without per-run model spend.'
            ).should('be.visible')
            cy.contains('100 compiled replays').should('not.exist')
            cy.contains('$3/$15').should('not.exist')
            cy.contains('introductory').should('not.exist')
            cy.contains('resets daily').should('not.exist')
            cy.contains('N=10').should('not.exist')
            cy.contains('Method, raw results, and rerun instructions')
                .should('have.attr', 'href')
                .and('include', 'benchmark/BENCHMARK.md')
            cy.contains('OpenEMR cross-check')
                .should('have.attr', 'href')
                .and('include', 'openemr/BENCHMARK.md')
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
        cy.contains('Qualify one workflow')
            .scrollIntoView()
            .should('be.visible')
        cy.contains('Try locally').should('be.visible')
    })

    it('keeps buyer claims inside the shipped browser and tested safety scope', () => {
        cy.get('[data-testid="customer-case-study"]')
            .scrollIntoView()
            .should('be.visible')
        cy.contains('≈$75,000').should('be.visible')
        cy.contains('in missed billables recovered per year').should('be.visible')
        cy.contains('Real OpenAdapt Cloud interface').should('be.visible')

        cy.viewport(375, 812)
        cy.visit('/')
        cy.get('[data-testid="customer-case-study"]')
            .scrollIntoView()
            .should('be.visible')
        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(375)
        })

        cy.visit('/solutions/healthcare')
        cy.get('h1').should('be.visible')
        cy.get('a[href="/qualify"]')
            .filter(':visible')
            .should('have.length.greaterThan', 0)
        cy.get('a[href="/customers/rvu-audit-heart-care"]')
            .first()
            .scrollIntoView()
            .should('be.visible')
        cy.get('a[href="/safety"]')
            .first()
            .scrollIntoView()
            .should('be.visible')
        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(375)
        })

        cy.visit('/solutions/lending')
        cy.get('h1')
            .should('contain.text', 'final UI-only mile')
            .and('not.contain.text', 'Encompass')
            .and('not.contain.text', 'Mortgage')
        cy.contains('supported APIs and exports').should('be.visible')
        cy.contains('customer-controlled deployment').should('be.visible')
        cy.contains('experimental').should('not.exist')
        cy.get('[data-testid="reference-demo-showcase"]')
            .should('have.attr', 'data-active-reference', 'lending')
            .within(() => {
                cy.contains('Frappe Lending').should('be.visible')
                cy.contains('button', 'Recorded demonstration').click()
                cy.get('video')
                    .should('have.attr', 'aria-label')
                    .and('contain', 'recording a synthetic Loan Application')
                cy.contains('button', 'Verified replay').click()
                cy.get('video')
                    .should('have.attr', 'aria-label')
                    .and('contain', 'Standard-profile synthetic Loan Application')
                cy.get('[data-testid="reference-evidence-player"]')
                    .should('have.attr', 'data-target-tracking', 'exact-decoded-frame-bound')
                cy.contains('Standard VERIFIED')
                cy.contains('6/6')
                cy.contains('Qualification pack')
                    .should('have.attr', 'href')
                    .and(
                        'equal',
                        '/artifacts/json?source=%2Freference%2Ffrappe-lending-loan-application-standard-synthetic-v1%2Fmanifest.json'
                    )
            })

        cy.visit('/solutions/insurance')
        cy.get('h1').should('contain.text', 'Eligibility checks')
        cy.contains('independent read-only SQL query').should('be.visible')
        cy.get('[data-testid="reference-demo-showcase"]')
            .should('have.attr', 'data-active-reference', 'insurance')
            .within(() => {
                cy.contains('openIMIS').should('be.visible')
                cy.get('button[data-mode-kind="recording"]').click()
                cy.get('video')
                    .should('have.attr', 'aria-label')
                    .and('contain', 'source demonstration')
                cy.get('button[data-mode-kind="replay"]').click()
                cy.get('video')
                    .should('have.attr', 'aria-label')
                    .and('contain', 'eligibility check')
                cy.get('[data-testid="reference-evidence-player"]')
                    .should('have.attr', 'data-target-tracking', 'exact-decoded-frame-bound')
                cy.get('button[data-mode-kind="halt"]').click()
                cy.contains('Fail-safe HALTED')
                cy.contains('Evidence pack')
                    .should('have.attr', 'href')
                    .and(
                        'equal',
                        '/artifacts/json?source=%2Freference%2Fopenimis-eligibility-standard-synthetic-v1%2Fmanifest.json'
                    )
            })

        cy.viewport(375, 812)
        cy.visit('/solutions/lending')
        cy.get('[data-testid="reference-demo-showcase"]')
            .should('have.attr', 'data-active-reference', 'lending')
            .scrollIntoView()
            .should('be.visible')
        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(375)
        })

        cy.visit('/safety')
        cy.get('h1').should('contain.text', 'needs verified identity')
        cy.contains(
            'do not establish end-to-end or production EMR reliability'
        ).should('be.visible')
    })

    it('renders /workflows fully readable with no horizontal overflow on mobile', () => {
        // Regression guard: catalog entries embed long unbreakable tokens
        // (64-char SHA-256 hashes, commit ids) and a non-wrapping <pre>
        // reproduction command. In implicit `auto` grid tracks these stretched
        // each card far past the viewport, and body { overflow-x: hidden }
        // clipped the excess with no way to scroll to it. Note that
        // documentElement.scrollWidth is itself clamped by overflow-x: hidden,
        // so we assert on real element geometry instead: no element may extend
        // past the viewport's right edge.
        cy.viewport(375, 812)
        cy.visit('/workflows')
        cy.contains('The workflows we').should('be.visible')
        cy.contains('12/12 model-free rows correct')
            .scrollIntoView()
            .should('be.visible')
        cy.window().then((win) => {
            const doc = win.document
            const viewportWidth = doc.documentElement.clientWidth
            // Overflow is only acceptable when it lives inside a reachable
            // scroll container (e.g. the reproduction <pre> with overflow-x
            // auto). Any element extending past the viewport that is NOT inside
            // such a container is clipped-and-unreachable — the reported bug.
            const inScrollContainer = (el) => {
                let node = el.parentElement
                while (node) {
                    const overflowX = win.getComputedStyle(node).overflowX
                    if (overflowX === 'auto' || overflowX === 'scroll') {
                        return true
                    }
                    node = node.parentElement
                }
                return false
            }
            const clipped = []
            doc.querySelectorAll('body *').forEach((el) => {
                if (
                    el.getBoundingClientRect().right > viewportWidth + 1 &&
                    !inScrollContainer(el)
                ) {
                    clipped.push(el.tagName + '.' + el.className)
                }
            })
            expect(clipped, 'elements clipped past viewport').to.deep.equal([])
        })
    })

    it('matches direct checkout to the deployment qualification boundary', () => {
        cy.request({
            method: 'POST',
            url: '/api/create-checkout-session',
            failOnStatusCode: false,
        }).then((response) => {
            if (isProductionDeployment()) {
                expect(response.status).to.equal(200)
                expect(response.body).to.have.property('url')
                expect(new URL(response.body.url).origin).to.equal(
                    'https://checkout.stripe.com'
                )
            } else {
                expect(response.status).to.equal(503)
                expect(response.body.error).to.equal('checkout_not_configured')
            }
        })
    })

    it('presents three entry paths and keeps the Cloud deep link stable', () => {
        cy.visit('/pricing#cloud-preview')
        cy.location('hash').should('equal', '#cloud-preview')

        cy.get('[role="list"][aria-label="Ways to start with OpenAdapt"]')
            .find('[role="listitem"]')
            .should('have.length', 3)

        cy.get('#cloud-preview')
            .should('be.visible')
            .within(() => {
                cy.contains('OpenAdapt Cloud').should('be.visible')
                cy.get('[data-testid="hosted-run-cap"]').should('be.visible')
                cy.get(
                    '[data-testid="hosted-checkout"], [data-testid="hosted-contact"]'
                ).should('have.length', 1)
            })

        cy.get('[aria-labelledby="enterprise-path-title"]').within(() => {
            cy.contains(/supervised production pilot/i).should('be.visible')
            cy.contains(/production/i).should('be.visible')
            cy.contains(/OEM/i).should('be.visible')
        })

        cy.viewport(375, 812)
        cy.visit('/pricing#cloud-preview')
        cy.get('#cloud-preview').scrollIntoView().should('be.visible')
        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(375)
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
            ].forEach((name) =>
                expect(source).to.include(`process.env.${name}`)
            )
            expect(source.indexOf('stripe.prices.retrieve')).to.be.lessThan(
                source.indexOf('stripe.checkout.sessions.create')
            )
            expect(source).to.include('checkout_offer_unverified')
            expect(source).to.include('isHostedCheckoutQualified')
        })
    })

    it('publishes the managed subscription and data-boundary terms', () => {
        cy.visit('/terms-of-service')
        cy.contains('Effective July 17, 2026.').should('be.visible')
        cy.contains('DRAFT — NOT OPERATIVE.').should('not.exist')
        cy.contains('Subscription, Renewal, and Usage').should('be.visible')
        cy.contains('renews automatically').should('be.visible')
        cy.contains('Cancellation and Refunds').should('be.visible')
        cy.contains('charges already paid are non-refundable').should(
            'be.visible'
        )
        cy.contains('Artifact and Runtime Data Boundaries').should('be.visible')
        cy.contains('Managed browser recording is a different path').should(
            'be.visible'
        )
        cy.contains('no fixed retention, backup-deletion, or recovery').should(
            'be.visible'
        )
        cy.contains('A BAA applies only when expressly included').should(
            'be.visible'
        )
        cy.contains(
            'no uptime, response-time, support, retention, recovery'
        ).should('be.visible')
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
        cy.contains('SOC 2 and independent attestation').should('be.visible')
        cy.contains('No report held').should('be.visible')
        cy.contains('Scrubbing creates a reviewable derivative').should(
            'be.visible'
        )
        cy.contains('approve that exact hash').should('be.visible')
        cy.contains('Risk-based hybrid').should('be.visible')
        cy.contains('Hosted runtime gate').should('be.visible')
        cy.contains('operator self-attestation').should('be.visible')
        cy.contains('its policy and risk-class allowlists').should('be.visible')
        cy.contains('deployed compiler-version allowlist').should('be.visible')
        cy.contains(
            'Does Cloud independently witness local sanitation review?'
        ).should('be.visible')
        cy.contains(
            'Can managed execution reach private-network targets?'
        ).should('be.visible')
        cy.contains('What does break reporting send?').should('be.visible')
        cy.contains(
            'It does not upload the recording or compiled bundle'
        ).should('be.visible')
    })

    it('states the same boundary in privacy and hosted onboarding', () => {
        cy.visit('/privacy-policy')
        cy.contains('Effective July 17, 2026.').should('be.visible')
        cy.contains('DRAFT — NOT OPERATIVE FOR PAID PRODUCTION.').should(
            'not.exist'
        )
        cy.contains('Compilation does not de-identify them').should(
            'be.visible'
        )
        cy.contains('approved by exact archive hash').should('be.visible')
        cy.contains('Managed browser recording is separate').should(
            'be.visible'
        )
        cy.contains('Current Service Providers').should('be.visible')
        cy.contains('Healthy deterministic replay makes no model calls').should(
            'be.visible'
        )
        cy.contains('customer-controlled boundary').should('be.visible')

        cy.visit('/hosted/welcome')
        cy.contains('Continue hosted onboarding').should('be.visible')
        cy.contains('Sign in with the email used at checkout').should(
            'be.visible'
        )
        cy.contains('review the captured demonstration').should('be.visible')
        cy.contains('Run under supervision').should('be.visible')
        cy.contains('Monitor usage, outcomes').should('be.visible')
        cy.contains('customer-controlled deployment').should('be.visible')
    })
})

describe('measured-on attribution', () => {
    // Every published benchmark figure was measured on 2026-07-08 from an
    // openadapt-flow source build declaring 0.1.0, before v0.2.0 - the first
    // release tag containing the pinned commit. The site used to render those
    // numbers with no version at all. A reader must be able to see the engine
    // build without hunting for it, so this asserts on the rendered page, not
    // on the source file.
    it('states the engine build next to the benchmark charts on /compare', () => {
        cy.visit('/compare')
        cy.get('[data-testid="benchmark-attribution"]')
            .first()
            .scrollIntoView()
            .should('be.visible')
            .should('contain.text', 'Measured on Flow 0.1.0')
            .should('contain.text', '2026-07-08')
        // The label sits above the charts, not below them in fine print.
        cy.get('[data-testid="benchmark-attribution"]')
            .first()
            .then(($label) => {
                cy.get('#benchmark-evidence figure')
                    .first()
                    .then(($figure) => {
                        expect(
                            $label[0].getBoundingClientRect().top
                        ).to.be.lessThan($figure[0].getBoundingClientRect().top)
                    })
            })
    })

    it('states the engine build with the reported results on /research', () => {
        cy.visit('/research')
        cy.get('[data-testid="benchmark-attribution"]')
            .first()
            .scrollIntoView()
            .should('be.visible')
            .should('contain.text', 'Measured on Flow 0.1.0')
    })

    it('states the engine build under every trial headline on /workflows', () => {
        cy.visit('/workflows')
        cy.get('[data-testid="trial-measured-on"]')
            .should('have.length.at.least', 3)
            .each(($node) => {
                expect($node.text()).to.match(
                    /Measured on Flow \d+\.\d+\.\d+ dev build .*\d{4}-\d{2}-\d{2}/
                )
            })
    })
})
