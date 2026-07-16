import { useState } from 'react'
import Link from 'next/link'

const { monthlyRunCapLabel } = require('../lib/hostedOfferContract')

/*
 * Three delivery paths. The hosted amount is retrieved from Stripe at build
 * time rather than duplicated in site code; Checkout confirms the same
 * configured product and price before payment.
 */

const GITHUB_URL = 'https://github.com/OpenAdaptAI/openadapt-flow'

function Check() {
    return (
        <span
            aria-hidden="true"
            className="mt-[2px] flex-shrink-0 font-mono text-accent"
        >
            ✓
        </span>
    )
}

function FeatureList({ items }) {
    return (
        <ul className="mt-5 flex flex-col gap-2.5 text-sm leading-relaxed text-ink-2">
            {items.map((item) => (
                <li key={item} className="flex gap-2.5">
                    <Check />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    )
}

function HostedCheckoutButton() {
    const [state, setState] = useState('idle')
    const [message, setMessage] = useState('')

    const startCheckout = async (event) => {
        event.preventDefault()
        setState('loading')
        setMessage('')

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
            })
            const payload = await response.json()
            if (!response.ok || !payload.url) {
                throw new Error(
                    payload.message || 'Hosted checkout is temporarily unavailable.'
                )
            }
            window.location.assign(payload.url)
        } catch (error) {
            setState('error')
            setMessage(error.message)
        }
    }

    return (
        <form
            action="/api/create-checkout-session"
            method="post"
            onSubmit={startCheckout}
        >
            <button
                type="submit"
                data-testid="hosted-checkout"
                className="btn-ink w-full text-center disabled:cursor-wait disabled:opacity-60"
                disabled={state === 'loading'}
                onClick={startCheckout}
            >
                {state === 'loading' ? 'Opening secure checkout…' : 'Start hosted subscription'}
            </button>
            {state === 'error' && (
                <p role="alert" className="mt-3 text-xs leading-relaxed text-ink-3">
                    {message}{' '}
                    <Link href="/#book" className="text-accent underline">
                        Contact us to complete setup.
                    </Link>
                </p>
            )}
        </form>
    )
}

