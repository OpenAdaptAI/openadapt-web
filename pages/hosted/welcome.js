import Head from 'next/head'
import Link from 'next/link'

import DashboardShowcase from '@components/DashboardShowcase'
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
                    Sign in to OpenAdapt Cloud to connect your subscription and
                    start onboarding the first approved browser workflow.
                </p>

                <div className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                        What happens next
                    </h2>
                    <ol className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">1.</span>
                            <span>
                                Sign in with the email used at checkout. OpenAdapt
                                verifies the subscription and connects it to your
                                organization.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">2.</span>
                            <span>
                                Record one repeated browser workflow and review the
                                captured demonstration before it is compiled.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">3.</span>
                            <span>
                                Review the compiled workflow, parameters, target
                                evidence, policy, and expected business effect.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">4.</span>
                            <span>
                                Run under supervision, inspect the structural
                                report, and approve the workflow for repeated use.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">5.</span>
                            <span>
                                Monitor usage, outcomes, and governed workflow
                                updates from the Cloud dashboard.
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
                        Managed subscriptions are for approved browser workflows.
                        Workflows involving PHI, private systems, Windows, macOS,
                        RDP, or Citrix use a separately scoped customer-controlled
                        deployment. Working with regulated data?{' '}
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
            <DashboardShowcase />
            <Footer />
        </div>
    )
}
