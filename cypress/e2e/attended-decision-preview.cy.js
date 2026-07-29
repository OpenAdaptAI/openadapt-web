describe('attended decision preview', () => {
    const demoHref = 'https://app.openadapt.ai/demo/attention'

    it('keeps the six-case demo link available without horizontal overflow', () => {
        cy.viewport(1280, 900)
        cy.visit('/')
        cy.get('section[aria-labelledby="attended-decision-title"]')
            .scrollIntoView()
            .should('be.visible')
            .within(() => {
                cy.contains('a', 'Try all six mobile decision cases in Cloud')
                    .should('have.attr', 'href', demoHref)
                    .and('have.attr', 'target', '_blank')
            })

        cy.viewport(390, 844)
        cy.reload()
        cy.get('section[aria-labelledby="attended-decision-title"]')
            .scrollIntoView()
            .should('be.visible')
        cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(390)
        })
    })
})
