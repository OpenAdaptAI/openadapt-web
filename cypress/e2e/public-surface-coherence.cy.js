describe('public surface coherence', () => {
    it('routes buyers and developers to the intended entry points', () => {
        cy.viewport(1280, 1000)
        // Keep this homepage visit self-contained. Without an immediate
        // response, its asynchronous stats request can outlive the test and
        // satisfy the next test's intercept before that test's own visit.
        cy.intercept('GET', '/api/repository-stats', {
            statusCode: 200,
            body: {
                stars: 1650,
                forks: 259,
                observedAt: '2026-07-24T11:00:00.000Z',
                source: 'github',
                stale: false,
            },
        }).as('initialHomepageRepositoryStats')
        cy.visit('/')
        cy.wait('@initialHomepageRepositoryStats')

        cy.get('nav[aria-label="Primary"]')
            .contains('a', 'Open source')
            .should(
                'have.attr',
                'href',
                'https://github.com/OpenAdaptAI/OpenAdapt'
            )
        cy.get('[data-testid="github-proof"]').should(
            'contain.text',
            'stars on OpenAdapt'
        )
        cy.contains('a', 'Qualify one workflow')
            .should('be.visible')
            .and('have.attr', 'href', '/qualify')
        cy.contains('a', 'Run the open-source demo')
            .should('be.visible')
            .and('have.attr', 'href')
            .and('include', 'docs.openadapt.ai')
    })

    it('updates homepage hero and footer from one repository-stats response', () => {
        cy.intercept('GET', '/api/repository-stats', {
            statusCode: 200,
            body: {
                stars: 1660,
                forks: 260,
                observedAt: '2026-07-24T12:00:00.000Z',
                source: 'github',
                stale: false,
            },
        }).as('homepageRepositoryStats')

        cy.visit('/')
        cy.wait('@homepageRepositoryStats')

        cy.get('[data-testid="github-proof"]')
            .should('contain.text', '1.7k stars on OpenAdapt')
            .and('contain.text', '260 forks')
        cy.get('[data-testid="footer-star-count"]').should(
            'have.text',
            '1,660'
        )
        cy.get('[data-testid="footer-fork-count"]').should('have.text', '260')
        cy.get('@homepageRepositoryStats.all').should('have.length', 1)
    })

    it('keeps flagship star and fork counts visible across solution pages', () => {
        cy.intercept('GET', '/api/repository-stats', {
            statusCode: 200,
            body: {
                stars: 1650,
                forks: 259,
                observedAt: '2026-07-18T12:00:00.000Z',
                source: 'github',
                stale: false,
            },
        }).as('repositoryStats')

        for (const path of [
            '/solutions/healthcare',
            '/solutions/lending',
            '/solutions/insurance',
        ]) {
            cy.visit(path)
            cy.wait('@repositoryStats')
            cy.get('[data-testid="footer-repository-stats"]')
                .scrollIntoView()
                .should('be.visible')
                .within(() => {
                    // GitHub-official-style star/fork buttons: icon + label +
                    // a count bubble. The descriptive count lives in the
                    // accessible name of each button.
                    cy.contains('Star').should('be.visible')
                    cy.get('[data-testid="footer-star-count"]')
                        .invoke('text')
                        .should('match', /^\d{1,3}(,\d{3})*$/)
                    cy.get('a[aria-label*="stars on OpenAdapt"]').should(
                        'exist'
                    )
                    cy.contains('Fork').should('be.visible')
                    cy.get('[data-testid="footer-fork-count"]')
                        .invoke('text')
                        .should('match', /^\d{1,3}(,\d{3})*$/)
                    cy.get('a[aria-label*="forks of OpenAdapt"]').should(
                        'exist'
                    )
                    cy.get(
                        'a[href="https://github.com/OpenAdaptAI/OpenAdapt"]'
                    ).should('exist')
                })
            // Honest, live-updating attribution tied to the actual last
            // successful fetch: "GitHub · updated just now / Ns ago / ...".
            cy.get('[data-testid="footer-repository-source"]')
                .invoke('text')
                .should(
                    'match',
                    /^GitHub · updated (?:just now|\d+[smhd] ago)$/
                )
        }

        cy.get('[data-testid="footer-repository-stats"]').screenshot(
            'footer-repository-stats-desktop'
        )
    })

    it('never blanks footer counts when the refresh endpoint is unavailable', () => {
        cy.intercept('GET', '/api/repository-stats', {
            statusCode: 503,
            body: { error: 'unavailable' },
        })
        cy.visit('/solutions/healthcare')

        cy.get('[data-testid="footer-repository-stats"]')
            .scrollIntoView()
            .should('be.visible')
            .within(() => {
                cy.get('[data-testid="footer-star-count"]').should(
                    'have.text',
                    '1,648'
                )
                cy.get('[data-testid="footer-fork-count"]').should(
                    'have.text',
                    '258'
                )
            })
        // The refresh failed, so the committed snapshot survives and is
        // labelled honestly as a snapshot rather than a fresh fetch.
        cy.get('[data-testid="footer-repository-source"]').should(
            'contain.text',
            'GitHub · snapshot'
        )
    })
})
