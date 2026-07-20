import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

const PAPER_URL = '/openadapt-paper.pdf'
const REPO_URL = 'https://github.com/OpenAdaptAI/openadapt-flow'
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
        '@type': 'Organization',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
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
        'OpenAdapt is a demonstration compiler that converts one recorded GUI trace into a deterministic program. Healthy replay makes no model calls; a resolution ladder repairs targets under interface drift; and system-of-record effect verification refuses rather than trusting a rendered success banner. In an injected-fault study, screen-only verification silently accepted 50 of 90 fault runs while an effect check caught every one.',
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
                    We injected seven persistence faults behind a real HTTP
                    boundary and ran each ten times. Judged by the
                    screen&mdash;the same signal a computer-use agent or an RPA
                    script trusts&mdash;replay silently accepted 50 of 90 wrong
                    outcomes. When the consequential step declared a typed effect
                    checked against the system of record, silent acceptance fell
                    to zero.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Stat
                        value="50 / 90"
                        label="fault runs silently accepted by screen-only verification (5 of 7 fault classes)"
                    />
                    <Stat
                        value="0 / 90"
                        label="silently accepted once a system-of-record effect check was configured"
                    />
                    <Stat
                        value="0 model calls"
                        label="on the healthy replay path; models are optional repair tiers, not the controller"
                    />
                </div>

                <h2 className="mt-14 font-display text-xl font-semibold tracking-tight text-ink">
                    What the paper reports
                </h2>
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