export default function Pricing({ hostedOffer = null }) {
    const runCapLabel = monthlyRunCapLabel(hostedOffer?.monthlyRunCap)

    return (
        <section
            id="pricing"
            className="border-t-2 border-ink bg-ground px-5 py-16 md:py-20"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Launch options</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Run it yourself or launch with us
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    The engine is MIT-licensed. Hosted browser execution is
                    launching with subscription checkout now. When configured,
                    this page reads the offer directly from Stripe; Checkout
                    confirms the same price and billing period before payment.
                </p>

                <div className="mt-10 grid items-start gap-6 md:grid-cols-3">
                    {/* Card 1 — Open Source */}
                    <div className="flex h-full flex-col rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                        <p className="eyebrow">Open Source</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                                Free
                            </span>
                            <span className="text-sm text-ink-3">MIT</span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            For builders and self-hosters who want it running on
                            their own machines.
                        </p>
                        <FeatureList
                            items={[
                                'Browser record → compile → replay, fully local',
                                'Deterministic re-resolution with auditable diffs',
                                'Lint, certify, reports, and refusal semantics',
                                'The engine is MIT and always will be',
                            ]}
                        />
                        <div className="mt-6 flex-grow" />
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost-ink w-full text-center"
                        >
                            View on GitHub
                        </a>
                        <p className="mt-3 text-center font-mono text-xs text-ink-3">
                            pip install openadapt-flow
                        </p>
                    </div>

                    {/* Card 2 — Hosted browser execution */}
                    <div className="relative flex h-full flex-col rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                        <span className="absolute -top-3 left-6 rounded-full border border-hairline bg-ground px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2">
                            Launching now
                        </span>
                        <p className="eyebrow">Hosted</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                                {hostedOffer?.amount || 'Configured in Stripe'}
                            </span>
                            {hostedOffer?.cadence && (
                                <span className="text-sm text-ink-3">
                                    {hostedOffer.cadence}
                                </span>
                            )}
                        </div>
                        {hostedOffer?.product && (
                            <p className="mt-1 font-mono text-xs text-ink-3">
                                {hostedOffer.product}
                            </p>
                        )}
                        {runCapLabel && (
                            <p
                                className="mt-2 text-sm font-semibold text-ink"
                                data-testid="hosted-run-cap"
                            >
                                {runCapLabel}
                            </p>
                        )}
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            Subscribe to the hosted browser path. Checkout
                            creates a Stripe subscription and routes you into
                            account onboarding; execution entitlements follow
                            the configured hosted offer.
                        </p>
                        <FeatureList
                            items={[
                                'Managed execution of locally compiled, attested browser bundles',
                                'Deterministic healthy replay with zero model calls',
                                'Run history, structural reports, replacement activation, and metering',
                                'Sanitized artifacts and attested bundles admitted under policy',
                                'Configured price and billing period confirmed in Stripe',
                            ]}
                        />
                        <div className="mt-4 rounded-lg border border-hairline bg-ground p-3 text-xs leading-relaxed text-ink-3">
                            Hosted upload is for a sanitized derivative, not an
                            assumption that compilation removed sensitive data.
                            Review the scrub result before upload when policy
                            requires it. Recording push is followed by local
                            compile, strict lint, certification, successful replay,
                            and approval of an unchanged bundle. Runnable upload
                            then requires a one-time challenge-bound operator
                            attestation; it is not independent certification.
                            Workflows whose live runtime necessarily exposes PHI
                            require a declared customer-controlled or separately
                            qualified regulated execution boundary.
                        </div>
                        <div className="mt-6 flex-grow" />
                        <HostedCheckoutButton />
                    </div>

                    {/* Card 3 — Enterprise (primary / recommended) */}
                    <div
                        id="pricing-enterprise"
                        className="relative flex h-full flex-col rounded-2xl border-2 border-ink bg-panel p-6 shadow-[0_8px_32px_rgba(35,40,31,0.10)] md:p-7"
                    >
                        <span className="absolute -top-3 left-6 rounded-full bg-ink px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ground">
                            Regulated deployment
                        </span>
                        <p className="eyebrow">Enterprise</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                                Contact sales
                            </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            For consequential workflows that require a
                            customer-controlled data boundary. We qualify the
                            substrate, artifact policy, effect oracle, and
                            operating model before production use.
                        </p>
                        <FeatureList
                            items={[
                                'Qualify the substrate and safety boundary first',
                                'Scope one workflow and one measurable outcome',
                                'Execute in the customer-controlled environment',
                                'Identity and effect checks configured per deployment',
                                'Sanitized derivatives may cross approved boundaries',
                                'Runtime PHI remains in the trusted execution environment',
                                'Deployment, support, and compliance terms documented in scope',
                            ]}
                        />
                        <div className="mt-4 rounded-lg border border-hairline bg-ground p-3 text-xs leading-relaxed text-ink-3">
                            Read our{' '}
                            <Link
                                href="/security"
                                className="text-accent underline"
                            >
                                security posture
                            </Link>
                            : on-prem data handling, what is and isn&apos;t
                            certified yet, and how to report a vulnerability.
                        </div>
                        <div className="mt-6 flex-grow" />
                        <Link
                            href="/#book"
                            className="btn-ink w-full text-center"
                        >
                            Plan a regulated deployment
                        </Link>
                    </div>
                </div>

                {/*
                 * Hosted launch and regulated deployment are separate offers;
                 * checkout never implies a certification or regulated SLA.
                 */}
                <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-hairline bg-panel p-6 md:flex-row md:items-center md:justify-between md:p-7">
                    <div className="md:max-w-2xl">
                        <p className="eyebrow">Commercial launch</p>
                        <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink md:text-xl">
                            Hosted browser subscriptions are opening now
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-2">
                            The checkout offer covers the browser substrate.
                            Desktop, RDP, and Citrix remain separate validation
                            work and are not silently included in a browser
                            subscription. Regulated deployments are scoped
                            around their actual data and verification boundary.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-start gap-3 md:items-end">
                        <Link
                            href="/#book"
                            className="btn-ink w-full text-center md:w-auto"
                        >
                            Discuss deployment
                        </Link>
                    </div>
                </div>
                <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ink-3">
                    Stripe is the source of truth for the hosted subscription
                    price. Checkout does not itself promise an SLA, compliance
                    certification, or support for an experimental backend.
                </p>
            </div>
        </section>
    )
}
