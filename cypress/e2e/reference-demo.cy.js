describe('shared real-application demo', () => {
    const routes = [
        ['/', 'healthcare', 'exact-decoded-frame-bound'],
        ['/solutions/healthcare', 'healthcare', 'exact-decoded-frame-bound'],
        ['/solutions/lending', 'lending', 'omitted-without-exact-timeline'],
        ['/solutions/insurance', 'insurance', 'omitted-without-exact-timeline'],
        ['/how-it-works', 'healthcare', 'exact-decoded-frame-bound'],
        ['/dental', 'insurance', 'omitted-without-exact-timeline'],
    ]

    for (const [route, initialReference, replayTracking] of routes) {
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
                            replayTracking
                        )
                    cy.contains('button', 'Recorded demonstration').click()
                    cy.get('[data-testid="reference-evidence-player"]')
                        .should(
                            'have.attr',
                            'data-target-tracking',
                            'omitted-without-exact-timeline'
                        )
                    cy.contains('button', 'Compiled replay').click()
                    cy.get('[data-testid="reference-evidence-player"]')
                        .should('have.attr', 'data-target-tracking', replayTracking)
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
                cy.get('[data-overlay-kind="source-metadata"]').should(
                    'not.exist'
                )
            })
    })

    it('remounts exact media and supports keyboard-complete application tabs', () => {
        cy.visit('/')
        cy.get('[data-testid="reference-demo-showcase"]')
            .first()
            .as('showcase')
        cy.get('@showcase')
            .find('video')
            .should(($video) =>
                expect($video[0].currentSrc).to.include('openemr-replay.mp4')
            )
        cy.get('@showcase')
            .find('[data-overlay-kind="canonical-runtime-state"]')
            .should('contain.text', 'OpenEMR')
        cy.get('@showcase').contains('button', 'Guided view').should('be.visible')
        cy.get('@showcase').contains('button', 'Raw footage').click()
        cy.get('@showcase')
            .find('[data-testid="reference-evidence-player"]')
            .should(
                'have.attr',
                'data-target-tracking',
                'omitted-without-exact-timeline'
            )
        cy.get('@showcase').contains('button', 'Guided view').click()
        cy.get('@showcase').contains('button', 'Recorded demonstration').click()
        cy.get('@showcase')
            .contains('Source demonstration · synthetic data')
            .should('be.visible')
        cy.get('@showcase').should('not.contain.text', 'Reference qualification')
        cy.get('@showcase')
            .find('video')
            .should(($video) =>
                expect($video[0].currentSrc).to.include('openemr-source-recording.unbound.mp4')
            )

        cy.get('@showcase')
            .find('[role="tab"][aria-selected="true"]')
            .focus()
            .type('{rightarrow}')
        cy.get('@showcase')
            .should('have.attr', 'data-active-reference', 'lending')
            .find('[role="tab"][aria-selected="true"]')
            .should('contain.text', 'Lending')
            .type('{end}')
        cy.get('@showcase')
            .should('have.attr', 'data-active-reference', 'insurance')
            .find('[role="tabpanel"]')
            .should('have.attr', 'aria-labelledby')
    })

})
