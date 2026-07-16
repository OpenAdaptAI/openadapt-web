import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import BenchmarkCharts from '@components/BenchmarkCharts'
import benchmark from '../data/benchmark.json'

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'How OpenAdapt compares',
    url: 'https://openadapt.ai/compare',
    description:
        'Compare OpenAdapt with RPA, AI computer-use agents, and browser recorders on repeated-work economics, verification boundaries, deployment, and maturity.',
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

const rows = [
    {
        dimension: 'How automations are built',
        openadapt: 'Recorded demonstration, compiled into a script',
        rpa: 'Hand-authored selectors and flowcharts',
        agents: 'A model re-reasons through the task on every run',
        browser: 'Browser recording or a prompt',
    },
    {
        dimension: 'Model API cost per healthy run',
        openadapt: '$0 measured; execution infrastructure is separate',
        rpa: 'Licensed per robot or per seat',
        agents: 'Metered model calls on every run',
        browser: 'Varies; cloud inference is metered',
    },
    {
        dimension: 'When the UI changes',
        openadapt: 'Re-resolves, proposes a governed repair, or halts',
        rpa: 'Selectors break; someone repairs the flow by hand',
        agents: 'The model may adapt, or may take a different path',
        browser: 'DOM selectors break, or the model re-infers',
    },
    {
        dimension: 'Where it runs',
        openadapt: 'Local, managed browser, BYOC, or on-prem by declared boundary',
        rpa: 'Your infrastructure or vendor cloud',
        agents: 'Vendor cloud, with screenshots of your screen',
        browser: 'The browser; often with a cloud backend',
    },
    {
        dimension: 'App coverage',
        openadapt: 'Browser supported; Windows experimental; RDP/Citrix research',
        rpa: 'Desktop and web via connectors',
        agents: 'Anything on screen',
        browser: 'Browser only',
    },
    {
        dimension: 'License',
        openadapt: 'MIT open source',
        rpa: 'Proprietary',
        agents: 'Proprietary services',
        browser: 'Varies; some open source',
    },
]

