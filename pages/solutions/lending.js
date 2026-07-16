import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import HowItWorks from '@components/HowItWorks'

export default function LendingPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Mortgage & Lending Automation — Loan-File Data Entry | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt compiles a recorded demonstration of loan-file data entry into a self-healing automation that runs in your own environment. Vision-based and designed to reach desktop LOS software like Encompass; borrower data stays with you."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/lending" />
                <meta property="og:title" content="Mortgage & Lending Automation | OpenAdapt" />
                <meta property="og:description" content="Loan-file data entry and extraction, compiled from a demonstration and run entirely in your environment." />
                <meta property="og:url" content="https://openadapt.ai/solutions/lending" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    OpenAdapt for mortgage &amp; lending ops
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Your team copies the same loan-file data between documents
                    and Encompass all day. OpenAdapt is built to compile that
                    workflow once.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    Record one pass of the task (open the loan documents,
                    find the fields, enter them into the LOS) and OpenAdapt
                    compiles it into an automation that runs on your own
                    machines. Healthy runs make no cloud model calls, and when
                    an LOS screen changes, the fix is proposed as a reviewable
                    diff.
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
                        Borrower data stays in your environment. OpenAdapt is
                        local-first by architecture: recordings, compiled
                        scripts, and replays never leave your infrastructure,
                        and PII scrubbing tooling is included. Because it
                        works from the screen rather than an API, the same
                        vision-based approach is designed to reach desktop LOS
                        software like Encompass without an API integration
                        project. Web workflows are supported today, and that
                        desktop adapter is in progress.
                    </p>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    What a lending team can compile
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Turn a recorded loan-file session into an automation
                        that moves borrower data between documents and your
                        LOS screens.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Extract fields from loan documents into your LOS, and
                        pull data back out for disclosures, portals, and
                        spreadsheets.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Hand QC and compliance an illustrated report of every
                        run: what ran, what it saw, what changed.
                    </li>
                </ul>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Show us one loan-file workflow
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring your highest-volume data-entry task to a
                        30-minute call and we&#39;ll map what compiling it
                        would look like in your environment.
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
