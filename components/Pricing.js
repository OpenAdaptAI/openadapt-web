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
                    href="/qualify"
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
                    href="/qualify"
                    data-testid="hosted-waitlist"
                    className="mt-3 block text-center text-xs text-accent underline"
                >
                    Qualify a managed workflow
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
                    <Link href="/qualify" className="text-accent underline">
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
            <div className="mx-auto max-w-6xl">
                <p className="eyebrow text-center">Pricing</p>
                <h1 className="mx-auto mt-2 max-w-3xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-4xl">
                    Start with one workflow. Earn the right to scale it.
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt Community is free. Enterprise work begins with a paid
                    qualification of one application, one environment, and one
                    measurable business effect. The managed Cloud subscription is a
                    separate self-service lane for approved workflows.
                </p>

                <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-3">
                    <div className="flex h-full flex-col rounded-2xl border border-hairline bg-panel p-6">
                        <p className="eyebrow">OpenAdapt Community</p>
                        <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
                            Free
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            MIT-licensed local runtime and qualification tools for
                            self-directed use.
                        </p>
                        <FeatureList
                            items={[
                                'Local record, compile, qualify, run, and evidence',
                                'Governed repair review and basic scheduling',
                                'Community support',
                                'No Cloud account required',
                            ]}
                        />
                        <div className="mt-6 flex-grow" />
                        <a
                            href="https://docs.openadapt.ai/get-started/"
                            className="btn-ghost-ink w-full text-center"
                        >
                            Run the open-source demo
                        </a>
                        <p className="mt-3 text-center font-mono text-xs text-ink-3">
                            pip install openadapt
                        </p>
                    </div>

                    <div
                        id="pricing-enterprise"
                        className="relative flex h-full flex-col rounded-2xl border-2 border-ink bg-panel p-6 shadow-[0_8px_32px_rgba(35,40,31,0.10)]"
                    >
                        <span className="absolute -top-3 left-6 rounded-full bg-ink px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ground">
                            Recommended first step
                        </span>
                        <p className="eyebrow">Workflow Qualification Sprint</p>
                        <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
                            From $15,000
                        </p>
                        <p className="mt-1 text-sm text-ink-3">
                            Ten-business-day target for a bounded workflow
                        </p>
                        <FeatureList
                            items={[
                                'Suitability decision and qualified prototype',
                                'Identity and effect-verification contract',
                                'Failure, exception, and deployment analysis',
                                'ROI model and signed go/no-go report',
                            ]}
                        />
                        <p className="mt-4 text-xs leading-relaxed text-ink-3">
                            Native, RDP, and Citrix qualifications are typically
                            $25,000–$40,000. The sprint is paid even when the correct
                            outcome is not to automate.
                        </p>
                        <div className="mt-6 flex-grow" />
                        <Link href="/qualify" className="btn-ink w-full text-center">
                            Qualify one workflow
                        </Link>
                    </div>

                    <div className="flex h-full flex-col rounded-2xl border border-hairline bg-panel p-6">
                        <p className="eyebrow">Supervised Production Pilot</p>
                        <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
                            $30,000–$60,000
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            One workflow, one application, and one environment
                            running representative cases under supervision or in
                            shadow mode.
                        </p>
                        <FeatureList
                            items={[
                                'Representative real cases',
                                'Measured VERIFIED, HALTED, and intervention rates',
                                'Security and deployment review',
                                'Production acceptance report',
                            ]}
                        />
                        <div className="mt-6 flex-grow" />
                        <Link href="/qualify" className="btn-ghost-ink w-full text-center">
                            Scope a pilot
                        </Link>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <article className="rounded-2xl border border-hairline bg-panel p-6">
                        <p className="eyebrow">Production</p>
                        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                            $48,000–$120,000 annually
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            Priced by qualified workflow family, application and
                            environment, runners, evidence requirements, support,
                            and requalification obligations—not primarily by seat
                            or run.
                        </p>
                    </article>
                    <article className="rounded-2xl border border-hairline bg-panel p-6">
                        <p className="eyebrow">OEM</p>
                        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                            $75,000–$150,000 annual minimum
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            Embed the governed contract in your product:
                            <span className="mt-2 block font-mono text-xs text-ink">
                                execute(bundle, parameters) → VERIFIED | HALTED → evidence
                            </span>
                            Integration work is scoped separately.
                        </p>
                    </article>
                </div>

                <div className="mt-10 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="eyebrow">OpenAdapt Cloud</p>
                                <span
                                    className="rounded-full border border-hairline bg-ground px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2"
                                    data-testid="hosted-status-label"
                                >
                                    {hostedStatusLabel}
                                </span>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="font-display text-3xl font-semibold tracking-tight text-ink">
                                    {hostedOfferAvailable
                                        ? hostedOffer.amount
                                        : 'Managed browser subscription'}
                                </span>
                                {hostedOffer?.cadence && (
                                    <span className="text-sm text-ink-3">
                                        {hostedOffer.cadence}
                                    </span>
                                )}
                            </div>
                            {runCapLabel && (
                                <p
                                    className="mt-2 text-sm font-semibold text-ink"
                                    data-testid="hosted-run-cap"
                                >
                                    {runCapLabel}
                                </p>
                            )}
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                                A separate self-service managed lane for approved
                                workflows: run history, evidence, usage, and workflow
                                updates in one control plane. It does not include an
                                enterprise qualification sprint, production SLA, or
                                regulated deployment.
                            </p>
                            <p className="mt-3 text-xs leading-relaxed text-ink-3">
                                Approved sanitized artifacts may enter Cloud; sensitive
                                live observations stay inside the declared execution
                                boundary.{' '}
                                <Link href="/security" className="text-accent underline">
                                    Review the security boundary.
                                </Link>
                            </p>
                        </div>
                        <div className="flex flex-col justify-center">
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
                    </div>
                </div>

                <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-ink-3">
                    {hostedOfferAvailable
                        ? 'The Cloud subscription price comes directly from Stripe and is confirmed again at checkout.'
                        : 'Cloud offer details are loaded from the live billing contract.'}{' '}
                    Enterprise scope, support, security, and continuity terms are
                    documented in the applicable order form.
                </p>
            </div>
        </section>
    )
}
