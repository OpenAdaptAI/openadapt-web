import { useState } from 'react'
import Link from 'next/link'

import { track, EVENTS } from 'utils/analytics'
import status from '../public/status.json'

const {
    LAUNCH_MONTHLY_RUN_CAP,
    LAUNCH_PRICE_CADENCE,
    LAUNCH_PRICE_DISPLAY,
    monthlyRunCapLabel,
} = require('../lib/hostedOfferContract')

/*
 * Public offer terms come from the same code-owned launch contract that
 * validates Stripe. Checkout still remains unavailable unless the configured
 * live Product and Price match that contract exactly. The hosted maturity label is
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

function EntryCard({
    id,
    eyebrow,
    title,
    price,
    priceDetail,
    description,
    features,
    children,
    featured = false,
}) {
    const titleId = `${id}-title`

    return (
        <article
            id={id}
            role="listitem"
            aria-labelledby={titleId}
            className={[
                'flex h-full scroll-mt-24 flex-col rounded-2xl bg-panel p-6 md:p-7',
                featured
                    ? 'border-2 border-ink shadow-[0_8px_32px_rgba(35,40,31,0.10)]'
                    : 'border border-hairline',
            ].join(' ')}
        >
            <p className="eyebrow">{eyebrow}</p>
            <h2
                id={titleId}
                className="mt-2 font-display text-xl font-semibold tracking-tight text-ink"
            >
                {title}
            </h2>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-display text-3xl font-semibold tracking-tight text-ink">
                    {price}
                </span>
                {priceDetail && (
                    <span className="text-sm text-ink-3">{priceDetail}</span>
                )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
                {description}
            </p>
            <FeatureList items={features} />
            <div className="mt-auto pt-6">{children}</div>
        </article>
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
                throw new Error(
                    'We could not open secure checkout. Please try again.'
                )
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
                    Get Cloud setup help
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
                <p
                    role="alert"
                    className="mt-3 text-xs leading-relaxed text-ink-3"
                >
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
    const runCapLabel = monthlyRunCapLabel(
        hostedOffer?.monthlyRunCap || LAUNCH_MONTHLY_RUN_CAP
    )
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
                    Choose how you want to start.
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    Run OpenAdapt yourself, qualify a consequential enterprise
                    workflow with our team, or subscribe to managed Cloud for an
                    approved workflow.
                </p>

                <div
                    role="list"
                    aria-label="Ways to start with OpenAdapt"
                    className="mt-10 grid items-stretch gap-6 lg:grid-cols-3"
                >
                    <EntryCard
                        id="community"
                        eyebrow="Build it yourself"
                        title="OpenAdapt Community"
                        price="Free"
                        description="MIT-licensed local runtime and qualification tools for self-directed use."
                        features={[
                            'Local record, compile, qualify, run, and evidence',
                            'Governed repair review and basic scheduling',
                            'Community support',
                            'No Cloud account required',
                        ]}
                    >
                        <a
                            href="https://docs.openadapt.ai/get-started/"
                            className="btn-ghost-ink w-full text-center"
                        >
                            Run the open-source demo
                        </a>
                        <p className="mt-3 text-center font-mono text-xs text-ink-3">
                            pip install openadapt
                        </p>
                    </EntryCard>

                    <EntryCard
                        id="pricing-enterprise"
                        eyebrow="Recommended for enterprise"
                        title="Workflow Qualification Sprint"
                        price="From $15,000"
                        priceDetail="ten-business-day target"
                        description="Qualify one application, one environment, and one measurable business effect before scaling."
                        features={[
                            'Suitability decision and qualified prototype',
                            'Identity and effect-verification contract',
                            'Failure, exception, and deployment analysis',
                            'ROI model and signed go/no-go report',
                        ]}
                        featured
                    >
                        <p className="mt-4 text-xs leading-relaxed text-ink-3">
                            Native, RDP, and Citrix qualifications are typically
                            $25,000–$40,000. The sprint is paid even when the
                            correct outcome is not to automate.
                        </p>
                        <Link
                            href="/qualify"
                            className="btn-ink mt-5 w-full text-center"
                        >
                            Qualify one workflow
                        </Link>
                    </EntryCard>

                    <EntryCard
                        id="cloud-preview"
                        eyebrow="Managed self-service"
                        title="OpenAdapt Cloud"
                        price={hostedOffer?.amount || LAUNCH_PRICE_DISPLAY}
                        priceDetail={
                            hostedOffer?.cadence || LAUNCH_PRICE_CADENCE
                        }
                        description="For developers and teams evaluating browser workflows on non-regulated data: run approved workflows with history, evidence, usage, and governed updates in one managed control plane. Regulated data and production SLAs are scoped separately through qualification."
                        features={[
                            'Managed execution, evidence, usage, and workflow updates',
                            'Separate from enterprise qualification',
                            'No production SLA or regulated deployment included',
                            'Live subscription with secure Stripe checkout',
                        ]}
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <span
                                className="rounded-full border border-hairline bg-ground px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2"
                                data-testid="hosted-status-label"
                            >
                                {hostedStatusLabel}
                            </span>
                            {runCapLabel && (
                                <span
                                    className="text-xs font-medium text-ink-2"
                                    data-testid="hosted-run-cap"
                                >
                                    {runCapLabel}
                                </span>
                            )}
                        </div>
                        <HostedCheckoutButton
                            available={hostedOfferAvailable}
                        />
                        <p className="mt-3 text-center text-xs leading-relaxed text-ink-3">
                            By subscribing, you agree to the{' '}
                            <Link
                                href="/terms-of-service"
                                className="text-accent underline"
                            >
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link
                                href="/privacy-policy"
                                className="text-accent underline"
                            >
                                acknowledge the Privacy Notice
                            </Link>
                            .
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-ink-3">
                            Approved sanitized artifacts may enter Cloud;
                            sensitive live observations stay inside the declared
                            execution boundary.{' '}
                            <Link
                                href="/security"
                                className="text-accent underline"
                            >
                                Review the security boundary.
                            </Link>
                        </p>
                    </EntryCard>
                </div>

                <div
                    aria-labelledby="enterprise-path-title"
                    className="mt-12 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                >
                    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                        <div>
                            <p className="eyebrow">
                                After a successful qualification
                            </p>
                            <h2
                                id="enterprise-path-title"
                                className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                            >
                                Prove it, then scale it.
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-ink-2">
                                Each stage earns the next with measured results.
                                One qualification conversation scopes the whole
                                path.
                            </p>
                            <Link
                                href="/qualify"
                                className="btn-ghost-ink mt-6 inline-block"
                            >
                                Qualify one workflow
                            </Link>
                        </div>

                        <ol className="divide-y divide-hairline border-y border-hairline">
                            <li className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:gap-6">
                                <div>
                                    <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent">
                                        Supervised production pilot
                                    </p>
                                    <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                                        Prove the workflow on representative
                                        cases.
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                        Measure verified outcomes, halts, and
                                        intervention time, then leave with a
                                        production acceptance report.
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-ink sm:pt-1 sm:text-right">
                                    Typically $30,000–$60,000
                                </p>
                            </li>
                            <li className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:gap-6">
                                <div>
                                    <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent">
                                        Production
                                    </p>
                                    <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                                        Operate with governed evidence and
                                        support.
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                        Annual scope reflects the qualified
                                        workflow family, environment, runners,
                                        evidence, support, and requalification.
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-ink sm:pt-1 sm:text-right">
                                    Typically $48,000–$120,000/year
                                </p>
                            </li>
                        </ol>
                    </div>

                    <aside className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm leading-relaxed text-ink-2">
                            <span className="font-semibold text-ink">
                                Embedding OpenAdapt?
                            </span>{' '}
                            OEM programs are typically $75,000–$150,000
                            annually, plus scoped integration work.
                        </p>
                        <Link
                            href="/execute"
                            className="shrink-0 text-sm font-semibold text-accent underline"
                        >
                            Explore OpenAdapt Execute
                        </Link>
                    </aside>
                </div>

                {/*
                 * Option A (chosen): a credits callout under the tiers, not a
                 * fourth "pay-with-data" tier. Frames credits as extending
                 * your monthly run cap, which is what the mechanism does.
                 * Marked early access; links to /contribute for the full
                 * program, guarantees, and terms status.
                 */}
                <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="eyebrow">Earn credits by contributing</p>
                        <span className="rounded-full border border-hairline bg-ground px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2">
                            Early access
                        </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2">
                        Contribute a sanitized, de-identified derivative to the
                        shared hardening corpus and earn run credits that
                        extend your monthly run cap. Raw recordings never
                        leave your machine, you approve every byte, and it
                        stays opt-in; you can stop future contributions at any
                        time. The program opens once its versioned terms are
                        finalized.{' '}
                        <Link
                            href="/contribute"
                            className="text-accent underline"
                        >
                            Request access to the contributor program.
                        </Link>
                    </p>
                </div>

                <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-ink-3">
                    {hostedOfferAvailable
                        ? 'The Cloud subscription price comes directly from Stripe and is confirmed again at checkout.'
                        : 'Cloud offer details are loaded from the live billing contract.'}{' '}
                    Enterprise scope, support, security, and continuity terms
                    are documented in the applicable order form.
                </p>
            </div>
        </section>
    )
}
