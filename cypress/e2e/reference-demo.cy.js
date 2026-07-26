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
                cy.get('img').then(($media) => {
                    cy.get('[data-overlay-kind="source-metadata"]').then(
                        ($capsule) => {
                            expect(
                                $capsule[0].getBoundingClientRect().top
                            ).to.be.at.least(
                                $media[0].getBoundingClientRect().bottom - 1
                            )
                        }
                    )
                })
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
                expect($video[0].currentSrc).to.include('run_openemr')
            )
        cy.get('@showcase').contains('button', 'Recorded demonstration').click()
        cy.get('@showcase')
            .find('video')
            .should(($video) =>
                expect($video[0].currentSrc).to.include('record_openemr')
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
