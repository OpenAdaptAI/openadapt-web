import Head from 'next/head'
import Link from 'next/link'

import DentalHaltMoment from '@components/DentalHaltMoment'
import DentalLeadForm from '@components/DentalLeadForm'
import Footer from '@components/Footer'

const OFFER_FACTS = [
    {
        title: '$500/mo',
        detail: 'Flat founding price for one practice location. Cancel monthly.',
    },
    {
        title: '3 portals · 600 checks',
        detail: 'Up to three approved payer portals and 600 eligibility checks each month.',
    },
    {
        title: 'Attended and local',
        detail: 'Runs on your front-desk PC, inside portal sessions your staff open and supervise.',
    },
    {
        title: 'Monthly KPI refund',
        detail: 'We sign a monthly service KPI at kickoff. If we miss it, that month is refunded.',
    },
]

export default function DentalPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Automated Dental Insurance Verification — Runs on Your Front-Desk PC | OpenAdapt</title>
                <meta
                    name="description"
                    content="A $500/month founding service for single-location dental practices: up to 3 approved payer portals and 600 attended, local eligibility checks, with a staff-first exception queue and a signed monthly KPI."
                />
                <link rel="canonical" href="https://openadapt.ai/dental" />
                <meta
                    property="og:title"
                    content="Automated Dental Insurance Verification | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="$500/month for one dental practice location: up to 3 approved payer portals and 600 attended, local eligibility checks, backed by a signed monthly service KPI."
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
                    insurance-verification workflow from recordings of
                    representative cases, then runs the approved paths on your
                    front-desk computer — in the same payer sessions your
                    staff open and supervise. When anything doesn&apos;t
                    match, it halts and puts the case in a ready-to-finish
                    queue instead of guessing.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                    We&apos;re onboarding a founding cohort of 10 practices.
                    Founding practices work directly with the founders: we
                    build your verification workflow with you, agree on the
                    monthly service KPI in writing, and refund that
                    month&apos;s fee if the signed KPI is missed.
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

            {/* Halt moment: real replay footage + bounded delivery verification */}
            <DentalHaltMoment />

            {/* Local-first data-boundary block */}
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
                        safeguards — and is not uploaded to OpenAdapt&apos;s
                        cloud as part of a healthy run.
                    </p>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Your staff handles halted cases first from the local
                        queue. If a case still needs help, OpenAdapt can assist
                        the same business day only when your practice has
                        consented, the payer portal has cleared our access
                        review, and the required privacy terms — including a
                        BAA when applicable — are in place. Assistance is
                        supervised on your computer; patient data is not copied
                        into our cloud. Your compliance officer or counsel
                        makes the legal call for your practice. This describes
                        the operating design, not legal advice.
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
                            On a call, your team verifies representative cases
                            for each proposed payer portal while OpenAdapt
                            records the demonstrations on your machine.
                        </li>
                        <li>
                            We compile that demonstration into a checked,
                            repeatable program and agree on the verification
                            KPI it has to hit.
                        </li>
                        <li>
                            It runs supervised first — your front desk watches
                            it work and uses the ready-to-finish queue when it
                            halts — then it becomes part of the daily routine.
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
                        Founding cohort: 10 practices. $500/mo. Full refund if
                        the signed monthly KPI is missed.
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring the payer portals you check most and a rough
                        monthly verification count. The founding service covers
                        one location, up to three approved portals, and up to
                        600 checks per month.
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
