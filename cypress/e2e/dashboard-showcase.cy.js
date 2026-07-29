describe('Cloud product showcase', () => {
    it('rotates the real hosted product through labeled tabs on desktop', () => {
        cy.viewport(1440, 1700)
        cy.visit('/hosted/welcome')

        cy.get('#cloud-product').scrollIntoView().should('be.visible')

        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            // Every discovered tab must activate its matching, decoded slide.
            cy.get('[data-testid="dashboard-slide"]').each(($img) => {
                cy.wrap($img).should('have.attr', 'loading', 'lazy')
            })
            cy.get('[data-testid="dashboard-tab"]')
                .should('have.length.at.least', 1)
                .then(($tabs) => {
                    cy.get('[data-testid="dashboard-slide"]').should(
                        'have.length',
                        $tabs.length
                    )
                    cy.get('[data-testid="dashboard-dots"] button').should(
                        'have.length',
                        $tabs.length
                    )
                    cy.wrap($tabs).each(($tab) => {
                        const slide = $tab.attr('data-slide')
                        expect(slide).to.be.a('string').and.not.be.empty
                        cy.wrap($tab).click()
                        cy.get('[data-testid="dashboard-slide"][data-active="true"]')
                            .should('have.length', 1)
                            .and('have.attr', 'data-slide', slide)
                            .should(($img) =>
                                expect($img[0].naturalWidth).to.be.greaterThan(0)
                            )
                    })
                })
            // A visible countdown sits on the active thumbnail.
            cy.get('[data-testid="dashboard-countdown"]').should('have.length', 1)

            // Honest labeling, trimmed: just the real-interface line.
            cy.contains('Real OpenAdapt Cloud interface').should('be.visible')
        })

        // The verbose sample/mock-data disclaimer is trimmed away.
        cy.get('#cloud-product').should(
            'not.contain.text',
            'mock-data mode with synthetic records'
        )

        // No fake mini-app scaffolding or raw reference-application endpoint.
        cy.get('#cloud-product').should('not.contain.text', 'Operating view')
        cy.get('#cloud-product').should(
            'not.contain.text',
            'demo.openemr.io/openemr/index.php'
        )

        // The CTA opens the real public mobile decision demo without requiring
        // an account. The route is the user-action contract; the label is not.
        cy.get('#cloud-product')
            .find('[data-testid="mobile-decision-demo-link"]')
            .should(
                'have.attr',
                'href',
                'https://app.openadapt.ai/demo/attention'
            )

        // Wait for the active capture to decode, then screenshot.
        cy.get('#cloud-product').scrollIntoView()
        cy.get('[data-testid="dashboard-slide"][data-active="true"]').should(
            ($img) => expect($img[0].naturalWidth).to.be.greaterThan(0)
        )
        cy.get('#cloud-product').screenshot('dashboard-showcase-desktop')
    })

    it('renders the showcase without horizontal overflow on mobile', () => {
        cy.viewport(375, 900)
        cy.visit('/hosted/welcome')

        cy.get('#cloud-product').scrollIntoView().should('be.visible')

        // The active slide stays within the viewport (no horizontal overflow).
        cy.get('[data-testid="dashboard-slide"][data-active="true"]').then(
            ($img) => {
                expect($img[0].getBoundingClientRect().width).to.be.at.most(375)
            }
        )
        // The tabs remain available on mobile.
        cy.get('[data-testid="dashboard-tab"]').should('have.length.at.least', 1)
        cy.document().then((doc) => {
            expect(doc.documentElement.scrollWidth).to.be.at.most(375)
        })

        cy.get('#cloud-product').screenshot('dashboard-showcase-mobile')
    })
})
