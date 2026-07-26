const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

// Lead data must never appear in a URL: not in the fetch target, not in a
// query string, and not through a native GET fallback if JavaScript fails
// mid-submit. Complemented by the browser-level check in
// cypress/e2e/lead-privacy.cy.js.

const LEAD_FORMS = [
    'components/WorkflowQualificationForm.js',
    'components/PartnerInquiryForm.js',
    'components/ContributorProgramForm.js',
]

test('lead forms submit through a POST body, never a URL', () => {
    for (const relativePath of LEAD_FORMS) {
        const source = read(relativePath)

        // The durable Netlify path is always a bare '/form.html' with the
        // encoded fields in the request body.
        assert.match(source, /fetch\('\/form\.html'/, relativePath)
        assert.match(source, /method: 'POST'/, relativePath)
        assert.match(
            source,
            /body: (data|formData)\.toString\(\)/,
            relativePath
        )

        // Never a query string on the submission target.
        assert.doesNotMatch(source, /form\.html\?/, relativePath)
        assert.doesNotMatch(source, /[?&]email=/, relativePath)

        // Never a client-side navigation that could carry lead fields.
        assert.doesNotMatch(
            source,
            /window\.location\s*=|location\.href\s*=|router\.push\(`[^`]*\$\{/,
            relativePath
        )

        // No action attribute: combined with an explicit POST method there
        // is no native fallback that serializes fields into a query string.
        assert.doesNotMatch(source, /<form[^>]*\baction=/s, relativePath)
    }

    // The two forms this change owns also declare method="POST" in markup so
    // even a JS-less native submit cannot GET lead fields into a URL.
    for (const relativePath of [
        'components/WorkflowQualificationForm.js',
        'components/PartnerInquiryForm.js',
    ]) {
        assert.match(read(relativePath), /method="POST"/, relativePath)
    }
})

test('qualification analytics events carry no lead fields', () => {
    const source = read('components/WorkflowQualificationForm.js')
    // Funnel events send routing metadata only; asserting the exact payloads
    // keeps emails, names, and workflow text out of analytics URLs.
    assert.match(
        source,
        /track\(EVENTS\.QUALIFICATION_FORM_START, \{ location: [^}]*\}\)/
    )
    assert.match(
        source,
        /track\(EVENTS\.QUALIFICATION_FORM_SUBMIT, \{\s*tier: qualification\.tier,\s*location: [^}]*\}\)/
    )
    assert.doesNotMatch(source, /track\([^)]*form\.email/s)
    assert.doesNotMatch(source, /track\([^)]*form\.name/s)
})

test('the qualification intake captures consent and lead segment durably', () => {
    const source = read('components/WorkflowQualificationForm.js')
    const definitions = read('public/form.html')

    // Required, privacy-policy-linked consent.
    assert.match(
        source,
        /name="privacyConsent"[\s\S]{0,200}required/,
        'consent checkbox is required'
    )
    assert.match(source, /href="\/privacy-policy"/)

    // Captured lead segment with the five audience values.
    for (const segment of [
        'enterprise_operator',
        'oem_vertical',
        'bpo_services',
        'developer',
        'community',
    ]) {
        assert.ok(
            source.includes(`value="${segment}"`),
            `lead segment option ${segment}`
        )
    }

    // Both fields are registered in the durable Netlify definition, or the
    // values would be silently dropped from submissions.
    const qualificationDefinition = definitions
        .split('name="workflow-qualification"')[1]
        .split('</form>')[0]
    assert.match(qualificationDefinition, /name="leadSegment"/)
    assert.match(qualificationDefinition, /name="privacyConsent"/)
})