export default function ComparePage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>How OpenAdapt compares to RPA, AI agents, and browser recorders | OpenAdapt</title>
                <meta
                    name="description"
                    content="Compare OpenAdapt with RPA, AI computer-use agents, and browser recorders on repeated-work economics, verification boundaries, deployment, and maturity."
                />
                <link rel="canonical" href="https://openadapt.ai/compare" />
                <meta property="og:title" content="How OpenAdapt compares | OpenAdapt" />
                <meta
                    property="og:description"
                    content="Where governed compiled replay fits: repeated-work economics, verification boundaries, deployment, and current substrate maturity."
                />
                <meta property="og:url" content="https://openadapt.ai/compare" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webPageSchema),
                    }}
                />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    Compare
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    How OpenAdapt compares
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    Repeated work needs more than a successful click. Operators
                    need predictable execution cost, a clear record of what ran,
                    and a visible halt when the workflow cannot verify its target
                    or effect.
                </p>
                <p className="mt-4 max-w-3xl text-base text-ink-2 md:text-lg">
                    There are three common ways to automate desktop work:
                    traditional RPA, AI agents that drive a computer with a large
                    model, and browser recorders. OpenAdapt is a fourth. You
                    record the task once, and it compiles that recording into a
                    script that replays without model calls on a healthy run,
                    then re-resolves, proposes a governed repair, or halts when
                    the screen changes. In a certified workflow, it{' '}
                    <strong>halts rather than guess</strong> when it can&#39;t
                    confirm it&#39;s acting on the right record. Each approach
                    wins somewhere. Here is the honest picture, safety first.
                </p>

                <div className="mt-10 rounded-2xl border-2 border-ink bg-panel p-6 md:p-8">
                    <p className="eyebrow">Operational risk</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                        Verify the record before the write.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        For a consequential workflow, confirming that a button
                        responded is not enough. OpenAdapt can require identity and
                        effect evidence before continuing, then halt for an operator
                        when that evidence is ambiguous.
                    </p>
                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink">
                                Verify intent
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                require configured evidence that the workflow is
                                acting on the intended record
                            </p>
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink">
                                Refuse ambiguity
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                stop and preserve evidence instead of treating an
                                uncertain target as a successful action
                            </p>
                        </div>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-ink-2 md:text-base">
                        Stable browser identity controls can provide the same kind
                        of protection. OpenAdapt&apos;s current public evidence is
                        strongest on the browser path; Windows is Experimental and
                        RDP/Citrix remain Research.
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-ink-3">
                        Verification is only as strong as its configured identity,
                        effect, and policy coverage. This reduces named failure
                        modes; it does not prove zero wrong actions.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/LIMITS.md"
                            className="inline-block text-sm font-medium text-accent hover:underline"
                        >
                            Read the honest limitations (LIMITS.md)
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/validation/IDENTITY_ROC.md"
                            className="inline-block text-sm text-accent hover:underline"
                        >
                            The adversary log &amp; ROC
                        </a>
                    </div>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Versus traditional RPA platforms
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    UiPath, Automation Anywhere, and Blue Prism make you
                    hand-author selectors and flowcharts and maintain them: a
                    vendor UI update breaks the selectors, and someone reopens the
                    studio. Licensing is per robot or seat, and it&#39;s
                    proprietary. OpenAdapt skips the authoring: record the task
                    once, it compiles to a script, and when the UI drifts it
                    re-resolves from evidence, proposes a governed repair, or
                    halts under configured verification. The engine is MIT
                    open source and supports local deployment.
                </p>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Versus AI computer-use agents
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    Cloud agents (OpenAI Operator, Claude computer-use) re-reason
                    through your task with a large model on every run: impressive
                    on novel work, but for repetitive work every run is slow,
                    differently-pathed, billed, and usually sends your screen to
                    the cloud. OpenAdapt can use a model during compilation or
                    governed repair, not on a healthy replay. Local execution
                    keeps live observations local; hosted execution keeps them
                    inside its declared managed runtime boundary. Only an
                    approved sanitized derivative may cross the artifact
                    boundary.
                </p>

                <div
                    id="benchmark-evidence"
                    className="mt-6 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                >
                    <p className="eyebrow">Measured evidence</p>
                    <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">
                        Repeated work should not pay an agent to rethink the same task.
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        In a bounded browser benchmark, both approaches completed
                        the measured workflow. Compiled replay was faster and used
                        no model calls. This supports a cost-and-latency claim for
                        repeated work on this task, not a broader reliability claim.
                    </p>
                    <BenchmarkCharts
                        dataset={benchmark.mockmed}
                    />
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/BENCHMARK.md"
                            className="inline-block text-sm text-accent hover:underline"
                        >
                            Review scope, samples, pricing basis, caveats, and raw results
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/hybrid/BENCHMARK.md"
                            className="inline-block text-sm text-accent hover:underline"
                        >
                            Review drift and fallback evidence
                        </a>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                        A bounded field cross-check
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        We repeated the comparison against the public OpenEMR demo.
                        Both approaches completed the measured workflow, while
                        compiled replay showed lower median latency and no model
                        calls. This is a cost-and-latency cross-check only. It does
                        not establish production EMR reliability, safety, or readiness.
                    </p>
                    <BenchmarkCharts
                        dataset={benchmark.openemr}
                    />
                    <a
                        href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/openemr/BENCHMARK.md"
                        className="mt-3 inline-block text-sm text-accent hover:underline"
                    >
                        Review scope, samples, demo limitations, pricing basis, and raw results
                    </a>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Versus browser recording tools
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    Browser-first tools use DOM selectors or model inference and
                    can be a strong fit when the whole workflow stays in a tab.
                    OpenAdapt adds compiled replay, evidence-backed verification,
                    and an execution model intended to span structured and visual
                    targets. The current launch is the browser path; desktop is
                    Experimental and VDI/RDP remains Research.
                </p>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Side by side
                </h2>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-hairline bg-panel">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-hairline bg-ground">
                                <th className="p-4 font-medium text-ink-3"></th>
                                <th className="p-4 font-semibold text-ink">
                                    OpenAdapt
                                </th>
                                <th className="p-4 font-medium text-ink-2">
                                    Traditional RPA
                                </th>
                                <th className="p-4 font-medium text-ink-2">
                                    Computer-use agents
                                </th>
                                <th className="p-4 font-medium text-ink-2">
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
                                    <td className="p-4 align-top font-medium text-ink">
                                        {row.dimension}
                                    </td>
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

                <div className="mt-12 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Where another tool is the better fit
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        We&#39;d rather tell you than have you find out mid-pilot:
                        computer-use agents are better for novel one-off tasks
                        (compiling a demo is overhead with no second run) and for
                        exploratory work across unfamiliar sites. OpenAdapt is for
                        the opposite: work your team repeats, where repeatability
                        and cost beat improvisation.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        And if the system you need to automate already has a
                        solid API, use it; a direct integration will always beat
                        driving a screen. The current OpenAdapt launch covers
                        integration-hostile browser workflows. Native desktop,
                        RDP, and Citrix are separate Experimental/Research paths,
                        not capabilities implied by this comparison.
                    </p>
                </div>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        See it on your workflow
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        The fastest way to compare is to bring a real task.
                        Book 15 minutes, or read the code first.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/#book"
                            className="btn-ink"
                        >
                            Book a demo
                        </Link>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow"
                            className="btn-ghost-ink"
                        >
                            View on GitHub
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/tree/main/paper"
                            className="btn-ghost-ink"
                        >
                            Read the paper source
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
