import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import LendingWorkflowDemo from '@components/LendingWorkflowDemo'

export default function LendingPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Verified Last-Mile Lending Operations | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt turns repeated lending UI work into deterministic, governed execution with independent verification of the resulting write."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/lending" />
                <meta property="og:title" content="Verified Last-Mile Lending Operations | OpenAdapt" />
                <meta property="og:description" content="Deterministic, governed execution for the final lending workflow step trapped behind a user interface." />
                <meta property="og:url" content="https://openadapt.ai/solutions/lending" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    Lending operations
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Move lending operations through the final UI-only mile.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    Keep supported APIs and exports as the primary integration
                    path. When a repeated lending operation still ends in a form,
                    portal, or work queue, demonstrate that last-mile step once.
                    OpenAdapt compiles it into a governed local program whose
                    healthy runs make no model calls and whose business effect can
                    be checked independently.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                        href="/#book"
                        className="btn-ink"
                    >
                        Evaluate a workflow
                    </Link>
                    <Link
                        href="/"
                        className="btn-ghost-ink"
                    >
                        Back to home
                    </Link>
                </div>
            </div>

            <LendingWorkflowDemo />

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Keep borrower data inside its declared boundary
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
                    Where the execution layer fits
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Complete a repeated application, servicing, or operations
                        step that remains after supported APIs and exports.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Compile the demonstrated UI step for the approved queue,
                        form, or portal inside its declared execution boundary.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Hand QC and compliance an illustrated report of every
                        run: what ran, what it saw, what changed.
                    </li>
                </ul>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Put one lending workflow into production
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring one repeated UI-only step and the system of record
                        that proves its outcome. We&#39;ll map the deployment,
                        verification, shadow run, and supervised rollout.
                    </p>
                    <Link
                        href="/#book"
                        className="btn-ink mt-5 inline-block"
                    >
                        Evaluate a workflow
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}
