import Head from 'next/head'
import Link from 'next/link'

import BenchmarkAttribution from '@components/BenchmarkAttribution'
import Footer from '@components/Footer'

const PAPER_URL = '/openadapt-paper.pdf'
const REPO_URL = 'https://github.com/OpenAdaptAI/openadapt-flow'
const EFFECT_E2E_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/effect_e2e/EFFECT_E2E.md'
const PAPER_TITLE =
    'Compile Once, Govern Every Repair: Deterministic Replay for Repeated GUI Work'

const scholarlyArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: PAPER_TITLE,
    name: PAPER_TITLE,
    url: 'https://openadapt.ai/research',
    inLanguage: 'en',
    author: {
        '@type': 'Person',
        name: 'Richard Abrich',
        email: 'richard@openadapt.ai',
        affiliation: {
            '@type': 'Organization',
            name: 'OpenAdapt (MLDSAI Inc.)',
            url: 'https://openadapt.ai',
        },
    },
    publisher: {
        '@type': 'Organization',
        name: 'MLDSAI Inc.',
        url: 'https://openadapt.ai',
    },
    about: {
        '@type': 'SoftwareApplication',
        name: 'OpenAdapt',
        url: 'https://openadapt.ai',
    },
    abstract:
        'OpenAdapt is a demonstration compiler that converts one recorded GUI trace into a deterministic program. Healthy replay makes no model calls; a resolution ladder repairs targets under interface drift; and system-of-record effect verification refuses rather than trusting a rendered success banner. In an injected-fault study measured end to end through the real replayer, a screen-only oracle silently accepted 75.0% of the wrong effects that actually occurred (54 of 90 runs); one out-of-band record oracle cut that to 12.5% (9 of 90), and a complete system-of-record read path to 0 of 90.',
    isAccessibleForFree: true,
    encoding: {
        '@type': 'MediaObject',
        contentUrl: 'https://openadapt.ai/openadapt-paper.pdf',
        encodingFormat: 'application/pdf',
    },
}

function Stat({ value, label }) {
    return (
        <div className="rounded-2xl border border-hairline bg-panel p-5">
            <div className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                {value}
            </div>
            <div className="mt-1 text-sm leading-relaxed text-ink-2">
                {label}
            </div>
        </div>
    )
}

