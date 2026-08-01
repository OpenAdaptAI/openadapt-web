describe('public surface coherence', () => {
    it('offers CLI and Desktop as equal local entry paths before Cloud', () => {
        cy.visit('/start')

        cy.get('[role="list"][aria-label="Local ways to run OpenAdapt"]')
            .find('[role="listitem"]')
            .should('have.length', 2)
        cy.get('[data-testid="local-desktop-download"]').should(
            'have.attr',
            'href',
            '/download#desktop-builds'
        )
        cy.get('[data-testid="local-cli-walkthrough"]').should(
            'have.attr',
            'href',
            'https://docs.openadapt.ai/get-started/'
        )
        cy.get('[data-testid="local-next-steps"]').should('be.visible')
    })

    it('routes buyers and developers to the intended entry points', () => {
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
        cy.contains('a', 'Qualify one workflow')
            .should('be.visible')
            .and('have.attr', 'href', '/qualify')
        cy.get('[data-testid="local-quickstart-cta"]')
            .should('be.visible')
            .and('have.attr', 'href', '/start')
        cy.get('[data-testid="cloud-demo-cta"]')
            .should('be.visible')
            .and(
                'have.attr',
                'href',
                'https://app.openadapt.ai/demo'
            )
    })

    it('renders the same repository counts in the hero and footer', () => {
        cy.visit('/')
        cy.get('[data-testid="github-proof"]').should('contain.text', 'stars on OpenAdapt')
        cy.get('[data-testid="footer-star-count"]')
            .invoke('text')
            .should('match', /^\d{1,3}(,\d{3})*$/)
        cy.get('[data-testid="footer-fork-count"]')
            .invoke('text')
            .should('match', /^\d{1,3}(,\d{3})*$/)
    })

    it('keeps flagship star and fork counts visible across solution pages', () => {
        for (const path of [
            '/solutions/healthcare',
            '/solutions/lending',
            '/solutions/insurance',
        ]) {
            cy.visit(path)
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
                    /^GitHub · (?:updated (?:just now|\d+[smhd] ago)|last-known counts)$/
                )
        }

        cy.get('[data-testid="footer-repository-stats"]').screenshot(
            'footer-repository-stats-desktop'
        )
    })

})
