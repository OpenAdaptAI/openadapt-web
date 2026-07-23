import { useState } from 'react'
import Link from 'next/link'

import { track, EVENTS } from 'utils/analytics'
import status from '../public/status.json'

const { monthlyRunCapLabel } = require('../lib/hostedOfferContract')

/*
 * Three delivery paths. The hosted amount is retrieved from Stripe at build
 * time rather than duplicated in site code; Checkout confirms the same
 * configured product and price before payment. The hosted maturity label is
 * read from the canonical status manifest (public/status.json) so it can never
 * drift from the single source of truth.
 */

const hostedStatusLabel =
    status.substrates.find((substrate) => substrate.name === 'Hosted Cloud')
        ?.public_label || 'Beta'

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

function HostedCheckoutButton({ available }) {
    const [state, setState] = useState('idle')
    const [message, setMessage] = useState('')

    const startCheckout = async (event) => {
        event.preventDefault()
        // Funnel: intent to start the hosted subscription. No amounts, emails,
        // or payment details are captured — only that checkout was initiated.
        track(EVENTS.PRICING_CTA_CLICK, { plan: 'hosted', action: 'checkout' })
        setState('loading')
        setMessage('')

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
            })
            const payload = await response.json()
            if (!response.ok || !payload.url) {
                throw new Error('We could not open secure checkout. Please try again.')
            }
            window.location.assign(payload.url)
        } catch (error) {
            setState('error')
            setMessage(error.message)
        }
    }

    if (!available) {
        return (
            <div>
                <Link
                    href="/#book"
                    data-testid="hosted-contact"
                    className="btn-ink block w-full text-center"
                    onClick={() =>
                        track(EVENTS.PRICING_CTA_CLICK, {
                            plan: 'hosted',
                            action: 'contact',
                        })
                    }
                >
                    Start with our team
                </Link>
                <Link
                    href="/#get-updates"
                    data-testid="hosted-waitlist"
                    className="mt-3 block text-center text-xs text-accent underline"
                >
                    Get notified when hosted access opens
                </Link>
            </div>
        )
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
            >
                {state === 'loading'
                    ? 'Opening secure checkout…'
                    : 'Start hosted subscription'}
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
    const hostedOfferAvailable = Boolean(
        hostedOffer?.amount &&
        hostedOffer?.cadence &&
        hostedOffer?.product &&
        runCapLabel
    )

    return (
        <section
            id="pricing"
            className="border-t border-hairline bg-ground px-5 py-20 md:py-28"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Ways to start</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Run locally, use Cloud, or deploy in your boundary
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    Use the MIT-licensed engine on your own machine, subscribe to
                    OpenAdapt Cloud for managed execution and review, or put the
                    governed runtime inside a customer-controlled boundary for
                    desktop, remote, private, and regulated workflows.
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
                            For builders and self-hosters running it on their own
                            machines.
                        </p>
                        <FeatureList
                            items={[
                                'Browser artifacts stay local unless you explicitly push',
                                'Deterministic re-resolution with auditable diffs',
                                'Policy certification, fail-closed run gate, and reports',
                                'MIT-licensed engine and CLI',
                            ]}
                        />
                        <div className="mt-6 flex-grow" />
                        <a
                            href="/#open-source"
                            className="btn-ghost-ink w-full text-center"
                        >
                            Try locally
                        </a>
                        <p className="mt-3 text-center font-mono text-xs text-ink-3">
                            pip install openadapt
                        </p>
                    </div>

                    {/* Card 2 — OpenAdapt Cloud (managed control plane) */}
                    <div className="relative flex h-full flex-col rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                        <span
                            className="absolute -top-3 left-6 rounded-full border border-hairline bg-ground px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2"
                            data-testid="hosted-status-label"
                        >
                            {hostedStatusLabel}
                        </span>
                        <p className="eyebrow">OpenAdapt Cloud</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                                {hostedOfferAvailable
                                    ? hostedOffer.amount
                                    : 'Hosted execution'}
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
                            The managed control plane for governed browser
                            execution, run history, evidence, usage, and workflow
                            updates. Desktop, RDP, and Citrix connect through a
                            self-hosted or customer-controlled runtime under the
                            same governance model. We qualify the first workflow
                            with you during onboarding.
                        </p>
                        <FeatureList
                            items={[
                                'Managed browser runner and Cloud control plane',
                                'Deterministic healthy replay with zero model calls',
                                'One review surface for runs, evidence, and usage',
                                'Sanitized uploads admitted under declared policy',
                                'Price and billing period confirmed in Stripe',
                            ]}
                        />
                        <div className="mt-4 rounded-lg border border-hairline bg-ground p-3 text-xs leading-relaxed text-ink-3">
                            Cloud admits an approved sanitized copy, not the
                            original recording. Sensitive live observations stay
                            inside the declared execution boundary.{' '}
                            <Link href="/security" className="text-accent underline">
                                Review the security boundary.
                            </Link>
                        </div>
                        <div className="mt-6 flex-grow" />
                        <HostedCheckoutButton available={hostedOfferAvailable} />
                        <p className="mt-3 text-center text-xs leading-relaxed text-ink-3">
                            By subscribing, you agree to the{' '}
                            <Link href="/terms-of-service" className="text-accent underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy-policy" className="text-accent underline">
                                acknowledge the Privacy Notice
                            </Link>
                            .
                        </p>
                    </div>

                    {/* Card 3 — Enterprise (primary / recommended) */}
                    <div
                        id="pricing-enterprise"
                        className="relative flex h-full flex-col rounded-2xl border-2 border-ink bg-panel p-6 shadow-[0_8px_32px_rgba(35,40,31,0.10)] md:p-7"
                    >
                        <span className="absolute -top-3 left-6 rounded-full bg-ink px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ground">
                            Customer-controlled
                        </span>
                        <p className="eyebrow">Enterprise</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                                Customer-controlled deployment
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-ink-3">
                            Qualified and priced to scope
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            Run desktop, RDP, Citrix, private-system, and regulated
                            workflows inside your environment. The same policy,
                            approval, verification, and audit model follows the
                            workflow without moving sensitive runtime observations
                            outside your boundary.
                        </p>
                        <FeatureList
                            items={[
                                'Desktop and remote execution inside your boundary',
                                'One workflow and measurable outcome per rollout',
                                'Identity and effect checks configured per deployment',
                                'Sanitized derivatives may cross approved boundaries',
                                'Runtime PHI/PII remains in the trusted execution environment',
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
                            : data boundaries, runtime controls, release provenance,
                            and vulnerability reporting.
                        </div>
                        <div className="mt-6 flex-grow" />
                        <Link
                            href="/#book"
                            className="btn-ink w-full text-center"
                        >
                            Evaluate a workflow
                        </Link>
                    </div>
                </div>

                <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ink-3">
                    {hostedOfferAvailable
                        ? 'The hosted subscription price shown above comes directly from Stripe and is confirmed again at checkout.'
                        : 'OpenAdapt Cloud subscriptions open only after the live checkout and account-return path pass launch qualification.'}{' '}
                    Regulated deployment and service terms are scoped separately.
                </p>
            </div>
        </section>
    )
}
