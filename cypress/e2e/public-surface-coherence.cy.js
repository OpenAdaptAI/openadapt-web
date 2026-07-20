describe('public surface coherence', () => {
    it('keeps the flagship project, evaluation funnel, and local quickstart distinct', () => {
        cy.viewport(1280, 1000)
        cy.visit('/')

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
        cy.contains('a', 'Start with OpenAdapt Cloud').should(
            'have.attr',
            'href',
            '/#cloud-product'
        )
        cy.get('a.btn-ghost-ink')
            .contains('Evaluate a workflow')
            .should('have.attr', 'href', '/#book')
        cy.get('a.btn-ghost-ink')
            .contains('Try locally')
            .should('have.attr', 'href', '/#open-source')

        cy.screenshot('public-surface-hero-desktop', {
            capture: 'viewport',
        })

        cy.get('[data-testid="local-quickstart"]')
            .scrollIntoView()
            .should('be.visible')
            .within(() => {
                cy.contains('pip install openadapt').should('be.visible')
                cy.contains('openadapt flow demo-record --out rec').should(
                    'be.visible'
                )
                cy.contains('a', 'Read docs')
                    .should('have.attr', 'href')
                    .and('include', 'docs.openadapt.ai')
            })

        cy.get('[data-testid="local-quickstart"]').screenshot(
            'public-surface-local-quickstart-desktop'
        )
    })

    it('keeps flagship star and fork counts visible across public pages', () => {
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
            '/',
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
            cy.get('[data-testid="footer-repository-source"]')
                .invoke('text')
                .should(
                    'match',
                    /^GitHub(?: · (?:refreshed recently|last-known counts)| snapshot · refreshed when available)$/
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
        cy.get('[data-testid="footer-repository-source"]').should(
            'contain.text',
            'GitHub snapshot'
        )
    })
})
