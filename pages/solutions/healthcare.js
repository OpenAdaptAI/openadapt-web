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
                    content="OpenAdapt compiles a recorded demonstration of referral intake or EMR data entry into a self-healing automation that runs inside your clinic. PHI never leaves your machines. Web EMRs today, with desktop and VDI adapters in progress."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/healthcare" />
                <meta property="og:title" content="Healthcare Clinic Automation | OpenAdapt" />
                <meta property="og:description" content="Referral intake and EMR data entry, compiled from a demonstration and run entirely inside your clinic." />
                <meta property="og:url" content="https://openadapt.ai/solutions/healthcare" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    OpenAdapt for healthcare clinics
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Referrals arrive by fax. Your staff retypes them into the
                    EMR. OpenAdapt does the retyping.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    Record the intake workflow once (open the referral, read
                    the fields, enter them into the EMR) and OpenAdapt
                    compiles it into an automation your clinic runs on its own
                    machines. Healthy runs make no cloud model calls, and when
                    the EMR&#39;s screens change, the fix arrives as a
                    reviewable diff, not a support ticket.
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
                        PHI never leaves the clinic. OpenAdapt is local-first
                        by architecture: recordings, compiled scripts, and
                        replays all stay on your own infrastructure, and
                        PII/PHI scrubbing tooling is included. Because it
                        works from the screen rather than browser internals,
                        the same vision-based approach is designed to reach the
                        desktop and VDI EMRs that cloud automation tools
                        can&#39;t. Web EMRs are supported today, and those
                        desktop and VDI adapters are in progress.
                    </p>
                </div>

                <div
                    className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                    style={{ borderLeft: '4px solid var(--accent)' }}
                >
                    <p className="eyebrow">The wrong-patient defense</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                        Certified workflows halt before writing to the wrong
                        patient.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        The one catastrophe in EMR automation is writing to the
                        wrong chart. On legacy and Citrix EMRs the software
                        reads the screen as text, so two patients&#39;
                        record numbers can differ by a single look-alike
                        character it can&#39;t tell apart. On armed steps, when a
                        certified workflow can&#39;t prove the row on screen is
                        the recorded patient, it halts and hands the step to a
                        person. The check covers steps that carry a patient
                        identity, not every click; coverage is auditable per step
                        and reported in every run. We show it working case by
                        case, from real renders and the real check, and we
                        disclose what it doesn&#39;t cover.
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
                        Turn a recorded referral-intake session into an
                        automation that reads incoming referral documents and
                        enters the fields into your EMR.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Extract encounter, billing, or scheduling data out of
                        the EMR into spreadsheets and portals without
                        copy-paste.
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
                        15-minute call and we&#39;ll map what compiling it
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
