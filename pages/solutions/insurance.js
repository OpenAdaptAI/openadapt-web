import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import ReferenceDemoShowcase from '@components/ReferenceDemoShowcase'

export default function InsurancePage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Verified Insurance Eligibility Execution | OpenAdapt</title>
                <meta
                    name="description"
                    content="See OpenAdapt compile an openIMIS eligibility demonstration, verify eligible results with independent SQL, and halt when the system record refutes the browser result."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/insurance" />
                <meta property="og:title" content="Verified Insurance Eligibility Execution | OpenAdapt" />
                <meta property="og:description" content="Insurance eligibility demonstrated once, replayed deterministically, and accepted only when an independent system check agrees." />
                <meta property="og:url" content="https://openadapt.ai/solutions/insurance" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    Insurance eligibility execution
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Eligibility checks, demonstrated once, accepted only when
                    the system record agrees.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    See OpenAdapt run the full loop on a real open-source insurance
                    system: a synthetic policyholder and service are looked up in
                    openIMIS, the demonstration is compiled into a governed local
                    program, and the browser result is checked against an
                    independent read-only SQL query.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                    An eligible policy returns VERIFIED. An expired policy whose
                    browser result conflicts with the system record returns
                    HALTED. Both paths use zero model calls and retain exact
                    replay evidence.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                        href="/qualify"
                        className="btn-ink"
                    >
                        Qualify one workflow
                    </Link>
                    <Link
                        href="/"
                        className="btn-ghost-ink"
                    >
                        Back to home
                    </Link>
                </div>
            </div>

            <ReferenceDemoShowcase
                initialIndustry="insurance"
                heading="See the workflow in openIMIS, then compare the same loop across industries"
                intro="Compare the credential-safe source demonstration, the exact VERIFIED replay, and the SQL-refuted fail-safe halt. Every guided overlay is bound to retained runtime frames; Raw footage removes the presentation layer."
            />

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Why the oracle matters here
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        A green banner or populated field proves only what the
                        current screen rendered. In this reference, OpenAdapt
                        accepts eligibility only when a separate read-only SQL
                        query confirms the policy, product, service, and
                        effective-date state. When that independent result
                        disagrees, the run halts instead of reporting success.
                    </p>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Where the execution layer fits
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Eligibility and coverage checks trapped in a portal when
                        no suitable supported API reaches the required workflow.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        A bounded status-update or document-attachment step at
                        the edge of an otherwise API-driven claims pipeline.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Hand QC and compliance an illustrated report of every
                        run: what ran, what it saw, what changed.
                    </li>
                </ul>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Put one claims workflow into production
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring one repeated intake or update step and the claim
                        record that proves its outcome. We&#39;ll map the deployment,
                        verification, shadow run, and supervised rollout.
                    </p>
                    <Link
                        href="/qualify"
                        className="btn-ink mt-5 inline-block"
                    >
                        Qualify one workflow
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}
