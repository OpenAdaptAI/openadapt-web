import React from 'react'
import Head from 'next/head'
import styles from '@styles/LegalPages.module.css'

const PrivacyPolicy = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Privacy Policy | OpenAdapt.AI</title>
                <meta
                    name="description"
                    content="OpenAdapt.AI privacy policy and data boundaries for local artifacts, sanitized upload derivatives, hosted execution, optional model endpoints, and regulated runtimes."
                />
                <link rel="canonical" href="https://openadapt.ai/privacy-policy" />
                <meta property="og:title" content="Privacy Policy | OpenAdapt.AI" />
                <meta property="og:description" content="OpenAdapt.AI privacy policy. Learn how we collect, use, and safeguard your data." />
                <meta property="og:url" content="https://openadapt.ai/privacy-policy" />
            </Head>
            <h1 className={styles.heading}>Privacy Policy</h1>
            <p className={styles.paragraph}>
                At OpenAdapt.AI, we are committed to protecting your privacy and
                ensuring the security of your personal data. This Privacy Policy
                outlines how we collect, use, and safeguard the information you
                provide when using our products and services, including through
                our website hosted on Netlify.
            </p>

            <h2 className={styles.subheading}>1. Data Collection and Usage</h2>
            <p className={styles.paragraph}>
                The open-source engine records screenshots and GUI input locally
                to compile and replay a workflow. Recordings, compiled bundles,
                and machine-readable reports can contain Personally Identifiable
                Information (PII) or Protected Health Information (PHI). A
                compiled bundle is not de-identified or PHI-free by construction.
                These artifacts stay local by default. A hosted upload is made
                from a sanitized derivative, never by assuming compilation
                removed sensitive data. The sanitation process inventories and
                transforms supported content, rescans it, records unresolved
                findings and tool versions in a manifest, and binds approval to
                the derivative&apos;s cryptographic hash. Policy can require local
                review before upload. Unknown or unsuccessfully transformed
                content is refused rather than copied through. The separate{' '}
                <code>report-break</code> path sends only a minimized break
                descriptor. We may also collect hosted account, billing, usage,
                support, website-form, and analytics data needed to provide the
                service.
            </p>

            <h2 className={styles.subheading}>2. Third-Party Services</h2>
            <p className={styles.paragraph}>
                The engine can connect to an explicitly configured local or
                remote model endpoint for optional repair assistance. Relevant
                screenshots or crops may cross the boundary of a remote endpoint;
                healthy replay does not call a model. Hosted control-plane and
                runner infrastructure, website forms, hosting, analytics,
                Stripe payment processing, and any model endpoint are
                separate third-party services governed by their own terms and
                privacy policies.
            </p>

            <h2 className={styles.subheading}>3. Email Address Collection</h2>
            <p className={styles.paragraph}>
                For updates, support, and user registration, we collect email
                addresses via our website. This collection is facilitated
                through Netlify forms, which are used solely for the purpose of
                communication and service enhancement. We do not share your
                email with third parties without your consent, except as
                required for providing the services you've requested or for
                legal compliance. Users who wish to opt-out of future
                communications can do so at any time by using the unsubscribe
                link included in our emails or by contacting us directly.
            </p>

            <h2 className={styles.subheading}>4. Data Security</h2>
            <p className={styles.paragraph}>
                Declared password and secret fields are injected at replay rather
                than written into recordings. Other captured values, screenshots,
                identity evidence, bundles, and reports remain sensitive local
                artifacts and require appropriate filesystem access, encryption,
                retention, endpoint, and deletion controls. The local original
                remains sensitive and is never made safe by creation of a
                derivative. Runtime observations can reintroduce sensitive data
                after a recording was sanitized; PHI-bearing screenshots and
                logs must remain within the declared trusted execution boundary.
                No method of transmission or storage is completely secure. See
                the current{' '}
                <a href="/security">security and data-boundary page</a> before
                evaluating regulated data.
            </p>

            <h2 className={styles.subheading}>5. Children's Privacy</h2>
            <p className={styles.paragraph}>
                Our products and services are not intended for use by children
                under the age of 13. We do not knowingly collect personal
                information from children.
            </p>

            <h2 className={styles.subheading}>
                6. Changes to this Privacy Policy
            </h2>
            <p className={styles.paragraph}>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. The updated
                version will be posted on our website, and we encourage you to
                review it periodically.
            </p>
        </div>
    )
}

export default PrivacyPolicy
