import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import InsuranceWorkflowDemo from '@components/InsuranceWorkflowDemo'

export default function InsurancePage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Insurance Claims Reference — Bounded Browser Workflow Fit | OpenAdapt</title>
                <meta
                    name="description"
                    content="A bounded insurance claims-intake reference: prefer supported APIs, then qualify governed GUI compilation only for the remaining UI-only browser step, verified against the claims database."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/insurance" />
                <meta property="og:title" content="Insurance Claims Reference | OpenAdapt" />
                <meta property="og:description" content="Prefer supported APIs; qualify governed browser GUI compilation only for a remaining UI-only claims-intake gap." />
                <meta property="og:url" content="https://openadapt.ai/solutions/insurance" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    Insurance claims reference
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Claims intake, demonstrated once, replayed exactly — and
                    checked against the claims database.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    This page is a bounded workflow-fit reference, not evidence
                    of a production insurance integration. It shows OpenAdapt
                    running the full loop on a real open-source insurance
                    system: a health-facility claim is entered once in openIMIS,
                    compiled into a governed local program, and replayed with a
                    fresh claim number — with success established only by a
                    direct SQL read of the claim row, never by pixels or
                    self-report.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                    Where a claims platform exposes a supported API, use it —
                    openIMIS itself has one. The browser demonstration isolates
                    the value of compiled replay for claims operations, BPOs,
                    and TPAs whose intake step lives in a portal or claims UI
                    that exposes no such API. OpenAdapt does not adjudicate
                    claims, decide coverage, or own the claims lifecycle.
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

            <InsuranceWorkflowDemo />

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Why the oracle matters here
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        The costly failure in claims operations is not a crash —
                        it is the claim that is silently entered twice, or
                        against the wrong policyholder, and surfaces weeks later
                        in reconciliation. Every run in this reference is
                        accepted only when the claims database shows exactly one
                        new claim row, in status Entered, for the demonstrated
                        policyholder and facility. A duplicate or missing row
                        fails the run loudly instead of reporting success.
                    </p>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Candidate UI-only gaps to qualify
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        First notice of loss or claims intake re-keyed from an
                        existing structured source into a portal or claims UI
                        with no supported API.
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
                        Show us one bounded claims step
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring one residual UI-only intake or update step, after
                        reviewing supported APIs, to a 30-minute call.
                        We&#39;ll map the evidence and qualification it would
                        require in your environment.
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
