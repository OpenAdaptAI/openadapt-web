import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import BenchmarkCharts from '@components/BenchmarkCharts'
import Faq, { faqItems } from '@components/Faq'
import benchmark from '../data/benchmark.json'

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
        },
    })),
}

const description =
    'See when OpenAdapt, traditional RPA, computer-use agents, or browser recorders fit repeated GUI work. Compare authoring, run economics, change handling, verification, and deployment.'

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'OpenAdapt compared with RPA and computer-use agents',
    url: 'https://openadapt.ai/compare',
    description,
    isPartOf: {
        '@type': 'WebSite',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    about: {
        '@type': 'SoftwareApplication',
        name: 'OpenAdapt',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
}

const outcomes = [
    {
        title: 'Predictable repeat economics',
        body: 'Healthy replay is deterministic and uses no model calls. Model spend is reserved for compilation or repair.',
    },
    {
        title: 'Review reusable change',
        body: 'A repair updates the reusable workflow instead of asking a model to rediscover the task on every run.',
    },
    {
        title: 'Know when it stopped',
        body: 'Configured identity and effect checks halt ambiguous work and preserve a run report for review.',
    },
    {
        title: 'Control the runtime boundary',
        body: 'Choose local, managed cloud, customer-controlled, or on-prem execution for the workflow.',
    },
]

const rows = [
    {
        dimension: 'Best fit',
        openadapt: 'Repeated, consequential GUI workflows without a practical API',
        rpa: 'Broad enterprise automation with mature connectors and orchestration',
        agents: 'Novel or changing tasks that benefit from reasoning each time',
        browser: 'Simple browser workflows and test automation',
    },
    {
        dimension: 'Authoring',
        openadapt: 'Record a task; compile the demonstration',
        rpa: 'Build selectors, rules, and flowcharts',
        agents: 'Describe the goal and configure tools and guardrails',
        browser: 'Record steps or write a script or prompt',
    },
    {
        dimension: 'Healthy repeat run',
        openadapt: 'Deterministic replay; no model calls',
        rpa: 'Deterministic replay; platform licensing applies',
        agents: 'A model plans and acts on every run',
        browser: 'Fixed or model-driven replay, depending on the tool',
    },
    {
        dimension: 'When the UI changes',
        openadapt: 'Re-resolve from evidence, propose a repair, or halt',
        rpa: 'Repair selectors and workflow logic',
        agents: 'Reason through the changed interface',
        browser: 'Repair selectors or let a model re-infer',
    },
    {
        dimension: 'Failure control',
        openadapt: 'Configured identity and effect checks can halt and preserve a report',
        rpa: 'Depends on configured platform controls',
        agents: 'Depends on the agent platform and its guardrails',
        browser: 'Depends on the tool and script',
    },
    {
        dimension: 'Execution boundary',
        openadapt: 'Local, managed cloud, customer cloud, or on-prem',
        rpa: 'Customer infrastructure or vendor cloud',
        agents: 'Local or cloud, depending on the provider',
        browser: 'Browser with local or cloud services',
    },
    {
        dimension: 'Best-fit scope',
        openadapt: 'Repeated GUI workflows with local, managed, or customer-controlled execution',
        rpa: 'Mature desktop and browser coverage',
        agents: 'Broad screen coverage; provider-specific',
        browser: 'Browser only',
    },
]

export default function ComparePage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>OpenAdapt vs RPA and computer-use agents | OpenAdapt</title>
                <meta name="description" content={description} />
                <link rel="canonical" href="https://openadapt.ai/compare" />
                <meta
                    property="og:title"
                    content="OpenAdapt vs RPA and computer-use agents"
                />
                <meta property="og:description" content={description} />
                <meta property="og:url" content="https://openadapt.ai/compare" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webPageSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqSchema),
                    }}
                />
            </Head>

            <main className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">Automation decision guide</p>
                <h1 className="font-display mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                    Choose repeatable automation for work that repeats.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-2 md:text-lg">
                    OpenAdapt compiles a demonstrated GUI workflow into
                    governed replay. Healthy runs are deterministic and make no
                    model calls. When the interface changes, the workflow
                    re-resolves from evidence, proposes a reviewable repair, or
                    halts.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <a href="#side-by-side" className="btn-ink">
                        Compare approaches
                    </a>
                    <a href="#benchmark-evidence" className="btn-ghost-ink">
                        See measured results
                    </a>
                </div>

                <section className="mt-14" aria-labelledby="fit-heading">
                    <p className="eyebrow">Where OpenAdapt fits</p>
                    <h2
                        id="fit-heading"
                        className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                    >
                        Built for consequential work trapped behind a GUI.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        The strongest fit is a GUI workflow your team repeats,
                        where the business intent stays stable, a wrong action
                        matters, and a direct integration is not practical.
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {outcomes.map((outcome) => (
                            <article
                                key={outcome.title}
                                className="rounded-2xl border border-hairline bg-panel p-5"
                            >
                                <h3 className="font-display text-lg font-semibold text-ink">
                                    {outcome.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {outcome.body}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section
                    id="side-by-side"
                    className="mt-14 scroll-mt-8"
                    aria-labelledby="side-by-side-heading"
                >
                    <p className="eyebrow">Side by side</p>
                    <h2
                        className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                    >
                        Choose by the operating model you need.
                    </h2>
                    <p className="mt-3 text-sm text-ink-3 md:hidden">
                        Scroll horizontally to compare all approaches.
                    </p>
                    <div
                        className="mt-5 overflow-x-auto rounded-2xl border border-hairline bg-panel"
                        role="region"
                        aria-labelledby="side-by-side-heading"
                        tabIndex={0}
                    >
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <caption className="sr-only">
                                OpenAdapt compared with traditional RPA,
                                computer-use agents, and browser recorders
                            </caption>
                            <thead>
                                <tr className="border-b border-hairline bg-ground">
                                    <th scope="col" className="p-4 font-medium text-ink-3">
                                        Decision point
                                    </th>
                                    <th scope="col" className="p-4 font-semibold text-ink">
                                        OpenAdapt
                                    </th>
                                    <th scope="col" className="p-4 font-medium text-ink-2">
                                        Traditional RPA
                                    </th>
                                    <th scope="col" className="p-4 font-medium text-ink-2">
                                        Computer-use agents
                                    </th>
                                    <th scope="col" className="p-4 font-medium text-ink-2">
                                        Browser recorders
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr
                                        key={row.dimension}
                                        className="border-b border-dotted border-[#C9CCC2] last:border-b-0"
                                    >
                                        <th
                                            scope="row"
                                            className="p-4 align-top font-medium text-ink"
                                        >
                                            {row.dimension}
                                        </th>
                                        <td className="bg-accent/10 p-4 align-top text-ink">
                                            {row.openadapt}
                                        </td>
                                        <td className="p-4 align-top text-ink-2">
                                            {row.rpa}
                                        </td>
                                        <td className="p-4 align-top text-ink-2">
                                            {row.agents}
                                        </td>
                                        <td className="p-4 align-top text-ink-2">
                                            {row.browser}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section
                    className="mt-14 rounded-2xl border-2 border-ink bg-panel p-6 md:p-8"
                    aria-labelledby="failure-path-heading"
                >
                    <p className="eyebrow">Governed failure</p>
                    <h2
                        id="failure-path-heading"
                        className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink"
                    >
                        Control the failure path.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        OpenAdapt separates deterministic re-resolution,
                        AI-assisted repair, human teaching, and unsupported
                        drift. Configured identity and effect checks decide
                        whether a consequential step continues.
                    </p>
                    <div className="mt-6 grid gap-6 sm:grid-cols-3">
                        <div>
                            <h3 className="font-display text-xl font-semibold text-ink">
                                Resolve
                            </h3>
                            <p className="mt-1 text-sm text-ink-2">
                                Find the target from retained evidence.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-display text-xl font-semibold text-ink">
                                Review
                            </h3>
                            <p className="mt-1 text-sm text-ink-2">
                                Inspect a proposed repair before reusing it.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-display text-xl font-semibold text-ink">
                                Halt
                            </h3>
                            <p className="mt-1 text-sm text-ink-2">
                                Preserve a report when verification fails.
                            </p>
                        </div>
                    </div>
                    <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <Link href="/safety" className="font-medium text-accent">
                            See the safety model
                        </Link>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/LIMITS.md"
                            className="text-accent"
                        >
                            Read current limits
                        </a>
                    </p>
                </section>

                <section
                    id="benchmark-evidence"
                    className="mt-14 scroll-mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                    aria-labelledby="benchmark-heading"
                >
                    <p className="eyebrow">Measured proof</p>
                    <h2
                        id="benchmark-heading"
                        className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink"
                    >
                        Faster repeat runs without per-run model spend.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        On MockMed, the reproducible browser workflow bundled
                        with openadapt-flow, compiled replay completed the same
                        checked task with lower median latency and $0 in model
                        cost per run.
                    </p>
                    <BenchmarkCharts dataset={benchmark.mockmed} />
                    <p className="mt-4 text-sm leading-relaxed text-ink-3">
                        This benchmark measures repeat cost and latency on one
                        task. We saw the same pattern in a public OpenEMR demo
                        cross-check.
                    </p>
                    <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/BENCHMARK.md"
                            className="font-medium text-accent"
                        >
                            Method, raw results, and rerun instructions
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/openemr/BENCHMARK.md"
                            className="text-accent"
                        >
                            OpenEMR cross-check
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/hybrid/BENCHMARK.md"
                            className="text-accent"
                        >
                            Drift and repair evidence
                        </a>
                    </p>
                </section>

                <section
                    className="mt-14 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                    aria-labelledby="choice-heading"
                >
                    <h2
                        id="choice-heading"
                        className="font-display text-2xl font-semibold tracking-tight text-ink"
                    >
                        Start with the right category.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        Use a direct API when a stable one exists. Choose
                        traditional RPA when connector breadth and enterprise
                        orchestration matter most. Choose a computer-use agent
                        for novel or exploratory work. Choose OpenAdapt when the
                        GUI workflow repeats and predictable replay,
                        reviewable change, and governed failure matter.
                    </p>
                    <p className="mt-4 text-sm">
                        <Link href="/#product-status" className="text-accent">
                            Review execution and deployment options
                        </Link>
                    </p>
                </section>

                <div className="mt-14">
                    <Faq />
                </div>

                <section className="mt-14 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                        Test one real workflow.
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Measure authoring time, run time, intervention rate, and
                        incorrect-success rate on work your team already repeats.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/#book" className="btn-ink">
                            Evaluate a workflow
                        </Link>
                        <Link href="/#open-source" className="btn-ghost-ink">
                            Try locally
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
