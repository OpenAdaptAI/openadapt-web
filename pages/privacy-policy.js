import React from 'react'
import Head from 'next/head'
import styles from '@styles/LegalPages.module.css'

const CONTACT_EMAIL = 'hello@openadapt.ai'

const PrivacyPolicy = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Draft Privacy Notice | OpenAdapt.AI</title>
                <meta
                    name="description"
                    content="Draft, non-operative privacy notice and factual technical data-flow inventory for OpenAdapt local artifacts, optional hosted paths, providers, and runtime boundaries."
                />
                <link rel="canonical" href="https://openadapt.ai/privacy-policy" />
                <meta property="og:title" content="Draft Privacy Notice | OpenAdapt.AI" />
                <meta property="og:description" content="Non-operative draft notice and technical inventory for OpenAdapt local artifacts, optional hosted services, providers, retention, and runtime boundaries." />
                <meta property="og:url" content="https://openadapt.ai/privacy-policy" />
            </Head>
            <h1 className={styles.heading}>Draft Privacy Notice</h1>
            <p className={styles.paragraph}>
                <strong>DRAFT — NOT OPERATIVE FOR PAID PRODUCTION.</strong> This
                page is a factual technical data-flow inventory for launch review;
                it is not an approved production privacy policy, consent instrument,
                legal opinion, or compliance certification. MLDSAI Inc. must obtain
                qualified privacy-counsel approval, designate an accountable privacy
                official, and publish an operative notice with an effective date
                before enabling paid production checkout.
            </p>
            <p className={styles.paragraph}>
                <strong>Technical inventory reviewed July 16, 2026.</strong> MLDSAI Inc.
                (&quot;OpenAdapt,&quot; &quot;we,&quot; or &quot;us&quot;)
                operates the OpenAdapt website and optional hosted service. Contact{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with
                privacy questions. The open-source engine is separate software
                operated by the person or organization that installs it.
            </p>

            <h2 className={styles.subheading}>1. Local Engine and Artifacts</h2>
            <p className={styles.paragraph}>
                The open-source engine records screenshots and GUI input on the
                operator&apos;s machine to compile and replay a workflow. Local
                recordings, compiled bundles, machine reports, screenshots,
                identity evidence, parameters, and checkpoints can contain
                personal information, credentials, or PHI. Compilation does not
                de-identify them. Installing or running the engine does not by
                itself create an OpenAdapt account or send those artifacts to the
                hosted service.
            </p>
            <p className={styles.paragraph}>
                The optional sanitation command creates a transformed copy; it
                does not mutate or make the source safe. Supported text and still
                images are inventoried, transformed, rescanned, reviewed under the
                selected policy, and approved by exact archive hash. Unsupported,
                unresolved, changed, or unknown content is refused. The original
                remains inside the operator&apos;s boundary. The separate{' '}
                <code>report-break</code> path sends a minimized diagnostic without
                screenshots, typed values, intents, reasons, errors, or report text.
            </p>

            <h2 className={styles.subheading}>2. Optional Hosted Service</h2>
            <p className={styles.paragraph}>
                The hosted service can collect account and organization records,
                authentication identifiers, contact and support messages, billing
                references, subscription state, workflow configuration, approved
                artifact archives and manifests, run status, usage, reports, logs,
                and audit records. The explicit artifact-ingest path accepts an
                approved sanitized derivative, not the sensitive local source, and
                checks the exact submitted bytes and destination policy.
            </p>
            <p className={styles.paragraph}>
                Managed browser recording is separate from sanitized artifact
                ingest. When a user starts a managed recording session, browser
                frames and input events are captured inside the hosted authoring
                boundary, and the resulting raw recording can be stored in private
                service storage for compilation. It is not sanitized merely by
                capture or compilation. Managed execution can also observe live
                application data and produce reports after a design-time artifact
                was sanitized. Workflows that necessarily expose PHI or other
                restricted runtime data require a separately qualified,
                customer-controlled boundary.
            </p>

            <h2 className={styles.subheading}>
                3. Model Calls and Governed Execution
            </h2>
            <p className={styles.paragraph}>
                Healthy deterministic replay makes no model calls. Model-assisted
                repair is optional and off by default. If an operator explicitly
                enables a local or remote model endpoint, relevant target crops,
                screenshots, identity evidence, intents, OCR, or expected state can
                be sent to that configured endpoint. A remote model provider then
                receives data under its own terms and the operator&apos;s selected
                boundary. Model output is a proposal; it does not bypass identity,
                risk, postcondition, effect, or policy checks.
            </p>

            <h2 className={styles.subheading}>4. Current Service Providers</h2>
            <p className={styles.paragraph}>
                Current product paths use Netlify for website hosting and forms;
                Supabase for hosted authentication, database, and private object
                storage; Modal for managed browser recording and run compute, plus
                optional hosted compilation only when explicitly enabled; Stripe
                for Checkout, billing, and subscription state;
                PostHog for launch-funnel analytics when configured; Cal.com for
                booking; and GitHub for source links, repository widgets, and
                public repository data. These providers can receive network and
                service data needed for the selected interaction and process it
                under their own terms and privacy policies, potentially outside
                the visitor&apos;s province or country depending on provider and
                project configuration. A customer-controlled deployment can use a
                different approved provider set documented in its scope.
            </p>

            <h2 className={styles.subheading}>5. Website Forms, Booking, and Analytics</h2>
            <p className={styles.paragraph}>
                Contact and update forms can collect a name, email address, company,
                role, workflow description, and message through Netlify. We use
                those submissions for the requested communication, workflow
                qualification, support, and product updates. Opening the booking
                flow loads Cal.com; name and email are passed as booking prefill
                only when the visitor supplied them. Stripe receives payment and
                billing details when a visitor enters enabled Checkout.
            </p>
            <p className={styles.paragraph}>
                If a PostHog key is configured, the site sends page views and named
                launch-funnel clicks. The current code disables autocapture,
                persistent browser storage, and session recording and does not send
                form contents, emails, or free text to PostHog. Without a PostHog
                key, that analytics path is a no-op. Analytics data is
                marketing-site data, not workflow runtime data.
            </p>

            <h2 className={styles.subheading}>6. Retention and Deletion Boundaries</h2>
            <p className={styles.paragraph}>
                Local artifact retention is controlled by the operator; the engine
                does not automatically delete raw recordings, bundles, machine
                reports, or checkpoints. The hosted service persists account and
                organization data, managed recordings, approved artifacts, bundles,
                reports, run and usage records, and billing references in its
                configured stores. Short-lived signed runner URLs limit object
                access but do not delete the stored objects. The self-serve service
                currently publishes no fixed retention, backup-deletion, or
                recovery period. Do not send data that requires a specific schedule
                until that schedule and deletion process are documented in a
                qualified written deployment scope. Providers can retain billing,
                security, or service records under their own obligations.
            </p>

            <h2 className={styles.subheading}>7. Security Boundaries</h2>
            <p className={styles.paragraph}>
                Declared browser password and secret fields are injected at replay
                rather than written into recording events or bundles. Other typed
                values, screenshots, identity evidence, bundles, and reports remain
                sensitive and need appropriate access, encryption, retention,
                endpoint, backup, and deletion controls. Runtime observations can
                reintroduce sensitive data after sanitation. No transmission or
                storage method is completely secure. Review the current{' '}
                <a href="/security">security and data-boundary page</a> before
                evaluating consequential or regulated work.
            </p>

            <h2 className={styles.subheading}>8. Children&apos;s Privacy</h2>
            <p className={styles.paragraph}>
                Our products and services are not intended for use by children
                under the age of 13. We do not knowingly collect personal
                information from children.
            </p>

            <h2 className={styles.subheading}>9. Changes and Contact</h2>
            <p className={styles.paragraph}>
                We may update this draft inventory as product paths, providers, or
                legal requirements change. If counsel approves an operative privacy
                notice, we will publish its effective date and provide any notice
                required by applicable law. Questions or
                requests concerning personal information can be sent to the
                current privacy contact at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Before
                paid production checkout is activated, MLDSAI Inc. must designate
                an accountable privacy official and have qualified privacy counsel
                approve the access, correction, complaint, retention, deletion,
                consent, and cross-border processing procedures reflected here.
            </p>
        </div>
    )
}

export default PrivacyPolicy
