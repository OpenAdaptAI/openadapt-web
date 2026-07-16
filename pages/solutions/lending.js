import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

export default function LendingPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Lending Operations Reference — Bounded Browser Workflow Fit | OpenAdapt</title>
                <meta
                    name="description"
                    content="A bounded lending-operations reference: prefer supported APIs, then qualify governed GUI compilation only for remaining UI-only browser gaps."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/lending" />
                <meta property="og:title" content="Lending Operations Reference | OpenAdapt" />
                <meta property="og:description" content="Prefer supported APIs; qualify governed browser GUI compilation only for a remaining UI-only workflow gap." />
                <meta property="og:url" content="https://openadapt.ai/solutions/lending" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    Lending operations reference
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Prefer supported APIs. Qualify GUI compilation only for the
                    remaining UI-only browser gap.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    This page is a bounded workflow-fit reference, not evidence of
                    a production lending integration. Where an application exposes
                    a supported API or export, use it. For a residual browser-only
                    step, OpenAdapt can compile a demonstrated task into a governed
                    local program whose healthy runs make no model calls.
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
                        lending workflow. This page describes candidate workflow fit;
                        lending-specific fixtures, results, and media will appear only
                        after the bounded task and success oracle are reproducible.
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
                        workflows use the managed path; any private or
                        deployment-specific UI-only gap is qualified inside a
                        customer-controlled deployment.
                    </p>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Candidate UI-only gaps to qualify
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        After exhausting supported APIs and exports, identify one
                        bounded browser step with a clear success oracle.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Compile that demonstrated UI-only step for an approved
                        browser queue, form, or portal inside its declared boundary.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Hand QC and compliance an illustrated report of every
                        run: what ran, what it saw, what changed.
                    </li>
                </ul>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Show us one bounded browser gap
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring one residual UI-only step, after reviewing supported
                        APIs, to a 30-minute call. We&#39;ll map the evidence and
                        qualification it would require in your environment.
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
