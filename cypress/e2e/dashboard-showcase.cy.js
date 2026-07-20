describe('Cloud product showcase', () => {
    const TAB_LABELS = [
        'Dashboard',
        'Run detail',
        'Halt evidence',
        'Program visualizer',
        'Workflow catalog',
    ]

    it('rotates the real hosted product through labeled tabs on desktop', () => {
        cy.viewport(1440, 1700)
        cy.visit('/hosted/welcome')

        cy.get('#cloud-product').scrollIntoView().should('be.visible')

        cy.get('[data-testid="dashboard-product-preview"]').within(() => {
            // Five real frames are stacked in the rotating stage; the dashboard
            // is the default active frame, framed as app.openadapt.ai.
            cy.get('[data-testid="dashboard-slide"]').should('have.length', 5)
            cy.get('[data-testid="dashboard-slide"]').each(($img) => {
                cy.wrap($img).should('have.attr', 'loading', 'lazy')
            })
            cy.get('[data-testid="dashboard-slide"][data-active="true"]')
                .should('have.length', 1)
                .and('have.attr', 'data-slide', 'dashboard')
                .and('have.attr', 'src')
                .and('include', '/product-preview/dashboard-workflows.png')
            cy.contains('app.openadapt.ai/dashboard').should('be.visible')

            // Labeled, clickable tabs for every frame, plus progress dots.
            cy.get('[data-testid="dashboard-tab"]').should('have.length', 5)
            TAB_LABELS.forEach((label) => {
                cy.get('[data-testid="dashboard-tabs"]').should(
                    'contain.text',
                    label
                )
            })
            cy.get('[data-testid="dashboard-dots"] button').should(
                'have.length',
                5
            )

            // The Dashboard tab is highlighted as active by default.
            cy.get('[data-testid="dashboard-tab"][data-slide="dashboard"]')
                .should('have.attr', 'aria-selected', 'true')
                .and('have.attr', 'data-active', 'true')

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

        // Clicking a tab jumps the large slot to that real frame and moves the
        // highlight and browser address with it.
        cy.get('[data-testid="dashboard-tab"][data-slide="evidence"]').click()
        cy.get('[data-testid="dashboard-slide"][data-active="true"]')
            .should('have.attr', 'data-slide', 'evidence')
            .and('have.attr', 'src')
            .and('include', '/cloud-preview/healthcare-evidence.jpg')
        cy.get('[data-testid="dashboard-tab"][data-slide="evidence"]').should(
            'have.attr',
            'aria-selected',
            'true'
        )

        cy.get('[data-testid="dashboard-tab"][data-slide="program"]').click()
        cy.get('[data-testid="dashboard-slide"][data-active="true"]')
            .should('have.attr', 'data-slide', 'program')
            .and('have.attr', 'src')
            .and('include', '/cloud-preview/program-graph.png')

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
        cy.get('[data-testid="dashboard-tab"]').should('have.length', 5)
        cy.document().then((doc) => {
            expect(doc.documentElement.scrollWidth).to.be.at.most(375)
        })

        cy.get('#cloud-product').screenshot('dashboard-showcase-mobile')
    })
})
