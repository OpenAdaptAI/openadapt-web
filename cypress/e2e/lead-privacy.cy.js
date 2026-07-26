// Lead data must never appear in a URL. This drives the real qualification
// form end to end with a stubbed Netlify endpoint and asserts the lead
// fields travel only in the POST body while the page URL stays clean.

const LEAD = {
    name: 'Privacy Probe',
    email: 'privacy-probe@example.com',
    company: 'Probe Ops LLC',
    role: 'Operations Lead',
    application: 'Legacy Billing Console',
    operators: '4 billing specialists',
    workflow:
        'Read a structured eligibility response, enter approved fields into the legacy application, reopen the record, and confirm the persisted values.',
}

const SELECTS = {
    environment: 'browser',
    dataSensitivity: 'ordinary',
    leadSegment: 'enterprise_operator',
    monthlyVolume: '1000_4999',
    manualTime: '5_15',
    errorConsequence: 'financial',
    inputStructure: 'mostly_structured',
    stability: 'stable_quarter',
    writeApi: 'unavailable',
    verifier: 'independent_interface',
    testEnvironment: 'possible',
    reusePotential: 'one_site',
    buyerAuthority: 'champion',
    timeline: '30_60',
    budget: 'under_15000',
}

describe('lead privacy', () => {
    it('submits qualification leads in a POST body and never in a URL', () => {
        cy.intercept('POST', '/form.html', {
            statusCode: 200,
            body: '',
        }).as('leadSubmit')

        cy.visit('/qualify')

        cy.get('form[name="workflow-qualification"]').within(() => {
            for (const [field, value] of Object.entries(LEAD)) {
                cy.get(`[name="${field}"]`).type(value, { delay: 0 })
            }
            for (const [field, value] of Object.entries(SELECTS)) {
                cy.get(`select[name="${field}"]`).select(value)
            }
            cy.get('input[name="privacyConsent"]').check()
            cy.get('button[type="submit"]').click()
        })

        cy.wait('@leadSubmit').then(({ request }) => {
            // The submission target carries no query string.
            const requestUrl = new URL(request.url)
            expect(requestUrl.pathname).to.equal('/form.html')
            expect(requestUrl.search).to.equal('')

            // The lead fields travel in the encoded body, including the new
            // consent and segment captures.
            const body = new URLSearchParams(request.body)
            expect(body.get('form-name')).to.equal('workflow-qualification')
            expect(body.get('email')).to.equal(LEAD.email)
            expect(body.get('leadSegment')).to.equal('enterprise_operator')
            expect(body.get('privacyConsent')).to.equal('yes')
            expect(body.get('qualificationTier')).to.be.oneOf([
                'priority',
                'review',
                'community',
            ])
        })

        // The form reached its submitted state without the browser URL
        // picking up any lead value.
        cy.contains('Submission received').should('be.visible')
        cy.url().should((url) => {
            expect(url.endsWith('/qualify')).to.equal(true)
            for (const value of [
                LEAD.email,
                encodeURIComponent(LEAD.email),
                LEAD.name,
                encodeURIComponent(LEAD.name),
            ]) {
                expect(url).to.not.include(value)
            }
        })
    })

    it('requires the privacy consent checkbox before submitting', () => {
        cy.visit('/qualify')
        cy.get('input[name="privacyConsent"]')
            .should('have.attr', 'required')
        cy.get('input[name="privacyConsent"]').should('not.be.checked')
        cy.get('form[name="workflow-qualification"]')
            .contains('a', 'Privacy Notice')
            .should('have.attr', 'href', '/privacy-policy')
    })
})
