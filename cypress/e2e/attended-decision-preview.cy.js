describe('attended decision preview', () => {
    it('switches through the request, accepted, and runner-result states', () => {
        // The homepage now shows the separate qualification-time judgment
        // capture. The operational request/accept/result contract lives on the
        // Execute product page.
        cy.visit('/execute')

        cy.get('[data-testid="attended-decision-toggle"]').within(() => {
            cy.get('button').eq(1).click().should('have.attr', 'aria-pressed', 'true')
        })
        cy.get('[data-testid="attended-decision-capture"]')
            .should('have.attr', 'src', '/attended-decision/decision-pending.jpg')

        cy.get('[data-testid="attended-decision-toggle"]').within(() => {
            cy.get('button').eq(2).click().should('have.attr', 'aria-pressed', 'true')
        })
        cy.get('[data-testid="attended-decision-capture"]')
            .should('have.attr', 'src', '/attended-decision/identity-verified.jpg')

        cy.get('[data-testid="attended-decision-toggle"]').within(() => {
            cy.get('button').eq(0).click().should('have.attr', 'aria-pressed', 'true')
        })
        cy.get('[data-testid="attended-decision-capture"]')
            .should('have.attr', 'src', '/attended-decision/identity-request.jpg')

        cy.get('[data-testid="attended-decision-demo-link"]')
            .should('have.attr', 'href', 'https://app.openadapt.ai/demo/attention')
            .and('have.attr', 'target', '_blank')
    })
})
