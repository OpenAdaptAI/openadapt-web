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
                    content="OpenAdapt compiles a recorded demonstration of referral intake or EMR data entry into a self-healing automation that runs inside your environment. Web, desktop, and Citrix EMRs. Deployed on-prem or managed by us inside your own VPC, so PHI never enters our infrastructure."
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
                    compiles it into an automation your clinic runs inside its
                    own environment, whether the EMR is a web app, a Windows
                    desktop, or delivered over Citrix. Healthy runs make no
                    cloud model calls, and when the EMR&#39;s screens change,
                    the automation halts, a reviewer teaches the fix, and it is
                    promoted into the workflow as a reviewable diff, not a
                    support ticket.
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
                        Your data stays in your environment
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        For regulated workloads you deploy OpenAdapt one of two
                        ways: fully on-prem and air-gapped, or managed by us
                        inside your own cloud (single-tenant BYOC). Either way,
                        recordings, compiled scripts, replays, and the model
                        that heals them all run inside your perimeter, and PHI
                        never enters our infrastructure. We see only PHI-free
                        run metadata (status, timings, counts), and we sign a
                        BAA for the engagement. Because OpenAdapt works from the
                        screen rather than browser internals, it reaches web,
                        Windows-desktop, and Citrix EMRs alike, including the
                        legacy systems cloud automation tools can&#39;t touch.
                    </p>
                </div>

                <div
                    className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                    style={{ borderLeft: '4px solid var(--accent)' }}
                >
                    <p className="eyebrow">The wrong-patient defense</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                        It halts before it writes to the wrong patient.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        The one catastrophe in EMR automation is writing to the
                        wrong chart. On legacy and Citrix EMRs the software
                        reads the screen as text, so two patients&#39;
                        record numbers can differ by a single look-alike
                        character it can&#39;t tell apart. When OpenAdapt
                        can&#39;t prove the row on screen is the recorded
                        patient, it stops and hands the step to a person. We
                        show it working case by case, from real renders and the
                        real check, and we disclose what it doesn&#39;t cover.
                    </p>
                    <Link
                        href="/safety"
                        className="mt-4 inline-block text-sm font-medium"
                    >
                        See the wrong-patient defense →
                    </Link>
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

                <div className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <p className="eyebrow">Fail-closed by default</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                        A regulated run refuses to start unless it is safe.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        In regulated mode, OpenAdapt will not touch a chart
                        unless the workflow is a certified, signed bundle, every
                        write step declares the effect it must verify on screen,
                        identity coverage is complete, and the configuration is
                        pinned to a reviewed version. If any of those is missing,
                        it refuses to run rather than proceed unchecked.
                    </p>
                </div>

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
