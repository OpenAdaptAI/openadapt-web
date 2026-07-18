const BOOKING_URL =
    'https://cal.com/richard-abrich/30min?overlayCalendar=true'

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
        cy.get('nav[aria-label="Primary"]').within(() => {
            cy.contains('button', 'Solutions').click()
            cy.get('#nav-solutions-menu')
                .find('a[href="/solutions/insurance"]')
                .should('be.visible')
        })
        cy.get('h1').click()
        cy.get('[data-testid="github-proof"]')
            .should('have.attr', 'href', 'https://github.com/OpenAdaptAI/OpenAdapt')
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
        cy.contains('nav[aria-label="Primary"] a', 'Launch').focus()
        cy.get('#nav-product-menu').should('not.exist')

        cy.get('nav[aria-label="Primary"]').within(() => {
            cy.contains('a', 'Launch')
                .should('be.visible')
                .and('have.attr', 'href', '/#pricing')
            cy.contains('a', 'Blog')
                .should('be.visible')
                .and('have.attr', 'href', 'https://blog.openadapt.ai')
            cy.contains('a', 'Open source')
                .should('be.visible')
                .and('have.attr', 'href', 'https://github.com/OpenAdaptAI/OpenAdapt')
            cy.contains('a', 'About').should('not.exist')

            cy.contains('button', 'Solutions')
                .should('be.visible')
                .and('have.attr', 'aria-expanded', 'false')
            cy.contains('button', 'Solutions').click()
            cy.get('#nav-solutions-menu').within(() => {
                cy.contains('a', 'Healthcare')
                    .should('have.attr', 'href', '/solutions/healthcare')
                cy.contains('a', 'Lending')
                    .should('have.attr', 'href', '/solutions/lending')
                cy.contains('a', 'Insurance')
                    .should('have.attr', 'href', '/solutions/insurance')
            })

            cy.contains('button', 'Product').click()
            cy.get('#nav-solutions-menu').should('not.exist')
            cy.get('#nav-product-menu').within(() => {
                cy.contains('a', 'How it runs')
                    .should('have.attr', 'href', '/#product-status')
                cy.contains('a', 'Safety')
                    .should('have.attr', 'href', '/safety')
                cy.contains('a', 'Compare')
                    .should('have.attr', 'href', '/compare')
                cy.contains('a', 'Templates')
                    .should('have.attr', 'href', '/templates')
                cy.contains('a', 'Download')
                    .should('have.attr', 'href', '/download')
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
                cy.contains('a', 'Technical paper source')
                    .should('be.visible')
                    .and(
                        'have.attr',
                        'href',
                        'https://github.com/OpenAdaptAI/openadapt-flow/tree/main/paper'
                    )
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
                // Blog is top-level, not duplicated inside the dropdown.
                cy.contains('a', 'Blog').should('not.exist')
            })
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

        // Reopen, then a click outside the dropdown closes it.
        cy.contains('button', 'Developers').click()
        cy.get('#nav-developers-menu').should('be.visible')
        cy.get('h1').click()
        cy.get('#nav-developers-menu').should('not.exist')
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
            cy.contains('Built for the interfaces your work depends on').should('be.visible')
            cy.contains('Web applications').should('be.visible')
            cy.contains('Windows applications').should('be.visible')
            cy.contains('RDP, Citrix & VDI').should('be.visible')
            cy.contains('qualification evidence')
                .should('have.attr', 'href')
                .and('include', '/tree/main/benchmark')
            cy.contains('Execution substrate evidence').should('not.exist')
            cy.contains('Partner qualification').should('not.exist')
            cy.contains('Research spike').should('not.exist')
            cy.contains('Product maturity').should('not.exist')
        })
        cy.get('#pricing').within(() => {
            cy.contains('Run it yourself or launch with us').should('be.visible')
            cy.contains('Managed browser').should('be.visible')
            cy.contains('Offer unavailable').should('not.exist')
            cy.contains('Hosted checkout unavailable').should('not.exist')
            cy.contains('approved sanitized copy').should('be.visible')

            if (isProductionDeployment()) {
                cy.contains('$500.00').should('be.visible')
                cy.contains('/month').should('be.visible')
                cy.contains('OpenAdapt Cloud').should('be.visible')
                cy.contains('Up to 10,000 workflow runs/month').should(
                    'be.visible'
                )
                cy.contains('Start hosted subscription').should('be.visible')
                cy.contains('Hosted execution').should('not.exist')
                cy.contains('Start with our team').should('not.exist')
            } else {
                cy.contains('Hosted execution').should('be.visible')
                cy.contains('Start with our team').should('be.visible')
                cy.contains('$500').should('not.exist')
                cy.contains('workflow runs/month').should('not.exist')
                cy.contains('Start hosted subscription').should('not.exist')
            }
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
            cy.contains('a', 'How it runs').should(
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
            cy.contains('a', 'Launch').should('have.attr', 'href', '/#pricing')
            cy.contains('a', 'Blog')
                .should('have.attr', 'href')
                .and('equal', 'https://blog.openadapt.ai')
            // The Developers dropdown renders as a labeled flat group.
            cy.contains('Developers').scrollIntoView().should('be.visible')
            cy.contains('a', 'Compiler/runtime source')
                .should('have.attr', 'href')
                .and(
                    'equal',
                    'https://github.com/OpenAdaptAI/openadapt-flow'
                )
            cy.contains('a', 'Docs')
                .should('have.attr', 'href')
                .and('equal', 'https://docs.openadapt.ai')
            cy.contains('a', 'Technical paper source')
                .should('have.attr', 'href')
                .and(
                    'equal',
                    'https://github.com/OpenAdaptAI/openadapt-flow/tree/main/paper'
                )
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
        })
        cy.get('#nav-mobile-menu').then(($menu) => {
            expect($menu[0].scrollHeight).to.be.greaterThan(
                $menu[0].clientHeight
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
            cy.contains(
                'Repeated, consequential GUI workflows without a practical API'
            ).should('be.visible')
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
        cy.contains('Evaluate a workflow')
            .scrollIntoView()
            .should('be.visible')
        cy.contains('Try locally').should('be.visible')
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
            cy.contains('Insurance claims reference').should('be.visible')
            cy.contains('Mortgage & lending ops').should('not.exist')
            cy.contains("There's An AI For That").should('not.exist')
        })

        cy.get('#how-it-works').within(() => {
            cy.contains('button', 'Healthcare')
                .should('have.attr', 'aria-pressed', 'true')
            cy.contains('button', 'Browser')
                .should('have.attr', 'aria-pressed', 'true')
            cy.get('figure[data-execution-environment="browser"]')
                .should('have.length', 5)
                .each(($figure) => {
                    cy.wrap($figure).should(
                        'have.attr',
                        'data-environment-source-kind',
                        'application-footage'
                    )
                })
            cy.get('img[alt*="OpenEMR"]').should('have.length', 5)
            cy.get('[data-testid^="reference-"]')
                .should('have.length', 3)
                .each(($panel) => {
                    cy.wrap($panel).should(
                        'have.attr',
                        'data-reference',
                        'healthcare'
                    )
                })
            cy.get('[data-testid="reference-compile-panel"]')
                .should('contain.text', 'OpenEMR browser reference')
                .and('contain.text', 'deployment-specific oracle required')
                .and(
                    'have.attr',
                    'data-stage-source',
                    '/how-it-works/record_openemr.gif'
                )
                .find('img')
                .should('have.attr', 'src', '/how-it-works/record_openemr.gif')
            cy.get('[data-testid="reference-resolve-panel"]')
                .should('contain.text', 'OpenEMR browser reference')
                .and(
                    'have.attr',
                    'data-stage-source',
                    '/how-it-works/run_openemr.gif'
                )
                .find('img')
                .should('have.attr', 'src', '/how-it-works/run_openemr.gif')
            cy.get('[data-testid="reference-resolve-panel"]')
                .find('[data-testid="resolve-target-track"]')
                .should('have.attr', 'data-resolve-track', 'openemrTargets')
                .and('have.attr', 'data-resolve-duration', '6.58s')
            cy.get('[data-testid="reference-verify-panel"]')
                .should('contain.text', 'qualification required')
                .and('contain.text', 'No application-specific audit result claimed')
                .and(
                    'have.attr',
                    'data-stage-source',
                    '/how-it-works/run_openemr.gif'
                )
                .find('img')
                .should('have.attr', 'src', '/how-it-works/run_openemr.gif')

            cy.contains('button', 'Lending').click()
            cy.contains('button', 'Lending')
                .should('have.attr', 'aria-pressed', 'true')
            cy.get('img[src="/lending-demo/record-frappe.gif"]').should(
                'be.visible'
            )
            cy.get('img[src="/lending-demo/replay-frappe.gif"]').should(
                'be.visible'
            )
            cy.get('[data-testid^="reference-"]')
                .each(($panel) => {
                    cy.wrap($panel).should(
                        'have.attr',
                        'data-reference',
                        'lending'
                    )
                })
            cy.get('[data-testid="reference-compile-panel"]')
                .should('contain.text', 'Frappe Lending reference')
                .and('contain.text', 'create-loan-application')
                .and(
                    'have.attr',
                    'data-stage-source',
                    '/lending-demo/record-frappe.gif'
                )
                .find('img')
                .should('have.attr', 'src', '/lending-demo/record-frappe.gif')
            cy.get('[data-testid="reference-resolve-panel"]')
                .should('contain.text', 'Frappe Loan Application evidence')
                .and(
                    'have.attr',
                    'data-stage-source',
                    '/lending-demo/replay-frappe.gif'
                )
                .find('img')
                .should('have.attr', 'src', '/lending-demo/replay-frappe.gif')
            cy.get('[data-testid="reference-resolve-panel"]')
                .find('[data-testid="resolve-target-track"]')
                .should('have.attr', 'data-resolve-track', 'frappeTargets')
                .and('have.attr', 'data-resolve-duration', '10.18s')
            cy.get('[data-testid="reference-verify-panel"]')
                .should('contain.text', '6 / 6 verified')
                .and('contain.text', '0 silent incorrect successes')
                .and(
                    'have.attr',
                    'data-stage-source',
                    '/lending-demo/replay-frappe.gif'
                )
                .find('img')
                .should('have.attr', 'src', '/lending-demo/replay-frappe.gif')

            cy.contains('button', 'Insurance').click()
            cy.contains('button', 'Insurance')
                .should('have.attr', 'aria-pressed', 'true')
            cy.get('img[src="/insurance-demo/record-openimis.gif"]').should(
                'be.visible'
            )
            cy.get('img[src="/insurance-demo/replay-openimis.gif"]').should(
                'be.visible'
            )
            cy.get('[data-testid^="reference-"]')
                .each(($panel) => {
                    cy.wrap($panel).should(
                        'have.attr',
                        'data-reference',
                        'insurance'
                    )
                })
            cy.get('[data-testid="reference-compile-panel"]')
                .should('contain.text', 'openIMIS claims reference')
                .and('contain.text', 'openimis-claim-intake')
                .and(
                    'have.attr',
                    'data-stage-source',
                    '/insurance-demo/record-openimis.gif'
                )
                .find('img')
                .should(
                    'have.attr',
                    'src',
                    '/insurance-demo/record-openimis.gif'
                )
            cy.get('[data-testid="reference-resolve-panel"]')
                .should('contain.text', 'openIMIS claim-form evidence')
                .and(
                    'have.attr',
                    'data-stage-source',
                    '/insurance-demo/replay-openimis.gif'
                )
                .find('img')
                .should(
                    'have.attr',
                    'src',
                    '/insurance-demo/replay-openimis.gif'
                )
            cy.get('[data-testid="reference-resolve-panel"]')
                .find('[data-testid="resolve-target-track"]')
                .should('have.attr', 'data-resolve-track', 'openimisTargets')
                .and('have.attr', 'data-resolve-duration', '19.79s')
            cy.get('[data-testid="reference-verify-panel"]')
                .should('contain.text', '3 / 3 verified')
                .and('contain.text', '0 duplicate claims')
                .and(
                    'have.attr',
                    'data-stage-source',
                    '/insurance-demo/replay-openimis.gif'
                )
                .find('img')
                .should(
                    'have.attr',
                    'src',
                    '/insurance-demo/replay-openimis.gif'
                )
            cy.contains('View the bounded use case')
                .should('have.attr', 'href')
                .and('equal', '/solutions/insurance')

            cy.contains('button', 'RDP').click()
            cy.contains('button', 'RDP')
                .should('have.attr', 'aria-pressed', 'true')
            cy.contains('button', 'Insurance')
                .should('have.attr', 'aria-pressed', 'true')
            cy.get('figure[data-execution-environment="rdp"]')
                .should('have.length', 5)
                .each(($figure) => {
                    cy.wrap($figure).should(
                        'have.attr',
                        'data-environment-source-kind',
                        'transport-visualization'
                    )
                })
            cy.contains('governed RDP transport path').should('be.visible')
            cy.get('img[src="/insurance-demo/record-openimis.gif"]').should(
                'be.visible'
            )

            cy.contains('button', 'Citrix').click()
            cy.contains('button', 'Citrix')
                .should('have.attr', 'aria-pressed', 'true')
            cy.get('figure[data-execution-environment="citrix"]')
                .should('have.length', 5)
                .and(
                    'have.attr',
                    'data-environment-source-kind',
                    'transport-visualization'
                )
            cy.contains('governed ICA/HDX transport path').should(
                'be.visible'
            )

            cy.contains('button', 'Linux').click()
            cy.contains(
                'Native Linux execution uses AT-SPI structural evidence'
            ).should('be.visible')
            cy.get('figure[data-execution-environment="linux"]')
                .should('have.length', 5)
                .and(
                    'have.attr',
                    'data-environment-source-kind',
                    'environment-visualization'
                )

            for (const environment of ['Windows', 'macOS', 'Browser']) {
                cy.contains('button', environment).click()
                cy.contains('button', environment).should(
                    'have.attr',
                    'aria-pressed',
                    'true'
                )
            }
        })

        cy.viewport(375, 812)
        cy.visit('/')
        cy.get('#how-it-works').within(() => {
            cy.contains('button', 'Insurance').click()
            cy.contains('button', 'Citrix').click()
            cy.get('img[src="/insurance-demo/record-openimis.gif"]').should(
                'be.visible'
            )
            cy.get('figure[data-execution-environment="citrix"]').should(
                'have.length',
                5
            )
        })
        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(375)
        })

        cy.visit('/solutions/healthcare')
        cy.get('h1').should('contain.text', 'structured healthcare workflows')
        cy.contains('document processing, eligibility, routing').should('be.visible')
        cy.contains('public safety gallery').should('be.visible')
        cy.contains('OpenAdapt does the retyping').should('not.exist')
        cy.contains('Certified workflows halt before').should('not.exist')

        cy.visit('/solutions/lending')
        cy.get('h1')
            .should('contain.text', 'final UI-only mile')
            .and('not.contain.text', 'Encompass')
            .and('not.contain.text', 'Mortgage')
        cy.contains('supported APIs and exports').should('be.visible')
        cy.contains('customer-controlled deployment').should('be.visible')
        cy.contains('experimental').should('not.exist')
        cy.get('[data-testid="frappe-lending-workflow-demo"]').should('be.visible')
        cy.get('img[alt*="Frappe Lending frames"]')
            .scrollIntoView()
            .should('be.visible')
        cy.get('img[alt*="deterministically replaying"]')
            .scrollIntoView()
            .should('be.visible')
        cy.contains('6/6 compiled trials correct').should('be.visible')
        cy.get('img[alt*="Frappe Lending frames"]')
            .should('have.attr', 'src')
            .and('equal', '/lending-demo/record-frappe.gif')
        cy.get('img[alt*="deterministically replaying"]')
            .should('have.attr', 'src')
            .and('equal', '/lending-demo/replay-frappe.gif')
        cy.contains(/Pause animation|Play animation/).should('not.exist')
        cy.contains('Inspect evidence manifest')
            .should('have.attr', 'href')
            .and('equal', '/lending-demo/provenance.json')
        cy.get('img[alt*="OpenEMR"]').should('not.exist')

        cy.visit('/solutions/insurance')
        cy.get('h1').should('contain.text', 'Claims intake')
        cy.contains('supported APIs for adjudication').should('be.visible')
        cy.get('[data-testid="openimis-claims-workflow-demo"]').should(
            'be.visible'
        )
        cy.get('img[src="/insurance-demo/record-openimis.gif"]')
            .scrollIntoView()
            .should('be.visible')
        cy.get('img[src="/insurance-demo/replay-openimis.gif"]')
            .scrollIntoView()
            .should('be.visible')
        cy.contains('Inspect evidence manifest')
            .should('have.attr', 'href')
            .and('equal', '/insurance-demo/provenance.json')

        cy.viewport(375, 812)
        cy.visit('/solutions/lending')
        cy.get('[data-testid="frappe-lending-workflow-demo"]')
            .scrollIntoView()
            .should('be.visible')
        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(375)
        })

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
                expect(response.body.error).to.equal(
                    'checkout_not_configured'
                )
            }
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
        cy.contains('Effective July 17, 2026.').should('be.visible')
        cy.contains('DRAFT — NOT OPERATIVE.').should('not.exist')
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
        cy.contains('A BAA applies only when expressly included').should(
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
        cy.contains('Effective July 17, 2026.').should('be.visible')
        cy.contains('DRAFT — NOT OPERATIVE FOR PAID PRODUCTION.').should(
            'not.exist'
        )
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
        cy.contains('Sign in with the email used at checkout').should('be.visible')
        cy.contains('review the captured demonstration').should('be.visible')
        cy.contains('Run under supervision').should('be.visible')
        cy.contains('Monitor usage, outcomes').should('be.visible')
        cy.contains('customer-controlled deployment').should('be.visible')
    })
})
