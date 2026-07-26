describe('public JSON artifact viewer', () => {
    const viewer = '/artifacts/json?source=%2Fstatus.json'

    it('opens an allowlisted artifact with a computed digest and useful controls', () => {
        cy.visit('/workflows')
        cy.contains('a', 'status manifest').click()
        cy.location('pathname').should('equal', '/artifacts/json')
        cy.location('search').should('include', 'source=%2Fstatus.json')

        cy.get('dt').contains('Loaded SHA-256').parent().should('be.visible')
        cy.get('a[href="/status.json"]').should('have.length', 2)
        cy.get('input[type="search"]').type('citrix')
        cy.get('[aria-label="JSON search results"] li button').first().click()
        cy.contains('Focused value').parent().should('contain.text', '$')
        cy.location('search').should('include', 'pointer=')
        cy.reload()
        cy.contains('Focused value').parent().should('contain.text', '$')
        cy.get('[aria-label*="JSON tree"]').should('be.visible')
    })

    it('does not turn unknown paths into a fetch surface', () => {
        cy.request({
            url: '/artifacts/json?source=https%3A%2F%2Fexample.com%2Fx.json',
            failOnStatusCode: false,
        })
            .its('status')
            .should('equal', 404)
    })

    it('keeps the evidence controls usable on a small screen', () => {
        cy.viewport(375, 760)
        cy.visit(viewer)
        cy.get('dt').contains('Loaded SHA-256').parent().should('be.visible')
        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(375)
        })
    })
})
