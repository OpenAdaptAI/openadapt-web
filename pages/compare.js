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
        'Automation tools can save to the wrong record and report success. We measured how often that happens, on our own tool first. How OpenAdapt compares to RPA, AI computer-use agents, and browser recorders on safety first, then cost and coverage.',
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
        dimension: 'Cost per run',
        openadapt: 'None on healthy runs (model-free on the hot path)',
        rpa: 'Licensed per robot or per seat',
        agents: 'Metered model calls on every run',
        browser: 'Varies; cloud inference is metered',
    },
    {
        dimension: 'When the UI changes',
        openadapt: 'Heals the script; fix arrives as a reviewable diff',
        rpa: 'Selectors break; someone repairs the flow by hand',
        agents: 'The model may adapt, or may take a different path',
        browser: 'DOM selectors break, or the model re-infers',
    },
    {
        dimension: 'Where it runs',
        openadapt: 'Your machines',
        rpa: 'Your infrastructure or vendor cloud',
        agents: 'Vendor cloud, with screenshots of your screen',
        browser: 'The browser; often with a cloud backend',
    },
    {
        dimension: 'App coverage',
        openadapt: 'Desktop, web, and VDI/RDP (vision-based; adapters in progress)',
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
                    content="An automation can save to the wrong patient's chart and still show a green checkmark. We measured how often that happens, starting with our own tool. See how OpenAdapt compares to RPA, computer-use agents, and browser recorders on safety first, then cost, coverage, and where your data stays."
                />
                <link rel="canonical" href="https://openadapt.ai/compare" />
                <meta property="og:title" content="How OpenAdapt compares | OpenAdapt" />
                <meta
                    property="og:description"
                    content="Automation tools can save to the wrong record and report success. We spent seven rounds trying to make our own tool do it, fixed every hole, and published what's left. Compare on safety first, then cost and coverage."
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
                    The worst thing an automation can do is quietly the wrong
                    thing. It saves your note to the wrong patient&#39;s chart,
                    shows a green checkmark, and moves on. Most tools confirm
                    that something was saved. Almost none confirm{' '}
                    <em>whose</em> record it saved to. That is the risk we think
                    should decide this comparison, so we measured it, on our own
                    tool first.
                </p>
                <p className="mt-4 max-w-3xl text-base text-ink-2 md:text-lg">
                    There are three common ways to automate desktop work:
                    traditional RPA, AI agents that drive a computer with a large
                    model, and browser recorders. OpenAdapt is a fourth. You
                    record the task once, and it compiles that recording into a
                    script that replays for free, repairs itself when the screen
                    changes, and{' '}
                    <strong>stops rather than guess</strong> when it can&#39;t
                    confirm it&#39;s acting on the right record. Each approach
                    wins somewhere. Here is the honest picture, safety first.
                </p>

                <div className="mt-10 rounded-2xl border-2 border-ink bg-panel p-6 md:p-8">
                    <p className="eyebrow">The measurement</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                        How often does it act on the wrong record?
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        We spent seven rounds trying to make our own tool save to
                        the wrong patient, and fixed every hole we found. The
                        answer that held: confirm identity on the name and date of
                        birth (which survive a misread), and stop and write nothing
                        when only a look-alike ID separates two records.
                    </p>
                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink">
                                name + DOB
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                it confirms the record by name and date of birth,
                                which a single misread character can&#39;t quietly
                                change
                            </p>
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink">
                                it stops
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                when two records differ only by a look-alike ID,
                                it writes nothing and asks for a human, rather
                                than risk the wrong one
                            </p>
                        </div>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-ink-2 md:text-base">
                        Honest exception, published against ourselves: inside a
                        browser, an identity-keyed competitor is just as safe. We
                        pull ahead where there is no browser to lean on, which is
                        most of this work: desktop EMRs, Citrix, and Windows.
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-ink-3">
                        &ldquo;Zero wrong actions&rdquo; is a target, not a boast;
                        every round started from a version we thought was correct.
                        What we promise is measured, disclosed, and fail-closed,
                        with the open problems written down (display-scale drift,
                        icon-only targets, small agent samples).
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
                    once, it compiles to a script, and when the UI drifts it heals
                    and proposes the fix as a reviewable diff, on your own
                    machines, MIT open source.
                </p>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Versus AI computer-use agents
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    Cloud agents (OpenAI Operator, Claude computer-use) re-reason
                    through your task with a large model on every run: impressive
                    on novel work, but for repetitive work every run is slow,
                    differently-pathed, billed, and usually sends your screen to
                    the cloud. OpenAdapt uses a model only at compile and heal
                    time. A healthy run is a local compiled replay: same steps, no
                    model calls, no per-run bill, screen stays on your machines.
                </p>

                <div className="mt-6 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <p className="eyebrow">What repetition costs</p>
                    <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">
                        Cost, on a test you can run yourself
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        MockMed ships with openadapt-flow, so you can rerun this:
                        100 compiled replays vs 20 agent runs, one independent
                        check. Both finish every run. The agent doesn&#39;t fail
                        here; it just costs money and time on every run where the
                        compiled script costs neither.
                    </p>
                    <BenchmarkCharts
                        dataset={benchmark.mockmed}
                        runs={500}
                    />
                    <p className="mt-4 text-xs leading-relaxed text-ink-3">
                        {benchmark.mockmed.caveats} Agent cost is computed at the
                        model&#39;s list price ($3/$15 per Mtok in/out); an
                        introductory $2/$10 rate applies through 2026-08-31, which
                        lowers the agent figure further.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        On the same setup under injected UI drift, a hybrid
                        mode (compiled replay first, agent fallback only on a
                        detected halt) matched agent reliability (20/20) at
                        roughly one-eighth the agent&#39;s cost per successful
                        run. Details and caveats (synthetic detected-halt
                        drift, assumed drift mix) in the repo.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/BENCHMARK.md"
                            className="inline-block text-sm text-accent hover:underline"
                        >
                            MockMed methodology and raw data
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/hybrid/BENCHMARK.md"
                            className="inline-block text-sm text-accent hover:underline"
                        >
                            Hybrid methodology and caveats
                        </a>
                    </div>
                </div>

                <div className="mt-4 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                        The same result on a real EMR
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        The same head-to-head on a real app: an 18-step
                        add-patient-note workflow on the official OpenEMR public
                        demo, one independent OCR check, a distinct note per run.
                        Both succeeded every time (20/20 compiled, 10/10 agent).
                        The demo resets daily, so treat this as a field
                        cross-check on cost and latency, not a reproducible number
                        or a reliability claim.
                    </p>
                    <BenchmarkCharts
                        dataset={benchmark.openemr}
                        runs={500}
                    />
                    <p className="mt-5 text-sm leading-relaxed text-ink-2 md:text-base">
                        Run the task 500 times and the ratios compound: about
                        $275 and ten hours of wall clock through the agent,
                        versus $0 and about five and a half hours compiled,
                        with every action auditable against the demonstrated
                        script. The compiled arm&#39;s price of entry is a
                        one-minute human demonstration; the agent needs only a
                        prompt.
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-ink-3">
                        Caveats: a shared demo that resets daily (a field result,
                        not CI-reproducible); the agent arm is N=10, so its 100%
                        has wide error bars; success is the arm-independent check
                        for both, never self-report; pinned to claude-sonnet-5 on
                        2026-07-08. Full method and raw data below.
                    </p>
                    <a
                        href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/openemr/BENCHMARK.md"
                        className="mt-3 inline-block text-sm text-accent hover:underline"
                    >
                        OpenEMR methodology and raw data
                    </a>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Versus browser recording tools
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    Skyvern and browser-use record or drive workflows inside the
                    browser via DOM selectors or model inference. If your whole
                    workflow lives in a browser tab, they&#39;re worth a look. The
                    structural limit: they can&#39;t reach the desktop EMR, the
                    Windows loan system, or anything over Citrix. OpenAdapt works
                    from pixels and inputs, so the same approach extends to desktop
                    and VDI/RDP (adapters in progress), all on your infrastructure.
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
                        driving a screen. OpenAdapt is for everything that
                        doesn&#39;t: the legacy EMRs, Citrix estates, and desktop
                        systems where that integration was never built, and a
                        recorded demonstration is the only way in.
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
                            href="https://github.com/OpenAdaptAI/OpenAdapt"
                            className="btn-ghost-ink"
                        >
                            View on GitHub
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
