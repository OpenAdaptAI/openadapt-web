describe('shared real-application demo', () => {
    const routes = [
        ['/', 'healthcare'],
        ['/solutions/healthcare', 'healthcare'],
        ['/solutions/lending', 'lending'],
        ['/solutions/insurance', 'insurance'],
    ]

    for (const [route, initialReference] of routes) {
        it(`renders the shared evidence player on ${route}`, () => {
            cy.visit(route)
            cy.get('[data-testid="reference-demo-showcase"]')
                .first()
                .should('have.attr', 'data-active-reference', initialReference)
                .within(() => {
                    cy.get('[data-testid="reference-evidence-player"]')
                        .should(
                            'have.attr',
                            'data-target-tracking',
                            'omitted-without-exact-timeline'
                        )
                    cy.contains('button', 'Recorded demonstration').click()
                    cy.contains('Recorded demonstration')
                    cy.contains('button', 'Compiled replay').click()
                    cy.contains('Open the full Cloud demo')
                })
        })
    }

    it('keeps the player usable on a narrow viewport', () => {
        cy.viewport(390, 844)
        cy.visit('/solutions/lending')
        cy.get('[data-testid="reference-evidence-player"]')
            .scrollIntoView()
            .should('be.visible')
            .within(() => {
                cy.get('img').should(($image) => {
                    expect($image[0].naturalWidth).to.be.greaterThan(0)
                })
                cy.get('button[aria-label="Pause"], button[aria-label="Play"]')
                    .should('have.css', 'width', '44px')
                cy.get('button[aria-label="Enter full screen"]')
                    .should('have.css', 'height', '44px')
            })
    })
})
