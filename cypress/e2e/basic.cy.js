const BOOKING_URL =
    'https://cal.com/richard-abrich/30min?overlayCalendar=true'

function assertCanonicalBooking() {
    cy.get('iframe[title="Book a call with OpenAdapt"]')
        .should('have.attr', 'src')
        .and('equal', BOOKING_URL)
    cy.get('iframe[src*="calendly.com"]').should('not.exist')
}

describe('canonical booking destination', () => {
    it('uses Cal.com on the dedicated booking page', () => {
        cy.visit('/book')
        assertCanonicalBooking()
    })

    it('uses Cal.com after continuing through the homepage form', () => {
        cy.visit('/')
        cy.contains('button', 'Skip form and book now')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true })
        assertCanonicalBooking()
    })
})
