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
                    content="OpenAdapt compiles demonstrated loan-file workflows into governed automation. Original recordings stay local; approved sanitized derivatives may cross a declared boundary. Browser workflows are supported; native LOS automation remains experimental."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/lending" />
                <meta property="og:title" content="Mortgage & Lending Automation | OpenAdapt" />
                <meta property="og:description" content="Loan-file data entry and extraction compiled from a demonstration, with explicit artifact and runtime data boundaries." />
                <meta property="og:url" content="https://openadapt.ai/solutions/lending" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    OpenAdapt for mortgage &amp; lending ops
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Your team repeats the same borrower-data entry across browser
                    queues, forms, and portals. Compile the workflow once.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    Record a repeated browser task once and OpenAdapt compiles it
                    into a local program. Healthy runs make no model calls. When
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
                        derivative admitted by destination policy may upload;
                        policy can require local review and approval of its
                        exact hash. Live observations can contain borrower
                        data again, so they remain inside the declared managed,
                        BYOC, or on-prem trusted runtime boundary. Browser
                        workflows are the supported path today. Native desktop
                        LOS automation, including Encompass, is experimental
                        and must be qualified rather than assumed.
                    </p>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    What a lending team can compile
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Replay a demonstrated borrower-data workflow across
                        approved browser queues, forms, portals, and LOS pages.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Move demonstrated fields between browser-accessible LOS,
                        disclosure, portal, and spreadsheet workflows.
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
