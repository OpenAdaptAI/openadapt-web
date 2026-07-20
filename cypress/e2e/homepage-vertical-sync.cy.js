// The homepage reference selector is shared: the process/reference-workflow
// section and the "More reference workflows" list read and write ONE lifted
// vertical. Selecting a vertical in either section must update the other, and
// the choice must be deep-linkable via ?ref=.

describe('Homepage reference-vertical sync', () => {
    it('keeps the process section and the reference list on one shared vertical', () => {
        cy.viewport(1280, 1800)
        cy.visit('/')

        // Default: the homepage leads with the verified Lending reference, and
        // the list reflects it.
        cy.get('[data-testid="home-reference-workflow"]')
            .should('have.attr', 'data-reference', 'lending')
            .and('contain.text', 'verified Frappe write')
        cy.get('[data-testid="reference-link-lending"]').should(
            'have.attr',
            'aria-pressed',
            'true'
        )

        // List -> process: selecting Healthcare in the "More reference
        // workflows" list switches the process section to Healthcare, and the
        // section keeps the honest qualification-required label (never
        // "verified").
        cy.get('[data-testid="reference-link-healthcare"]')
            .scrollIntoView()
            .click()
            .should('have.attr', 'aria-pressed', 'true')
        cy.get('[data-testid="reference-link-lending"]').should(
            'have.attr',
            'aria-pressed',
            'false'
        )
        cy.get('[data-testid="home-reference-workflow"]')
            .should('have.attr', 'data-reference', 'healthcare')
            .and('contain.text', 'qualification required')
        cy.get('[data-testid="home-reference-tab-healthcare"]').should(
            'have.attr',
            'aria-pressed',
            'true'
        )

        // Process -> list: selecting Insurance in the in-section tabs updates
        // the list highlight and the URL, proving the selection is shared both
        // ways.
        cy.get('[data-testid="home-reference-tab-insurance"]')
            .scrollIntoView()
            .click()
            .should('have.attr', 'aria-pressed', 'true')
        cy.get('[data-testid="home-reference-workflow"]').should(
            'have.attr',
            'data-reference',
            'insurance'
        )
        cy.get('[data-testid="reference-link-insurance"]').should(
            'have.attr',
            'aria-pressed',
            'true'
        )
        cy.get('[data-testid="reference-link-healthcare"]').should(
            'have.attr',
            'aria-pressed',
            'false'
        )
        cy.location('search').should('include', 'ref=insurance')

        // The animated footage swaps to the selected reference's own GIF and
        // keeps playing (an <img> pointed at the looping GIF).
        cy.get('[data-testid="home-reference-workflow"]')
            .find('img[src$=".gif"]')
            .first()
            .should('have.attr', 'src')
            .and('include', 'openimis')
    })

    it('deep-links a vertical into the homepage via ?ref=', () => {
        cy.viewport(1280, 1800)
        cy.visit('/?ref=healthcare')

        cy.get('[data-testid="home-reference-workflow"]').should(
            'have.attr',
            'data-reference',
            'healthcare'
        )
        cy.get('[data-testid="reference-link-healthcare"]').should(
            'have.attr',
            'aria-pressed',
            'true'
        )
    })
})
