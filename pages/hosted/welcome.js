import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

/*
 * Post-payment landing for OpenAdapt Hosted (Phase 0, concierge).
 *
 * Reached from Stripe Checkout success_url with ?session_id=... . We do not
 * unlock a self-serve runner here: we confirm the subscription and set the
 * expectation that a human reaches out to onboard the first workflow.
 */

export default function HostedWelcome() {
    // When the cloud app is deployed, offer a direct link into it. The cloud
    // app links the subscription to a cloud org by email at first login, so
    // this drops the customer into their dashboard. Unset (cloud app not live
    // yet) keeps the concierge-only flow below.
    const cloudAppUrl = process.env.NEXT_PUBLIC_CLOUD_APP_URL || ''

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>You&apos;re in | OpenAdapt Hosted</title>
                <meta name="robots" content="noindex" />
                <meta
                    name="description"
                    content="Thanks for subscribing to OpenAdapt Hosted. We onboard you personally and will reach out within one business day."
                />
            </Head>

            <div className="mx-auto flex max-w-2xl flex-col px-5 py-16 md:py-24">
                <p className="eyebrow">OpenAdapt Hosted</p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    You&apos;re in.
                </h1>
                <p className="mt-4 text-base leading-relaxed text-ink-2">
                    Thanks for subscribing. We&apos;ll reach out within one
                    business day to set up your first workflow. We onboard you
                    personally, so there&apos;s nothing for you to set up.
                </p>

                <div className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                        What happens next
                    </h2>
                    <ol className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">1.</span>
                            <span>
                                A real person from our team emails you within
                                one business day.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">2.</span>
                            <span>
                                We pick one high-value, repetitive workflow and
                                you demonstrate it once.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-mono text-accent">3.</span>
                            <span>
                                We compile it, run it with checks, and get it
                                live for you. No infrastructure for you to run.
                            </span>
                        </li>
                    </ol>
                    {cloudAppUrl && (
                        <div className="mt-6">
                            <a
                                href={cloudAppUrl}
                                className="btn-ink w-full text-center"
                            >
                                Go to your dashboard
                            </a>
                            <p className="mt-2 text-center text-xs leading-relaxed text-ink-3">
                                Sign in with the email you used at checkout and
                                your subscription is already linked.
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
                        Prefer to wait for our email? That works too. Working
                        with PHI or PII?{' '}
                        <Link
                            href="/#pricing-enterprise"
                            className="text-accent underline"
                        >
                            Enterprise
                        </Link>{' '}
                        runs OpenAdapt inside your own environment, so regulated
                        data never enters our infrastructure.
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
