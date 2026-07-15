import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

/*
 * Human-assisted Hosted support page. Successful Checkout does not land here;
 * it returns to cloud /login with an opaque checkout_session_id that the cloud
 * verifies server-side after authentication.
 */

export default function HostedWelcome() {
    // When the cloud app is deployed, offer a direct link into it. The cloud
    // app verifies and links the subscription after authenticated login. An
    // unset value keeps the support/onboarding fallback usable without
    // inventing a cloud destination.
    const cloudAppUrl = process.env.NEXT_PUBLIC_CLOUD_APP_URL || ''

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Hosted onboarding | OpenAdapt</title>
                <meta name="robots" content="noindex" />
                <meta
                    name="description"
                    content="Continue OpenAdapt Hosted onboarding or contact the team for account help."
                />
            </Head>

            <div className="mx-auto flex max-w-2xl flex-col px-5 py-16 md:py-24">
                <p className="eyebrow">OpenAdapt Hosted</p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Continue hosted onboarding
                </h1>
                <p className="mt-4 text-base leading-relaxed text-ink-2">
                    Successful checkout returns directly to secure cloud login,
                    where the subscription is verified after authentication.
                    Reaching this support page alone does not prove payment or
                    create an entitlement.
                </p>

                <div className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                        What happens next
                    </h2>
                    <ol className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">1.</span>
                            <span>
                                Return to the cloud login using the checkout
                                redirect and authenticate with the checkout email.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">2.</span>
                            <span>
                                The cloud verifies the opaque Checkout Session
                                with Stripe and binds it to your organization.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">3.</span>
                            <span>
                                Record one repeated browser workflow, then
                                sanitize, review, approve, and push its exact
                                recording derivative.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">4.</span>
                            <span>
                                Compile, strict-lint, certify, and successfully
                                replay locally. Sanitize, review, and approve the
                                bundle; bind it to a one-time challenge with{' '}
                                <code>validate-hosted</code>, then push that exact
                                attested bundle.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">5.</span>
                            <span>
                                Confirm the attested target and parameter schema,
                                select a vault secret reference, supply non-secret
                                values for the run, then inspect the structural
                                report.
                            </span>
                        </li>
                    </ol>
                    {cloudAppUrl && (
                        <div className="mt-6">
                            <a
                                href={`${cloudAppUrl}/login`}
                                className="btn-ink w-full text-center"
                            >
                                Go to hosted login
                            </a>
                            <p className="mt-2 text-center text-xs leading-relaxed text-ink-3">
                                Use the Checkout redirect for automatic claim;
                                this plain login link does not carry proof of payment.
                            </p>
                        </div>
                    )}
                    <div className="mt-6">
                        <Link
                            href="/#book"
                            className={
                                cloudAppUrl
                                    ? 'btn-ghost-ink w-full text-center'
                                    : 'btn-ink w-full text-center'
                            }
                        >
                            Book your onboarding call
                        </Link>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-ink-3">
                        Compilation does not remove PHI. Upload the sanitized
                        derivative whose manifest and hash you reviewed, not the
                        raw recording. Unknown or unresolved content is refused.
                        Recording push registers source provenance; it does not
                        create a runnable workflow. If sanitation changed an
                        execution-bearing value, hosted ingest returns{' '}
                        <code>needs_parameterization</code>. The challenge-bound
                        envelope binds exact artifact/provenance/report hashes,
                        strict lint, policy, derived risk class, and successful
                        replay. It is operator self-attestation, not independent
                        certification. Cloud also applies exact policy and
                        risk-class and deployed compiler-version allowlists and
                        consumes the challenge once.
                        Runtime screens can contain live PHI even when the
                        authoring artifact was sanitized, so regulated execution
                        stays inside its declared trusted boundary. Working with
                        PHI or PII?{' '}
                        <Link
                            href="/#pricing-enterprise"
                            className="text-accent underline"
                        >
                            Enterprise
                        </Link>{' '}
                        uses a customer-controlled execution environment for
                        PHI-bearing runtime data.
                    </p>
                </div>

                <div className="mt-8">
                    <Link href="/" className="btn-ghost-ink">
                        Back to home
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    )
}
