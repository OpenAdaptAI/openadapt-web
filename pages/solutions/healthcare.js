import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import HowItWorks from '@components/HowItWorks'

export default function HealthcarePage() {
    return (
        <div className="min-h-screen bg-[#06061f] text-white">
            <Head>
                <title>Healthcare Clinic Automation — Referral Intake & EMR Data Entry | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt compiles a recorded demonstration of referral intake or EMR data entry into a self-healing automation that runs inside your clinic. PHI never leaves your machines; desktop and VDI EMRs included."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/healthcare" />
                <meta property="og:title" content="Healthcare Clinic Automation | OpenAdapt" />
                <meta property="og:description" content="Referral intake and EMR data entry, compiled from a demonstration and run entirely inside your clinic." />
                <meta property="og:url" content="https://openadapt.ai/solutions/healthcare" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="text-sm font-medium uppercase tracking-widest text-[#60a5fa]">
                    OpenAdapt for healthcare clinics
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                    Referrals arrive by fax. Your staff retypes them into the
                    EMR. OpenAdapt does the retyping.
                </h1>
                <p className="mt-5 max-w-3xl text-base font-light text-white/75 md:text-lg">
                    Record the intake workflow once — open the referral, read
                    the fields, enter them into the EMR — and OpenAdapt
                    compiles it into a deterministic automation your clinic
                    runs on its own machines. Healthy runs make no cloud model
                    calls, and when the EMR&#39;s screens change, the fix
                    arrives as a reviewable diff, not a support ticket.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                        href="/#book"
                        className="rounded-lg bg-[#560df8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7132d4]"
                    >
                        Book a demo
                    </Link>
                    <Link
                        href="/"
                        className="rounded-lg border border-white/20 px-5 py-2.5 text-sm text-white/90 transition hover:border-white/40 hover:bg-white/5"
                    >
                        Back to home
                    </Link>
                </div>
            </div>

            <HowItWorks />

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                    <h2 className="text-xl font-medium tracking-tight text-white/95">
                        Why local matters here
                    </h2>
                    <p className="mt-3 text-sm font-light leading-relaxed text-white/75 md:text-base">
                        PHI never leaves the clinic. OpenAdapt is local-first
                        by architecture: recordings, compiled scripts, and
                        replays all stay on your own infrastructure, and
                        PII/PHI scrubbing tooling is included. Because it
                        works from the screen rather than browser internals,
                        it operates desktop and VDI EMRs that cloud automation
                        tools can&#39;t reach.
                    </p>
                </div>

                <h2 className="mt-12 text-xl font-medium tracking-tight text-white/95">
                    What a clinic can compile
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-light leading-relaxed text-white/75 md:text-base">
                        Turn a recorded referral-intake session into an
                        automation that reads incoming referral documents and
                        enters the fields into your EMR.
                    </li>
                    <li className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-light leading-relaxed text-white/75 md:text-base">
                        Extract encounter, billing, or scheduling data out of
                        the EMR into spreadsheets and portals without
                        copy-paste.
                    </li>
                    <li className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-light leading-relaxed text-white/75 md:text-base">
                        Give your compliance lead an illustrated report of
                        every run: what ran, what it saw, what changed.
                    </li>
                </ul>

                <div className="mt-12 rounded-2xl border border-[#560df8]/40 bg-[#560df8]/10 p-6 text-center md:p-8">
                    <h2 className="text-xl font-medium tracking-tight text-white/95">
                        Show us one intake workflow
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm font-light text-white/75 md:text-base">
                        Bring your highest-volume retyping task to a
                        15-minute call and we&#39;ll map what compiling it
                        would look like in your clinic.
                    </p>
                    <Link
                        href="/#book"
                        className="mt-5 inline-block rounded-lg bg-[#560df8] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#7132d4]"
                    >
                        Book a demo
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}
