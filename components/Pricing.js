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
                    production, inference is bundled in — no per-step, per-seat,
                    or per-model-call metering. On-prem keeps your data in your
                    building.
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

                    {/* Card 2 — Hosted */}
                    <div className="flex h-full flex-col rounded-2xl border border-hairline bg-panel p-6 md:p-7">
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
                            cloud runner.
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
                            — your data stays in your building.
                        </div>
                        <div className="mt-6 flex-grow" />
                        <Link
                            href="/#book"
                            className="btn-ghost-ink w-full text-center"
                        >
                            Get early access
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
                            For regulated teams — healthcare, lending, and other
                            compliance-bound back-offices.
                        </p>
                        <FeatureList
                            items={[
                                'On-premises deployment — PHI never leaves the building',
                                'Inference runs on your hardware at zero metered cost',
                                'Paid pilot → annual platform license',
                                'BAA, SOC 2, credential vault, and audit trail',
                                'Self-healing and fleet management included',
                            ]}
                        />
                        <div className="mt-6 flex-grow" />
                        <Link href="/#book" className="btn-ink w-full text-center">
                            Book a demo
                        </Link>
                    </div>
                </div>

                {/*
                 * Guided setup — the on-ramp into the Enterprise lane, not a
                 * fourth tier. A single-row band, hairline border, deliberately
                 * secondary to the cards above: this is the done-with-you way in
                 * for regulated buyers who will not self-serve. Flat fee is
                 * credited toward the pilot, so it reads as proof of value, not
                 * a standing consultancy line.
                 */}
                <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-hairline bg-panel p-6 md:flex-row md:items-center md:justify-between md:p-7">
                    <div className="md:max-w-2xl">
                        <p className="eyebrow">Guided setup</p>
                        <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink md:text-xl">
                            Not sure where to start? We&apos;ll build your first
                            workflow with you.
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-2">
                            Pick one well-scoped task. We record it and compile
                            it with you, then get it running end to end with
                            effect verification, in days. A flat fee that&apos;s
                            credited toward your pilot if you move forward. A
                            low-risk way to see it work on your real workflow
                            before you commit.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-start gap-3 md:items-end">
                        <div className="md:text-right">
                            <div className="font-display text-xl font-semibold tracking-tight text-ink">
                                from $2,500
                            </div>
                            <div className="font-mono text-xs text-ink-3">
                                credited toward your pilot
                            </div>
                        </div>
                        <Link
                            href="/#book"
                            className="btn-ink w-full text-center md:w-auto"
                        >
                            Book a setup call
                        </Link>
                    </div>
                </div>
                <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-ink-3">
                    Setup pricing is a starting figure and confirmed before we
                    begin.
                </p>

                <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ink-3">
                    We price the workflow outcome and the compliance, and bundle
                    the inference. No per-step, per-seat, or per-model-call
                    charges anywhere.
                </p>
            </div>
        </section>
    )
}
