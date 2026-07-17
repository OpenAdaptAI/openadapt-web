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
                    content="OpenAdapt is a governed execution layer for RCM vendors, healthcare BPOs, and vertical-software teams that need independently verifiable last-mile writes into browser-accessible legacy systems."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/healthcare" />
                <meta property="og:title" content="Healthcare Last-Mile Execution | OpenAdapt" />
                <meta property="og:description" content="Governed execution for the remaining UI-only step after structured input and healthcare business logic already exist." />
                <meta property="og:url" content="https://openadapt.ai/solutions/healthcare" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    Healthcare execution infrastructure
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Finish structured healthcare workflows inside
                    browser-accessible legacy systems.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    OpenAdapt fits RCM vendors, healthcare BPOs, automation teams,
                    and vertical-software companies that already have structured
                    input and business logic but still need a bounded, repeated
                    write through a GUI. Demonstrate that last-mile step and
                    OpenAdapt compiles it into a locally executable program with
                    explicit identity, effect, policy, and halt semantics.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                    OpenAdapt does not parse referrals, determine eligibility,
                    route patients, or own the end-to-end intake lifecycle. Use a
                    supported API for every reachable operation; qualify the
                    remaining UI-only gap against an independent source of truth.
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
                        Keep the execution boundary explicit
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        Original recordings stay local. If a managed or
                        cross-boundary workflow is enabled, only a sanitized
                        derivative that passes destination policy may upload;
                        policy can require a local reviewer to approve its
                        exact hash first. Live observations can contain PHI
                        again, so they stay inside the declared managed, BYOC,
                        or on-prem trusted runtime boundary. Approved public-web
                        workflows can use the managed path; workflows involving
                        PHI, private systems, or other substrates are qualified
                        inside a customer-controlled deployment. No deployment lane, BAA,
                        or regulated-production readiness is implied by this
                        healthcare reference page.
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
                        can halt when it cannot verify that the live record matches
                        the demonstrated target. This does not cover every click or
                        prove production EMR safety; the linked test cases show the
                        specific OCR ambiguities evaluated and the remaining limits.
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
                            Read what it doesn&#39;t cover →
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
                        Qualify one last-mile workflow
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring one repeated workflow, the application and version,
                        monthly volume, common exceptions, deployment boundary,
                        and the independent source of truth that proves success.
                    </p>
                    <Link
                        href="/#book"
                        className="btn-ink mt-5 inline-block"
                    >
                        Plan a workflow review
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}
