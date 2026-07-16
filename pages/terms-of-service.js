import React from 'react'
import Head from 'next/head'

import styles from '@styles/LegalPages.module.css'

const CONTACT_EMAIL = 'hello@openadapt.ai'

const TermsOfService = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Terms of Service | OpenAdapt.AI</title>
                <meta
                    name="description"
                    content="Terms for the OpenAdapt open-source software, managed browser subscription, billing, cancellation, refunds, usage limits, and data boundaries."
                />
                <link rel="canonical" href="https://openadapt.ai/terms-of-service" />
                <meta property="og:title" content="Terms of Service | OpenAdapt.AI" />
                <meta
                    property="og:description"
                    content="Terms for OpenAdapt software and the managed browser subscription."
                />
                <meta property="og:url" content="https://openadapt.ai/terms-of-service" />
            </Head>

            <h1 className={styles.heading}>Terms of Service</h1>
            <p className={styles.paragraph}>
                <strong>Effective July 16, 2026.</strong> These Terms of Service
                (&quot;Terms&quot;) govern the OpenAdapt hosted service and website
                provided by MLDSAI Inc. (&quot;OpenAdapt,&quot; &quot;we,&quot; or
                &quot;us&quot;). By starting a hosted subscription, accessing the
                hosted service, or using the website, you agree to these Terms and
                acknowledge our <a href="/privacy-policy">Privacy Policy</a>. If
                you use the service for an organization, you represent that you
                have authority to bind it.
            </p>

            <h2 className={styles.subheading}>1. Open Source and Hosted Service</h2>
            <p className={styles.paragraph}>
                The OpenAdapt engine is separate open-source software offered
                under its repository license. The paid hosted subscription covers
                managed browser execution for eligible, locally compiled and
                attested workflows, plus the associated control-plane, run history,
                structural reports, metering, and billing-management surfaces.
                It does not include Windows, RDP, Citrix, a regulated deployment,
                professional services, an SLA, or a compliance certification unless
                a signed order expressly says otherwise.
            </p>
            <p className={styles.paragraph}>
                OpenAdapt compiles demonstrated GUI workflows into deterministic,
                locally executable programs. Healthy runs make no model calls.
                Interfaces and applications can still change, and a workflow can
                halt, fail verification, or require a governed repair. Runnable
                does not mean certified for every environment or business process.
            </p>

            <h2 className={styles.subheading}>2. Accounts and Authorized Use</h2>
            <p className={styles.paragraph}>
                You must provide accurate account and billing information, keep
                credentials and ingest tokens secure, and promptly report suspected
                compromise. You may automate only systems, accounts, and data that
                you are authorized to access and process. You are responsible for
                reviewing workflow behavior, configuring identity and effect checks,
                maintaining required human approval, and determining whether a
                workflow is suitable for its intended use.
            </p>
            <ul className={styles.list}>
                <li>Do not bypass identity, effect, policy, egress, or run-gate refusals.</li>
                <li>Do not use the service to violate law or another person&apos;s rights.</li>
                <li>Do not probe, disrupt, overload, or gain unauthorized access to the service.</li>
                <li>Do not resell or share a hosted entitlement except under a written agreement.</li>
            </ul>

            <h2 className={styles.subheading}>3. Subscription, Renewal, and Usage</h2>
            <p className={styles.paragraph}>
                Stripe Checkout shows the configured price, currency, and billing
                period before you subscribe. Your subscription renews automatically
                for that billing period until canceled. You authorize Stripe and
                OpenAdapt to charge the payment method on file at each renewal,
                including applicable taxes shown at Checkout. Failed or reversed
                payment can suspend hosted execution until the subscription returns
                to an active state.
            </p>
            <p className={styles.paragraph}>
                The current offer page states the included monthly workflow-run
                allowance. The control plane refuses new runs when the configured
                allowance is exhausted; it does not automatically charge an overage.
                Unused runs do not roll over. A run is metered once at its terminal
                transition, including a verified halt or failure after execution has
                started. An abandoned reservation that was never claimed for
                execution is returned to the allowance.
            </p>

            <h2 className={styles.subheading}>4. Cancellation and Refunds</h2>
            <p className={styles.paragraph}>
                An organization owner or administrator can manage or cancel the
                subscription through the authenticated Cloud billing portal. You
                may also request cancellation by emailing{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the
                account email. Cancel before the next renewal date to avoid the
                next charge. Unless Stripe presents a different effective date,
                cancellation takes effect at the end of the current paid billing
                period and hosted access continues until then.
            </p>
            <p className={styles.paragraph}>
                Except where applicable law requires otherwise or a signed order
                expressly provides otherwise, charges already paid are
                non-refundable and we do not issue credits for partial billing
                periods or unused run allowance. Contact us promptly about a
                duplicate, unauthorized, or incorrect charge. This policy does not
                limit rights that cannot legally be waived.
            </p>

            <h2 className={styles.subheading}>5. Artifact and Runtime Data Boundaries</h2>
            <p className={styles.paragraph}>
                Compilation does not make a recording or bundle de-identified or
                PHI-free. The managed upload path accepts only the exact sanitized
                derivative admitted by destination policy and bound to its reviewed
                manifest and cryptographic hash. The original remains sensitive
                inside your trusted boundary. Unknown, unresolved, modified, or
                wrong-destination content is refused. Approval of a derivative does
                not make the original safe and is not an independent certification.
            </p>
            <p className={styles.paragraph}>
                A live application can reintroduce PII, PHI, credentials, or other
                sensitive data after authoring artifacts were sanitized. Do not run
                a workflow whose managed runtime necessarily exposes PHI or other
                restricted data unless a separately qualified, customer-controlled
                execution boundary and any required written agreement are in place.
                The self-serve hosted subscription does not include a BAA. See the{' '}
                <a href="/security">Security and Data Boundary</a> page for the
                current technical controls and limitations.
            </p>

            <h2 className={styles.subheading}>6. Customer Content and Privacy</h2>
            <p className={styles.paragraph}>
                You retain your rights in workflow artifacts and other content you
                provide. You grant us the limited right to host, process, transmit,
                and display that content only as needed to provide, secure, support,
                and operate the service. You are responsible for having a lawful
                basis and all necessary notices and permissions for data you process.
                Our collection and handling of account, billing, usage, support, and
                service data are described in the Privacy Policy.
            </p>

            <h2 className={styles.subheading}>7. Beta Status and Service Changes</h2>
            <p className={styles.paragraph}>
                Managed browser execution is a Beta launch service. We may change
                features, impose reasonable safety limits, or suspend a workflow to
                address security, legal, payment, abuse, or reliability risks. We
                will not silently replace a missing production dependency with a
                simulated successful run. Unless a signed order says otherwise,
                no uptime, response-time, support, retention, recovery, or service
                credit commitment applies.
            </p>

            <h2 className={styles.subheading}>8. Intellectual Property</h2>
            <p className={styles.paragraph}>
                Open-source components remain governed by their licenses. These
                Terms do not transfer OpenAdapt trademarks, service marks, hosted
                service software, or other proprietary rights. Feedback may be used
                without restriction or payment, but we will not treat feedback as a
                grant of rights to your confidential workflow content.
            </p>

            <h2 className={styles.subheading}>9. Disclaimers and Liability</h2>
            <p className={styles.paragraph}>
                To the maximum extent permitted by law, the hosted service and
                website are provided &quot;as is&quot; and &quot;as available,&quot;
                without warranties of merchantability, fitness for a particular
                purpose, non-infringement, uninterrupted operation, or error-free
                automation. You remain responsible for consequential actions and
                for independent verification appropriate to their risk.
            </p>
            <p className={styles.paragraph}>
                To the maximum extent permitted by law, OpenAdapt and MLDSAI Inc.
                will not be liable for indirect, incidental, special, consequential,
                exemplary, or punitive damages, or for loss of profits, revenue,
                goodwill, data, or business interruption. Our aggregate liability
                arising from the hosted service will not exceed the amount you paid
                for that service during the three months before the event giving
                rise to the claim. These limitations do not apply where prohibited
                by law.
            </p>

            <h2 className={styles.subheading}>10. Termination</h2>
            <p className={styles.paragraph}>
                You may stop using the service and cancel as described above. We may
                suspend or terminate access for material breach, nonpayment,
                unlawful use, security risk, or conduct that threatens the service
                or other users. Where reasonably possible, we will give notice and
                an opportunity to cure. Sections that by their nature should survive
                termination, including payment, intellectual-property, disclaimer,
                and liability terms, will survive.
            </p>

            <h2 className={styles.subheading}>11. Changes and Governing Law</h2>
            <p className={styles.paragraph}>
                We may update these Terms as the service changes. We will post the
                revised date and provide any notice required by law. Material changes
                apply prospectively. These Terms are governed by the laws of Ontario,
                Canada, without regard to conflict-of-law principles, and disputes
                will be brought in courts located in Ontario unless applicable law
                requires another forum.
            </p>

            <h2 className={styles.subheading}>12. Contact</h2>
            <p className={styles.paragraph}>
                Questions about these Terms, billing, cancellation, or refunds may
                be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
        </div>
    )
}

export default TermsOfService
