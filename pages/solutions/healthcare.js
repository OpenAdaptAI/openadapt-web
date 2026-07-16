import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import HowItWorks from '@components/HowItWorks'

export default function HealthcarePage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Healthcare Clinic Automation — Referral Intake & EMR Data Entry | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt compiles demonstrated referral-intake and EMR workflows into governed automation. Original recordings stay local; approved sanitized derivatives may cross a declared boundary. Browser EMRs are the supported path; desktop and VDI remain experimental."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/healthcare" />
                <meta property="og:title" content="Healthcare Clinic Automation | OpenAdapt" />
                <meta property="og:description" content="Referral intake and EMR data entry compiled from a demonstration, with explicit artifact and runtime data boundaries." />
                <meta property="og:url" content="https://openadapt.ai/solutions/healthcare" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    OpenAdapt for healthcare clinics
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Your team repeats the same browser-based intake work all day.
                    Compile one demonstrated workflow for governed replay.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    Record a repeated browser workflow once and OpenAdapt compiles
                    it into a local program. Healthy runs make no model calls. When
                    the interface changes, OpenAdapt can re-resolve from evidence,
                    propose a reviewable repair, or halt for an operator.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                        href="/#book"
                        className="btn-ink"
                    >
                        Book a demo
                    </Link>
                    <Link
                        href="/"
                        className="btn-ghost-ink"
                    >
                        Back to home
                    </Link>
                </div>
            </div>

            <HowItWorks />

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Why local matters here
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        Original recordings stay local. If a hosted or
                        cross-boundary workflow is enabled, only a sanitized
                        derivative that passes destination policy may upload;
                        policy can require a local reviewer to approve its
                        exact hash first. Live observations can contain PHI
                        again, so they stay inside the declared managed, BYOC,
                        or on-prem trusted runtime boundary. Browser EMRs are
                        the supported path today. Native desktop is
                        experimental, and VDI/Citrix remains research rather
                        than a validated production claim.
                    </p>
                </div>

                <div
                    className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                    style={{ borderLeft: '4px solid var(--accent)' }}
                >
                    <p className="eyebrow">The wrong-patient defense</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                        Require identity evidence before a consequential write.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        Wrong-record writes are a critical automation risk. For a
                        step configured with patient identity evidence, OpenAdapt
                        can halt when it cannot verify that the live record matches
                        the demonstrated target. This does not cover every click or
                        prove production EMR safety; the linked test cases show the
                        specific OCR ambiguities evaluated and the remaining limits.
                    </p>
                    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        <Link href="/safety" className="font-medium">
                            See the wrong-patient defense →
                        </Link>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/LIMITS.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium"
                        >
                            Read what it doesn&#39;t cover →
                        </a>
                    </p>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    What a clinic can compile
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Replay a demonstrated browser intake workflow across an
                        approved queue, form, and browser-accessible EMR path.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Move demonstrated fields between browser-accessible
                        scheduling, billing, spreadsheet, and portal workflows.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Give your compliance lead an illustrated report of
                        every run: what ran, what it saw, what changed.
                    </li>
                </ul>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Show us one intake workflow
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring your highest-volume retyping task to a
                        30-minute call and we&#39;ll map what compiling it
                        would look like in your clinic.
                    </p>
                    <Link
                        href="/#book"
                        className="btn-ink mt-5 inline-block"
                    >
                        Book a demo
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}
