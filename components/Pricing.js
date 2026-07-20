import { useState } from 'react'
import Link from 'next/link'

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
            className="border-t-2 border-ink bg-ground px-5 py-16 md:py-20"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Ways to start</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Run it yourself, subscribe, or start a pilot
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    Run the MIT-licensed engine yourself for free. Subscribe to
                    managed browser execution &mdash; a live offer in Beta, with
                    assisted onboarding as we qualify your first workflow. Bring
                    OpenAdapt to desktop, Citrix, and regulated workflows through
                    a scoped paid pilot.
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

                    {/* Card 2 — Hosted browser execution */}
                    <div className="relative flex h-full flex-col rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                        <span
                            className="absolute -top-3 left-6 rounded-full border border-hairline bg-ground px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2"
                            data-testid="hosted-status-label"
                        >
                            {hostedStatusLabel}
                        </span>
                        <p className="eyebrow">Hosted browser</p>
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
                            A live, managed subscription for an approved browser
                            workflow: a control plane for repeat execution,
                            reporting, and governed updates. Onboarding is
                            assisted &mdash; we qualify the first workflow with
                            you rather than one-click self-serve.
                        </p>
                        <FeatureList
                            items={[
                                'Managed execution of approved browser workflows',
                                'Deterministic healthy replay with zero model calls',
                                'Run history, failure reports, usage, and governed updates',
                                'Sanitized uploads admitted under declared policy',
                                'Price and billing period confirmed in Stripe',
                            ]}
                        />
                        <div className="mt-4 rounded-lg border border-hairline bg-ground p-3 text-xs leading-relaxed text-ink-3">
                            Hosted upload accepts an approved sanitized copy, not
                            the original recording. Live screens can contain
                            sensitive data again; workflows that expose PHI require
                            a separately qualified customer-controlled boundary.{' '}
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
                            Design partner
                        </span>
                        <p className="eyebrow">Scoped pilot</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                                Scoped paid pilot
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-ink-3">
                            Priced after qualification
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            Bring the governed loop to Windows, macOS, RDP, Citrix,
                            or regulated data. We qualify the substrate, artifact
                            policy, effect oracle, and operating model with you in
                            a customer-controlled boundary, then scope and price
                            the pilot before production use.
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
                            Evaluate a workflow
                        </Link>
                    </div>
                </div>

                <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ink-3">
                    {hostedOfferAvailable
                        ? 'The hosted subscription price shown above comes directly from Stripe and is confirmed again at checkout.'
                        : 'Managed browser subscriptions open only after the live checkout and account-return path pass launch qualification.'}{' '}
                    Regulated deployment and service terms are scoped separately.
                </p>
            </div>
        </section>
    )
}
