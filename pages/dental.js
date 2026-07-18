import Head from 'next/head'
import Link from 'next/link'

import DentalHaltMoment from '@components/DentalHaltMoment'
import DentalLeadForm from '@components/DentalLeadForm'
import Footer from '@components/Footer'

const OFFER_FACTS = [
    {
        title: '$499/mo',
        detail: 'Flat founding-cohort price. No per-verification fees, no per-seat math.',
    },
    {
        title: 'Runs on your front-desk PC',
        detail: 'Installed on the computer your team already uses. No new portal to learn.',
    },
    {
        title: 'Halts instead of guessing',
        detail: 'Anything ambiguous stops and asks a human — it never silently writes a wrong answer.',
    },
    {
        title: 'Results guarantee',
        detail: 'We agree on a verification KPI at kickoff. Miss it, and you get a full refund.',
    },
]

export default function DentalPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Automated Dental Insurance Verification — Runs on Your Front-Desk PC | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt automates dental insurance verification on your own front-desk computer. Every verification completed — by automation, or by our team when the automation halts. $499/mo founding cohort, PHI designed to stay on your machine."
                />
                <link rel="canonical" href="https://openadapt.ai/dental" />
                <meta
                    property="og:title"
                    content="Automated Dental Insurance Verification | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="$499/mo, every verification completed — runs on your front-desk PC, halts instead of guessing, and our team finishes anything the automation flags. Founding cohort of 10 practices with a results guarantee."
                />
                <meta property="og:url" content="https://openadapt.ai/dental" />
            </Head>

            {/* Offer hero */}
            <div className="mx-auto max-w-5xl px-4 py-14">
                <p className="eyebrow">
                    Automated insurance verification for dental practices
                </p>
                <h1 className="font-display mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Your front desk shouldn&apos;t spend its day re-keying
                    payer portals.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    OpenAdapt learns your practice&apos;s own
                    insurance-verification workflow from a recording of your
                    team doing it once, then runs it on your front-desk
                    computer — the same portals, the same clicks, without the
                    person. When anything doesn&apos;t match, it halts and asks
                    instead of guessing wrong.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                    We&apos;re onboarding a founding cohort of 10 practices.
                    Founding practices work directly with the founders: we
                    build your verification workflow with you, agree on the
                    result it has to deliver, and refund you in full if it
                    misses.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {OFFER_FACTS.map((fact) => (
                        <div
                            key={fact.title}
                            className="rounded-2xl border border-hairline bg-panel p-5"
                        >
                            <p className="font-display text-lg font-semibold tracking-tight text-ink">
                                {fact.title}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                {fact.detail}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <a href="#book" className="btn-ink">
                        Book a 20-minute setup call
                    </a>
                    <a href="#book" className="btn-ghost-ink">
                        Email me the details
                    </a>
                </div>
            </div>

            {/* Halt moment: real replay footage + system-of-record story */}
            <DentalHaltMoment />

            {/* Local-first / no-BAA block */}
            <div className="mx-auto max-w-5xl px-4 py-12">
                <div
                    className="rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                    style={{ borderLeft: '4px solid var(--accent)' }}
                >
                    <p className="eyebrow">Local-first by design</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                        Designed so PHI stays on your machine.
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        In the local replay configuration this offer uses, the
                        recording of your workflow, the compiled program, and
                        every run all live and execute on your practice&apos;s
                        own computer. Patient information is processed where it
                        already is — behind your firewall, under your existing
                        HIPAA safeguards — not shipped to our cloud.
                    </p>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Because the software is designed so we never receive
                        protected health information in local-only processing,
                        practices generally don&apos;t need a business
                        associate agreement with us for this configuration —
                        a BAA applies when a vendor creates, receives,
                        maintains, or transmits PHI on your behalf. Your
                        compliance officer or counsel makes that call for your
                        practice; we&apos;re glad to walk them through exactly
                        what the software does and doesn&apos;t touch. This is
                        a description of how the product is built, not legal
                        advice.
                    </p>
                    <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        <Link href="/security" className="font-medium">
                            Read the security overview →
                        </Link>
                        <Link href="/safety" className="font-medium">
                            See the safety evidence →
                        </Link>
                    </p>
                </div>

                {/* Concierge onboarding honesty */}
                <div className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <p className="eyebrow">How onboarding works</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                        We build your first workflow with you.
                    </h2>
                    <ol className="mt-5 max-w-3xl list-decimal space-y-3 pl-5 text-sm leading-relaxed text-ink-2 md:text-base">
                        <li>
                            On a call, your team verifies one patient the way
                            you always do while OpenAdapt records the
                            demonstration on your machine.
                        </li>
                        <li>
                            We compile that demonstration into a checked,
                            repeatable program and agree on the verification
                            KPI it has to hit.
                        </li>
                        <li>
                            It runs supervised first — your front desk watches
                            it work and answers when it halts — then becomes
                            part of the daily routine.
                        </li>
                    </ol>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                        Founding-cohort onboarding is deliberately hands-on:
                        you get working automation and a direct line to the
                        people who built it, and we learn exactly what dental
                        front desks need next.
                    </p>
                </div>

                {/* Closing CTA banner */}
                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                        Founding cohort: 10 practices. $499/mo. Full refund if
                        it misses the agreed KPI.
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring the payer portals you check most and a rough
                        weekly verification count. Twenty minutes tells you
                        whether this fits your practice.
                    </p>
                    <a href="#book" className="btn-ink mt-5 inline-block">
                        Book a 20-minute setup call
                    </a>
                </div>
            </div>

            {/* Lead capture + booking */}
            <DentalLeadForm sectionId="book" />

            <Footer />
        </div>
    )
}