export default function ResearchPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Research | OpenAdapt technical paper</title>
                <meta
                    name="description"
                    content="Read the OpenAdapt technical paper: compile a demonstrated GUI workflow once, replay it deterministically with no model calls, repair targets under drift, and verify effects against the system of record instead of the screen."
                />
                <link rel="canonical" href="https://openadapt.ai/research" />
                <meta
                    property="og:title"
                    content="OpenAdapt research: Compile Once, Govern Every Repair"
                />
                <meta
                    property="og:description"
                    content="A deterministic replay engine for repeated GUI work, with system-of-record effect verification and refuse-don't-guess governance. Read the paper (PDF)."
                />
                <meta property="og:url" content="https://openadapt.ai/research" />
                <meta property="og:type" content="article" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(scholarlyArticleSchema),
                    }}
                />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">Research</p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Compile Once, Govern Every Repair
                </h1>
                <p className="mt-2 text-base text-ink-3 md:text-lg">
                    Deterministic Replay for Repeated GUI Work
                </p>

                <p className="mt-6 max-w-3xl text-base text-ink-2 md:text-lg">
                    Reasoning through a known workflow on every run is wasteful
                    and unsafe. It adds latency and cost, and&mdash;because a
                    rendered &ldquo;Saved&rdquo; banner is not a persisted
                    write&mdash;it can report success after a partial, duplicate,
                    stale, or rejected business effect. OpenAdapt compiles one
                    recorded demonstration into a deterministic program: healthy
                    replay makes no model calls, a resolution ladder repairs
                    targets when the interface drifts, and the runtime verifies
                    effects against the application&#39;s own system of record
                    rather than the screen&mdash;refusing when it cannot verify.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <a
                        href={PAPER_URL}
                        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 font-medium text-ground transition hover:opacity-90"
                    >
                        Read the paper (PDF)
                    </a>
                    <a
                        href={REPO_URL}
                        className="inline-flex items-center justify-center rounded-full border border-hairline bg-panel px-6 py-2.5 font-medium text-ink transition hover:border-ink-3"
                    >
                        Code &amp; artifacts on GitHub
                    </a>
                </div>

                <h2 className="mt-14 font-display text-xl font-semibold tracking-tight text-ink">
                    The headline result
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    We injected ten transaction-fault classes behind a real HTTP
                    boundary and replayed each nine times per arm&mdash;90 runs
                    per arm, end to end through the actual replayer into an
                    on-disk SQLite system of record, graded by a direct
                    read-only database connection that bypasses the service
                    entirely. Judged by the screen&mdash;the same signal a
                    computer-use agent or an RPA script trusts&mdash;replay
                    silently accepted <strong className="text-ink">75.0%</strong>{' '}
                    of the wrong effects that actually occurred. Adding{' '}
                    <strong className="text-ink">one</strong> out-of-band oracle
                    that reads the system of record cut that to{' '}
                    <strong className="text-ink">12.5%</strong>. That middle rung
                    is the number a real deployment ships.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat
                        value="54 / 90"
                        label="wrong effects silently accepted by screen-only verification — 75.0% of the runs where a wrong effect actually persisted"
                    />
                    <Stat
                        value="9 / 90"
                        label="silently accepted once one out-of-band system-of-record oracle is configured — 12.5%, the realistic deployment number"
                    />
                    <Stat
                        value="0 / 90"
                        label="silently accepted under a complete read path over every mutable surface — the best case under full in-database instrumentation, not the expected field result"
                    />
                    <Stat
                        value="0 model calls"
                        label="on the healthy replay path; models are optional repair tiers, not the controller"
                    />
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    All nine residual misses are one named class: a collateral
                    write to a surface the oracle&#39;s read path does not cover.
                    An out-of-band oracle catches exactly what its read path can
                    read, and widening that path closes the gap. Full method,
                    per-fault outcomes, and the closed-world caveat on the 0 are
                    in{' '}
                    <a
                        href={EFFECT_E2E_URL}
                        className="text-accent hover:underline"
                    >
                        the end-to-end effect study
                    </a>
                    .
                </p>

                <h2 className="mt-14 font-display text-xl font-semibold tracking-tight text-ink">
                    What the paper reports
                </h2>
                <BenchmarkAttribution className="mt-4 max-w-3xl" />
                <ul className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    <li>
                        <strong className="text-ink">
                            Compiled replay vs. a computer-use agent.
                        </strong>{' '}
                        On an already-demonstrated OpenEMR task, compiled replay
                        completed 20/20 runs at a 39.2&nbsp;s median with no model
                        calls, versus the agent&#39;s 70.4&nbsp;s and
                        $0.55/run. On the bundled CI fixture, 100/100 at
                        4.9&nbsp;s versus 37.5&nbsp;s.
                    </li>
                    <li>
                        <strong className="text-ink">Repair under drift.</strong>{' '}
                        When a theme re-render invalidated every recorded template
                        crop, compiled replay self-healed in 9.7&nbsp;s with 8
                        target repairs and zero model calls, while the same agent
                        under the same drift took 87.4&nbsp;s and $0.63.
                    </li>
                    <li>
                        <strong className="text-ink">
                            Identity before action.
                        </strong>{' '}
                        Against adversarial look-alike records (O/0, l/1), the
                        identity ladder recorded zero false accepts in every
                        tested configuration&mdash;halting rather than clicking a
                        confusable target.
                    </li>
                    <li>
                        <strong className="text-ink">
                            One governed contract, many substrates.
                        </strong>{' '}
                        The same semantics drive browser, native Windows UI
                        Automation, native macOS, and real-network RDP tasks,
                        each with an independent effect oracle and explicit
                        refusal controls.
                    </li>
                </ul>

                <h2 className="mt-14 font-display text-xl font-semibold tracking-tight text-ink">
                    Reproducibility
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    Every headline number in the paper is bound by a
                    machine-check to a released raw benchmark file: the build
                    fails if a constant in the text drifts from its artifact. The
                    implementation, the raw run data, and the failure taxonomy
                    are published together in the{' '}
                    <a
                        href={REPO_URL}
                        className="text-accent hover:underline"
                    >
                        openadapt-flow
                    </a>{' '}
                    repository. This is a technical report; see the paper for the
                    exact scope of each measured result and its limitations.
                </p>

                <p className="mt-10 text-sm text-ink-3">
                    <Link href="/" className="text-accent hover:underline">
                        &larr; Back to openadapt.ai
                    </Link>
                </p>
            </div>

            <Footer />
        </div>
    )
}
