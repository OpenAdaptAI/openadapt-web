describe('Cloud product showcase', () => {
    it('shows the real hosted product with large screenshots on desktop', () => {
        cy.viewport(1440, 1700)
        cy.visit('/hosted/welcome')

        cy.get('#cloud-product').scrollIntoView().should('be.visible')

        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            // The large primary shot is the real workflows dashboard capture,
            // framed as the hosted product at app.openadapt.ai.
            cy.contains('app.openadapt.ai/dashboard').should('be.visible')
            cy.get('[data-testid="dashboard-primary-shot"]')
                .should('be.visible')
                .and('have.attr', 'src')
                .and('include', '/product-preview/dashboard-workflows.png')
            cy.get('[data-testid="dashboard-primary-shot"]')
                .should('have.attr', 'loading', 'lazy')

            // A small gallery of real supporting frames.
            cy.get('[data-testid="dashboard-gallery-shot"]')
                .should('have.length', 4)
                .each(($img) => {
                    cy.wrap($img).should('have.attr', 'loading', 'lazy')
                })
            cy.get('[data-testid="dashboard-gallery"]')
                .should('contain.text', 'Program visualizer')
                .and('contain.text', 'Workflow catalog')
                .and('contain.text', 'Run detail')
                .and('contain.text', 'Halt evidence')

            // Honest labeling: real interface, mock-data mode.
            cy.contains('Real OpenAdapt Cloud interface').should('be.visible')
            cy.contains(
                'Shown in mock-data mode with synthetic records, not a customer or production run'
            ).should('be.visible')
        })

        // No fake mini-app scaffolding and no unverifiable domain.
        cy.get('#cloud-product').should('not.contain.text', 'Operating view')
        cy.get('#cloud-product').should(
            'not.contain.text',
            'demo.openadapt.ai'
        )

        // The CTA opens the real hosted app.
        cy.get('#cloud-product')
            .contains('a', 'Open the Cloud app')
            .should('have.attr', 'href')
            .and('include', 'app.openadapt.ai')

        // Wait for the large lazy captures to decode before screenshotting.
        cy.get('#cloud-product').scrollIntoView()
        cy.get('[data-testid="dashboard-primary-shot"]').should(
            ($img) => expect($img[0].naturalWidth).to.be.greaterThan(0)
        )
        cy.get('[data-testid="dashboard-gallery-shot"]').each(($img) => {
            cy.wrap($img).should(
                ($el) => expect($el[0].naturalWidth).to.be.greaterThan(0)
            )
        })
        cy.get('#cloud-product').screenshot('dashboard-showcase-desktop')
    })

    it('renders the showcase without horizontal overflow on mobile', () => {
        cy.viewport(375, 900)
        cy.visit('/hosted/welcome')

        cy.get('#cloud-product').scrollIntoView().should('be.visible')

        // Images stay within the viewport (no horizontal overflow at 375px).
        cy.get('[data-testid="dashboard-primary-shot"]').then(($img) => {
            expect($img[0].getBoundingClientRect().width).to.be.at.most(375)
        })
        cy.get('[data-testid="dashboard-gallery-shot"]').should(
            'have.length',
            4
        )
        cy.document().then((doc) => {
            expect(doc.documentElement.scrollWidth).to.be.at.most(375)
        })

        cy.get('#cloud-product').screenshot('dashboard-showcase-mobile')
    })
})
