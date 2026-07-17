describe('link interaction hierarchy', () => {
    it('keeps prose links identifiable while navigation and CTAs stay quiet', () => {
        cy.viewport(1280, 900)
        cy.visit('/about')

        cy.contains('a[href="mailto:hello@openadapt.ai"]', 'hello@openadapt.ai')
            .should('be.visible')
            .and('have.css', 'text-decoration-line', 'underline')
            .focus()
            .should('have.css', 'outline-style', 'solid')
            .and('have.css', 'outline-width', '3px')

        cy.get('header a').first()
            .should('be.visible')
            .and('have.css', 'text-decoration-line', 'none')

        cy.get('a.btn-ink').first()
            .should('be.visible')
            .and('have.css', 'text-decoration-line', 'none')
    })

    it('retains the inline-link affordance without horizontal overflow on mobile', () => {
        cy.viewport(375, 667)
        cy.visit('/about')

        cy.contains('a[href="mailto:hello@openadapt.ai"]', 'hello@openadapt.ai')
            .scrollIntoView()
            .should('be.visible')
            .and('have.css', 'text-decoration-line', 'underline')

        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(375)
        })
    })
})
