import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import HowItWorks from '@components/HowItWorks'

export default function HealthcarePage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Healthcare Last-Mile Execution for RCM, BPO & Software Teams | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt is the governed execution layer for RCM vendors, healthcare BPOs, and vertical-software teams that need independently verifiable last-mile writes into legacy systems."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/healthcare" />
                <meta property="og:title" content="Healthcare Last-Mile Execution | OpenAdapt" />
                <meta property="og:description" content="Governed last-mile execution after structured input and healthcare business logic are ready." />
                <meta property="og:url" content="https://openadapt.ai/solutions/healthcare" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    Healthcare execution infrastructure
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Finish structured healthcare workflows inside legacy systems.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    OpenAdapt fits RCM vendors, healthcare BPOs, automation teams,
                    and vertical-software companies that already have structured
                    input and business logic but still need a repeated write
                    through a GUI. Demonstrate that last-mile step and
                    OpenAdapt compiles it into a locally executable program with
                    explicit identity, effect, policy, and halt semantics.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                    Keep document processing, eligibility, routing, and business
                    rules in the systems that already do them well. Use supported
                    APIs wherever possible, then give OpenAdapt the final UI-only
                    write and verify its effect against an independent source of
                    truth.
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

            <HowItWorks />

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Choose the right execution boundary
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        Original recordings stay local. If a managed or
                        cross-boundary workflow is enabled, only a sanitized
                        derivative that passes destination policy may upload;
                        policy can require a local reviewer to approve its
                        exact hash first. Live observations can contain PHI
                        again, so they stay inside the declared managed, BYOC,
                        or on-prem trusted runtime boundary. Approved public-web
                        workflows use the managed path; workflows involving PHI,
                        private systems, or desktop and remote substrates run
                        inside a scoped customer-controlled deployment with the
                        required written terms.
                    </p>
                </div>

                <div
                    className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                    style={{ borderLeft: '4px solid var(--accent)' }}
                >
                    <p className="eyebrow">The wrong-patient defense</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                        Require identity evidence before a consequential write.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        Wrong-record writes are a critical automation risk. For a
                        step configured with patient identity evidence, OpenAdapt
                        halts when it cannot verify that the live record matches
                        the demonstrated target. The public safety gallery shows
                        the exact look-alike record cases behind this defense.
                    </p>
                    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        <Link href="/safety" className="font-medium">
                            See the wrong-patient defense →
                        </Link>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/LIMITS.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium"
                        >
                            Review the runtime safety model →
                        </a>
                    </p>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Where the execution layer fits
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Write approved output from an existing intake, RCM, or
                        operations pipeline into the remaining browser-only form.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Prefer supported APIs for reads and writes, then use
                        governed GUI replay only where the target exposes no
                        suitable integration path.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        Check the intended business effect independently, retain
                        an illustrated run report, and halt on ambiguous identity
                        or unverifiable outcome.
                    </li>
                </ul>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Put one last-mile workflow into production
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring one repeated workflow, its application and version,
                        monthly volume, common exceptions, and independent success
                        oracle. We&#39;ll map the deployment boundary, shadow run, and
                        supervised production rollout.
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
