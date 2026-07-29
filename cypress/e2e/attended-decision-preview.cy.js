describe('attended decision preview', () => {
    it('switches between the real request and runner result, and links to the full demo', () => {
        cy.visit('/')

        cy.get('[data-testid="attended-decision-toggle"]').within(() => {
            cy.get('button').eq(1).click().should('have.attr', 'aria-pressed', 'true')
        })
        cy.get('[data-testid="attended-decision-capture"]')
            .should('have.attr', 'src', '/attended-decision/identity-verified.png')

        cy.get('[data-testid="attended-decision-toggle"]').within(() => {
            cy.get('button').eq(0).click().should('have.attr', 'aria-pressed', 'true')
        })
        cy.get('[data-testid="attended-decision-capture"]')
            .should('have.attr', 'src', '/attended-decision/identity-request.png')

        cy.get('[data-testid="attended-decision-demo-link"]')
            .should('have.attr', 'href', 'https://app.openadapt.ai/demo/attention')
            .and('have.attr', 'target', '_blank')
    })
})
