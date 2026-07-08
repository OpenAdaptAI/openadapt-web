import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'How OpenAdapt compares',
    url: 'https://openadapt.ai/compare',
    description:
        'An honest comparison of OpenAdapt with traditional RPA platforms, AI computer-use agents, and browser recording tools: how automations are built, what each run costs, and what happens when the UI changes.',
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
        openadapt: 'None on healthy runs (deterministic local replay)',
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
                    content="OpenAdapt vs. traditional RPA, AI computer-use agents, and browser recording tools: who authors the automation, what each run costs, what happens when the UI changes, and where your data goes."
                />
                <link rel="canonical" href="https://openadapt.ai/compare" />
                <meta property="og:title" content="How OpenAdapt compares | OpenAdapt" />
                <meta
                    property="og:description"
                    content="An honest three-way comparison: traditional RPA, AI computer-use agents, and browser recording tools, next to a demonstration compiler."
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
                    There are three common ways to automate desktop work today:
                    traditional RPA platforms, AI agents that operate a
                    computer with a large model, and browser recording tools.
                    OpenAdapt takes a fourth approach. It compiles a recorded
                    demonstration into a deterministic script that replays for
                    free and heals itself when the UI drifts. Each approach
                    wins somewhere, so here&#39;s the honest version.
                </p>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Versus traditional RPA platforms
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    Platforms like UiPath, Automation Anywhere, and Blue Prism
                    ask you to build the automation by hand. You author
                    selectors, arrange flowcharts in a studio, and maintain
                    both. Large enterprises run a lot of automation this way
                    and it works, until the UI changes. A vendor ships an
                    update, the selectors stop matching, and someone has to
                    open the studio and repair the flow. Licensing is
                    typically per robot or per seat, and the platforms are
                    proprietary.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt skips the authoring step entirely. You record
                    yourself doing the task once, and the compiler turns that
                    demonstration into a script. When the UI drifts, OpenAdapt
                    heals the script and proposes the fix as a reviewable
                    diff, not a broken bot and a support ticket. It runs on
                    your own machines and it&#39;s MIT-licensed open source.
                </p>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Versus AI computer-use agents
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    Cloud agents in the OpenAI Operator and Claude
                    computer-use family re-reason through your task with a
                    large model on every single run. On tasks nobody has seen
                    before, they&#39;re genuinely impressive. For repetitive
                    work, though, re-reasoning is the wrong shape. Every run
                    is slow. Every run can take a different path than the
                    last. Every run is billed. And most of these services work
                    by sending screenshots of your screen to the cloud.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt uses a model at compile time and at heal time,
                    never on a healthy run. A healthy run is a deterministic
                    local replay: same steps, same order, no model calls, no
                    per-run bill. Your screen stays on your machines.
                </p>

                <div className="mt-6 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                        We measured it on a real EMR
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        An 18-step add-patient-note workflow on the official
                        OpenEMR public demo, run both ways and judged by one
                        arm-independent OCR check, with a distinct
                        parameterized note per run. Both arms succeeded every
                        time: 20/20 compiled, 10/10 for a Claude computer-use
                        agent. The agent doesn&#39;t fail here &mdash; the
                        difference is what each run costs.
                    </p>
                    <div className="mt-5 grid gap-6 sm:grid-cols-3">
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink">
                                1.8&times; faster
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                median run: 39.2s compiled vs 70.4s agent
                            </p>
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink">
                                $0 vs $0.55
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                model cost per run, at list price
                            </p>
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink">
                                0 vs ~24
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                model calls per run
                            </p>
                        </div>
                    </div>
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
                        Caveats, disclosed up front: the OpenEMR demo is a
                        shared public instance that anyone can modify and that
                        resets daily, so this is a field result, not a
                        CI-reproducible one. The agent arm is N=10 (agent runs
                        cost real money and real load on a shared service), so
                        its 100% carries wide error bars. One compiled run
                        self-flagged postcondition drift on the final step and
                        was verified saved by OCR; success is judged by the
                        arm-independent check for both arms, never
                        self-report. Results are pinned
                        to claude-sonnet-5 with the computer_20251124 tool on
                        2026-07-08; newer models will differ. The OCR success
                        check errs conservative on dense EMR text and is
                        identical for both arms.
                    </p>
                    <a
                        href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/openemr/BENCHMARK.md"
                        className="mt-3 inline-block text-sm text-accent hover:underline"
                    >
                        OpenEMR methodology and raw data
                    </a>
                </div>

                <div className="mt-4 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                        The reproducible anchor
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        Because the OpenEMR numbers depend on a live shared
                        instance, we keep the same head-to-head on MockMed,
                        the demo clinic app that ships with openadapt-flow,
                        as the benchmark anyone can rerun deterministically:
                        100 compiled replays against 20 agent runs, both arms
                        100%, 4.9s vs 37.5s median, $0 vs $0.27 per run at
                        list price. Same orchestrator, same agent harness,
                        same style of OCR check.
                    </p>
                    <a
                        href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/benchmark/BENCHMARK.md"
                        className="mt-3 inline-block text-sm text-accent hover:underline"
                    >
                        MockMed methodology and raw data
                    </a>
                </div>

                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Versus browser recording tools
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    Tools like Skyvern and browser-use record or drive
                    workflows inside the browser, using DOM selectors or model
                    inference. If your whole workflow lives in a browser tab,
                    they&#39;re worth a look. The limit is structural:
                    browser-only tools can&#39;t reach the desktop EMR, the
                    Windows loan origination system, or anything delivered
                    over Citrix.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt works from pixels and inputs rather than the
                    DOM, so the same approach extends past the browser to
                    desktop applications and VDI/RDP sessions (adapters for
                    these are in progress). Recording, compiling, and
                    replaying all happen on your infrastructure.
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
                        Where agents beat us
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        We&#39;d rather tell you this than have you find out
                        mid-pilot. Computer-use agents are the better tool for
                        novel one-off tasks, since compiling a demonstration
                        is overhead when there&#39;s no second run. They win
                        on tasks you can&#39;t demonstrate yourself, and on
                        exploratory work like researching something across a
                        dozen unfamiliar sites. OpenAdapt is built for the
                        opposite case: work your team does the same way, over
                        and over, where determinism and cost matter more than
                        improvisation.
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
