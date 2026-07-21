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
                    content="Terms governing the OpenAdapt managed-browser service, subscriptions, authorized use, data boundaries, and service limitations."
                />
                <link rel="canonical" href="https://openadapt.ai/terms-of-service" />
                <meta property="og:title" content="Terms of Service | OpenAdapt.AI" />
                <meta
                    property="og:description"
                    content="Terms governing the OpenAdapt managed-browser service and subscription."
                />
                <meta property="og:url" content="https://openadapt.ai/terms-of-service" />
            </Head>

            <h1 className={styles.heading}>Terms of Service</h1>
            <p className={styles.paragraph}>
                <strong>Effective July 17, 2026.</strong> These Terms govern the
                OpenAdapt hosted service and related website interactions provided
                by MLDSAI Inc. (&quot;OpenAdapt,&quot; &quot;we,&quot; or
                &quot;us&quot;).
            </p>
            <p className={styles.paragraph}>
                Starting a hosted subscription or accessing the paid hosted service
                constitutes acceptance of these Terms and acknowledgement of the
                Privacy Notice. The MIT-licensed engine remains governed by its
                open-source license.
            </p>

            <h2 className={styles.subheading}>1. Open Source and Hosted Service</h2>
            <p className={styles.paragraph}>
                The OpenAdapt engine is separate MIT-licensed software. It records,
                compiles, and runs browser workflows on an operator&apos;s machine by
                default; installing the engine does not create an account or upload
                an artifact. The optional hosted service provides a control plane,
                managed browser execution, run history, structural reports, usage,
                and billing-management surfaces for workflows admitted under the
                hosted policy.
            </p>
            <p className={styles.paragraph}>
                The hosted subscription includes managed execution for approved
                browser workflows. Workflows that require Windows UIA, native
                macOS, RDP, Citrix, private-network access, or a regulated runtime
                boundary must be covered by a separately scoped,
                customer-controlled deployment order. Professional services, service
                levels, a BAA, and compliance commitments apply only when they are
                expressly included in a signed order. That order defines the
                supported workflow, execution boundary, operating responsibilities,
                and applicable assurance commitments.
            </p>
            <p className={styles.paragraph}>
                OpenAdapt compiles demonstrated GUI workflows into deterministic,
                locally executable programs. Healthy deterministic replay makes no
                model calls. Interfaces and applications can still change, and a
                workflow can halt, fail verification, or require a governed repair.
                A policy-certified bundle has passed the selected OpenAdapt policy;
                that is not independent certification of an environment, business
                process, security program, or legal compliance.
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
                period before you subscribe. Your
                subscription renews automatically for that billing period until
                canceled. You authorize Stripe and OpenAdapt to charge the payment
                method on file at each renewal, including applicable taxes shown at
                Checkout. Failed or reversed payment can suspend hosted execution
                until the subscription returns to an active state.
            </p>
            <p className={styles.paragraph}>
                The offer page states the included monthly workflow-run allowance.
                Under the launch contract,
                a claimed execution consumes one run whether it completes, halts,
                or fails; a reservation never claimed for execution does not. The
                offer has no automatic overage charge and unused runs do not roll
                over. The verified Stripe offer and these Terms control the
                subscription.
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
                PHI/PII-free. The explicit artifact-ingest path accepts only the exact
                approved sanitized derivative admitted by destination policy and
                bound to its reviewed manifest and cryptographic hash. The original
                remains sensitive inside your trusted boundary. Unknown,
                unresolved, modified, or wrong-destination content is refused.
                Approval of a derivative does not make the original safe and is not
                independent proof of de-identification.
            </p>
            <p className={styles.paragraph}>
                Managed browser recording is a different path. It captures browser
                frames and input events inside the hosted authoring boundary and can
                persist the resulting raw recording in private service storage for
                compilation. A managed recording is not sanitized merely because it
                was captured or compiled by the service. Do not use managed
                recording for content that is outside the declared hosted boundary.
            </p>
            <p className={styles.paragraph}>
                A live application can reintroduce PII, PHI, credentials, or other
                sensitive data after authoring artifacts were sanitized. Do not run
                a workflow whose managed runtime necessarily exposes PHI/PII or other
                restricted data in the self-serve hosted service. Use a
                customer-controlled execution boundary governed by a signed order
                and any required data-processing agreement. A BAA applies only when
                expressly included in that signed order. See the{' '}
                <a href="/security">Security and Data Boundary</a> page for the
                current technical controls and limitations.
            </p>

            <h2 className={styles.subheading}>6. Customer Content, Retention, and Privacy</h2>
            <p className={styles.paragraph}>
                You retain your rights in workflow artifacts and other content you
                provide. You grant us the limited right to host, process, transmit,
                and display that content only as needed to provide, secure, support,
                and operate the service. You are responsible for having a lawful
                basis and all necessary notices and permissions for data you process.
                Our collection and handling of account, billing, usage, support, and
                service data are described in the Privacy Notice.
            </p>
            <p className={styles.paragraph}>
                Local recordings, bundles, reports, and checkpoints remain under
                the operator&apos;s retention and deletion controls. The hosted
                service persists account and organization records, managed
                recordings, approved artifacts, bundles, reports, run and usage
                records, and billing references as needed to operate the configured
                service. A short-lived signed runner URL limits object access; it
                does not itself delete the stored object. The self-serve service
                currently makes no fixed retention, backup-deletion, or recovery
                commitment. Workflows with mandatory schedules require a written,
                qualified deployment scope before their data is sent.
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
            <p className={styles.paragraph}>
                The service uses providers for website and form hosting,
                authentication, database and object storage, managed compute,
                payment processing, optional analytics, source-code widgets, and
                booking.
                The Privacy Notice names the current providers and explains the
                related data flows. Provider availability and provider terms can
                affect those parts of the service.
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
                We may update these Terms as the service or legal requirements
                change. We will publish the effective date and provide any notice
                required by applicable law. The governing law is Ontario, Canada,
                without regard to conflict-of-law principles, with disputes brought
                in Ontario courts unless applicable law requires another forum.
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
