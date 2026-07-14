import Link from 'next/link'

/*
 * Pricing — three lanes, value-priced.
 *
 * Enterprise is the primary (visually recommended) card: on-prem, PHI never
 * leaves the building, inference runs on the customer's hardware at zero
 * metered cost. Hosted is a secondary, non-PHI / evaluation on-ramp priced on
 * outcome units (workflow-runs), never per-step / per-seat / per-VLM-call. OSS
 * stays MIT and honest.
 *
 * Deliberately NOT shown anywhere: $/step, $/VLM-call, per-seat, or a raw
 * $/run meter. We price the outcome and the compliance; inference is bundled.
 */

const GITHUB_URL = 'https://github.com/OpenAdaptAI/OpenAdapt'

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

export default function Pricing() {
    return (
        <section
            id="pricing"
            className="border-t-2 border-ink bg-ground px-5 py-16 md:py-20"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Pricing</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Priced on the outcome, not the click
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    The engine is open source and free. When you need it in
                    production, the AI is included in the price: no per-step,
                    per-seat, or per-call metering. On-premises keeps your data
                    in your building.
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
                                'Record → compile → replay, fully local',
                                'Self-healing scripts, reviewable as diffs',
                                'Self-host for full auditability',
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
                            pip install openadapt
                        </p>
                    </div>

                    {/* Card 2 — Hosted (preview / waitlist, not yet live) */}
                    <div className="relative flex h-full flex-col rounded-2xl border border-hairline bg-panel p-6 md:p-7">
                        <span className="absolute -top-3 left-6 rounded-full border border-hairline bg-ground px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2">
                            Preview · join the waitlist
                        </span>
                        <p className="eyebrow">Hosted</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                                $500
                            </span>
                            <span className="text-sm text-ink-3">
                                /mo · up to 10,000 runs
                            </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            For teams without on-prem hardware who want a managed
                            cloud runner. Not live yet: this is a preview, and
                            the price shown is what it will cost at launch.
                        </p>
                        <FeatureList
                            items={[
                                'Fully managed cloud runner, nothing for you to run',
                                'Up to 10,000 workflow runs a month',
                                'Hosted inference included at no extra cost',
                                'No per-step or per-seat billing, no surprise charges',
                            ]}
                        />
                        <div className="mt-4 rounded-lg border border-hairline bg-ground p-3 text-xs leading-relaxed text-ink-3">
                            For non-PHI / evaluation workloads. Handling PHI or
                            PII?{' '}
                            <a
                                href="#pricing-enterprise"
                                className="text-accent underline"
                            >
                                See Enterprise
                            </a>{' '}
                            and your data stays in your building.
                        </div>
                        <div className="mt-6 flex-grow" />
                        <Link
                            href="/#book"
                            className="btn-ghost-ink w-full text-center"
                        >
                            Join the waitlist
                        </Link>
                    </div>

                    {/* Card 3 — Enterprise (primary / recommended) */}
                    <div
                        id="pricing-enterprise"
                        className="relative flex h-full flex-col rounded-2xl border-2 border-ink bg-panel p-6 shadow-[0_8px_32px_rgba(35,40,31,0.10)] md:p-7"
                    >
                        <span className="absolute -top-3 left-6 rounded-full bg-ink px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ground">
                            Recommended
                        </span>
                        <p className="eyebrow">Enterprise</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                                Talk to us
                            </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            For regulated teams in healthcare, lending, and other
                            compliance-bound back-offices.
                        </p>
                        <FeatureList
                            items={[
                                'On-prem, or managed by us inside your own cloud (single-tenant), so PHI never leaves your network',
                                'Inference runs on your hardware at zero metered cost',
                                'Pilot first, then an annual platform license',
                                'On-prem architecture built for BAA and SOC 2 requirements; formal attestation in progress',
                                'Audit trail: every run writes an illustrated report',
                                'Self-healing and fleet management included',
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
                        <Link href="/#book" className="btn-ink w-full text-center">
                            Book a demo
                        </Link>
                    </div>
                </div>

                {/*
                 * Pilot: the paid on-ramp, not a fourth tier. One clear
                 * engagement: we get one workflow live in 30 days against a
                 * single agreed success measure, refunded if it misses. Priced
                 * LOW on purpose (the software does the work, so it is a couple
                 * hours of setup, not a multi-week integration) to reduce
                 * friction and earn references; the value lives in the annual
                 * license. The fee credits toward the first-year license (NOT
                 * "toward the pilot": the fee IS the pilot). Sales-led (book a
                 * call, then invoice), so the CTA is a call, not a checkout.
                 */}
                <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-hairline bg-panel p-6 md:flex-row md:items-center md:justify-between md:p-7">
                    <div className="md:max-w-2xl">
                        <p className="eyebrow">Pilot</p>
                        <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink md:text-xl">
                            Start with one workflow, live in 30 days.
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-2">
                            Pick one high-value, repetitive task. You demonstrate
                            it once and OpenAdapt compiles it, so this is a couple
                            of hours of setup, not a multi-week integration. We
                            agree one success measure up front and get it running
                            end to end with checks that confirm it did the right
                            thing. If it doesn&apos;t hit that measure, you pay
                            nothing.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-start gap-3 md:items-end">
                        <div className="md:text-right">
                            <div className="font-display text-xl font-semibold tracking-tight text-ink">
                                from $5,000
                            </div>
                            <div className="font-mono text-xs text-ink-3">
                                credited toward your first-year license
                            </div>
                        </div>
                        <Link
                            href="/#book"
                            className="btn-ink w-full text-center md:w-auto"
                        >
                            Book a call to scope a pilot
                        </Link>
                    </div>
                </div>
                <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-ink-3">
                    Scope and price are confirmed before we begin. Full refund if
                    the success criteria we agree up front aren&apos;t met.
                </p>

                <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ink-3">
                    We price the outcome and the compliance, and include the AI in
                    that price. No per-step, per-seat, or per-call charges
                    anywhere.
                </p>
            </div>
        </section>
    )
}
