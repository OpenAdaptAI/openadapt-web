import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

export default function LendingPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Mortgage & Lending Automation — Loan-File Data Entry | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt compiles demonstrated browser-based loan-file workflows into governed automation, with customer-controlled deployment options for private and regulated runtime boundaries."
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
                    queues, forms, and portals. Compile a bounded demonstration.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    Demonstrate a bounded browser task and OpenAdapt compiles it
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

            <section
                data-testid="lending-evidence-placeholder"
                className="border-y border-hairline bg-panel px-4 py-12"
            >
                <div className="mx-auto max-w-4xl">
                    <p className="eyebrow">Lending evidence status</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                        Lending-specific workflow media is awaiting oracle verification
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        We do not reuse healthcare or OpenEMR footage as proof of a
                        lending workflow. This page describes the intended workflow
                        fit; lending-specific fixtures, results, and media will appear
                        only after the task and success oracle are reproducible.
                    </p>
                    <Link href="/compare#benchmark-evidence" className="mt-4 inline-block text-sm text-accent underline">
                        Review the current published evidence method
                    </Link>
                </div>
            </section>

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
                        workflows use the managed path; private or
                        deployment-specific LOS workflows are qualified inside
                        a customer-controlled deployment.
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
