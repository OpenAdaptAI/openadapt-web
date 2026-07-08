import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import HowItWorks from '@components/HowItWorks'

export default function LendingPage() {
    return (
        <div className="min-h-screen bg-[#06061f] text-white">
            <Head>
                <title>Mortgage & Lending Automation — Loan-File Data Entry in Encompass | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt compiles a recorded demonstration of loan-file data entry into a self-healing automation that runs in your own environment. Works with desktop LOS software like Encompass; borrower data stays with you."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/lending" />
                <meta property="og:title" content="Mortgage & Lending Automation | OpenAdapt" />
                <meta property="og:description" content="Loan-file data entry and extraction, compiled from a demonstration and run entirely in your environment." />
                <meta property="og:url" content="https://openadapt.ai/solutions/lending" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="text-sm font-medium uppercase tracking-widest text-[#60a5fa]">
                    OpenAdapt for mortgage &amp; lending ops
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                    Your team copies the same loan-file data between documents
                    and Encompass all day. OpenAdapt compiles that workflow
                    once.
                </h1>
                <p className="mt-5 max-w-3xl text-base font-light text-white/75 md:text-lg">
                    Record one pass of the task — open the loan documents,
                    find the fields, enter them into the LOS — and OpenAdapt
                    compiles it into a deterministic automation that runs on
                    your own machines. Healthy runs make no cloud model calls,
                    and when an LOS screen changes, the fix is proposed as a
                    reviewable diff.
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
                        Borrower data stays in your environment. OpenAdapt is
                        local-first by architecture: recordings, compiled
                        scripts, and replays never leave your infrastructure,
                        and PII scrubbing tooling is included. Because it
                        works from the screen, it operates desktop LOS
                        software like Encompass directly — no API integration
                        project required.
                    </p>
                </div>

                <h2 className="mt-12 text-xl font-medium tracking-tight text-white/95">
                    What a lending team can compile
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-light leading-relaxed text-white/75 md:text-base">
                        Turn a recorded loan-file session into an automation
                        that moves borrower data between documents and your
                        LOS screens.
                    </li>
                    <li className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-light leading-relaxed text-white/75 md:text-base">
                        Extract fields from loan documents into Encompass —
                        and pull data back out for disclosures, portals, and
                        spreadsheets.
                    </li>
                    <li className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-light leading-relaxed text-white/75 md:text-base">
                        Hand QC and compliance an illustrated report of every
                        run: what ran, what it saw, what changed.
                    </li>
                </ul>

                <div className="mt-12 rounded-2xl border border-[#560df8]/40 bg-[#560df8]/10 p-6 text-center md:p-8">
                    <h2 className="text-xl font-medium tracking-tight text-white/95">
                        Show us one loan-file workflow
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm font-light text-white/75 md:text-base">
                        Bring your highest-volume data-entry task to a
                        15-minute call and we&#39;ll map what compiling it
                        would look like in your environment.
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
