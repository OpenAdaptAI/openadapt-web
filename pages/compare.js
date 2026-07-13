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
        'We built the tooling that measures how often self-healing GUI automation tools silently write to the wrong record under UI drift, red-teamed our own engine seven times, then ran the same test across the category. How OpenAdapt compares to RPA, AI computer-use agents, and browser recorders on safety first, then cost and coverage.',
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
                    content="We built the tooling that measures how often self-healing GUI automation tools silently write wrong state under UI drift, and pointed it at our own engine first, then the category. See how OpenAdapt compares to RPA, computer-use agents, and browser recorders on measured silent wrong-action rate first, then cost, coverage, and where your data goes."
                />
                <link rel="canonical" href="https://openadapt.ai/compare" />
                <meta property="og:title" content="How OpenAdapt compares | OpenAdapt" />
                <meta
                    property="og:description"
                    content="Self-healing GUI bots can silently write to the wrong record under UI drift. We measured it on our own engine across seven adversarial rounds, and compare on safety first, then cost and coverage."
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
                    Start with the failure mode nobody in this category
                    publishes a number for. Every self-healing replay tool
                    (record a workflow, replay it, let it repair itself when the
                    UI moves) can resolve the wrong on-screen target under data
                    drift, act on it, and report success. In an EMR that&#39;s a
                    note saved to the wrong patient&#39;s chart, with a green
                    checkmark. The tools verify that <em>something</em> saved;
                    almost none verify <em>whose</em> record it landed in. So we
                    built the tooling that measures it, and red-teamed our own
                    engine seven times. The last two rounds surfaced a limit of
                    OCR itself, not a bug we could patch. That measurement, not
                    speed, is how we think this comparison should be led.
                </p>
                <p className="mt-4 max-w-3xl text-base text-ink-2 md:text-lg">
                    There are three common ways to automate desktop work today:
                    traditional RPA platforms, AI agents that operate a
                    computer with a large model, and browser recording tools.
                    OpenAdapt takes a fourth approach. It compiles a recorded
                    demonstration into a script that replays for free, heals
                    itself when the UI drifts, and{' '}
                    <strong>halts instead of guessing</strong> when it can&#39;t
                    verify the target&#39;s identity. Each approach wins
                    somewhere, so here&#39;s the honest version: safety first,
                    then cost and coverage.
                </p>

                <div className="mt-10 rounded-2xl border-2 border-ink bg-panel p-6 md:p-8">
                    <p className="eyebrow">The measurement</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                        Silent wrong-action rate under UI drift
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        The single most dangerous thing a GUI replayer can do
                        is the wrong write, silently. So we tried to make ours
                        do exactly that. It reopened seven times:
                        pixel-lookalike rows, residue-blind coverage,
                        near-name siblings (&ldquo;Belford, Phil&rdquo; vs
                        &ldquo;Belford, Philip&rdquo;), a blind spot shared by
                        our own test corpus and matcher, and an
                        identifier letter/digit confusion
                        (&ldquo;A01234&rdquo; vs &ldquo;AO1234&rdquo;). Each
                        was fixed and pinned as a permanent test on a frozen,
                        SHA-manifested held-out corpus (~6,900 pairs, committed
                        before each fix). Then testing on a realistic dense
                        record list surfaced the two deepest ones: OCR itself
                        reads look-alike characters (&ldquo;O&rdquo; vs
                        &ldquo;0&rdquo;, &ldquo;l&rdquo; vs &ldquo;1&rdquo;) as
                        the same glyph before any check runs, so at the text
                        layer a wrong-patient match on an identifier alone
                        can&#39;t be caught at all. That&#39;s a limit of the
                        substrate, not a bug to patch. So we verify identity on
                        the fields OCR reads reliably (the patient&#39;s name and
                        date of birth), and halt when identity would rest on a
                        look-alike identifier alone.
                    </p>
                    <div className="mt-5 grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink">
                                name + DOB
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                identity is verified on the signal OCR reads
                                reliably: names and dates carry redundancy a
                                single mis-read character doesn&#39;t collapse
                            </p>
                        </div>
                        <div>
                            <p className="font-display text-2xl font-semibold text-ink">
                                it halts
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                when two records differ only by a look-alike
                                identifier OCR can&#39;t tell apart, it stops and
                                writes nothing, a substrate limit we disclose
                                and are closing
                            </p>
                        </div>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-ink-2 md:text-base">
                        The honest exception, published against ourselves: on a
                        stable browser DOM, an identity-keyed selector matches
                        our safety (0 wrong-actions) and beats us on
                        availability. A positional selector, by contrast, wrote
                        the wrong patient 8/8. The wrong-action vector is spec
                        underspecification, and a demonstration captures target
                        identity for free. That comparison exists only where a
                        DOM does; on desktop, VDI, or Citrix there&#39;s no
                        selector to write.
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-ink-3">
                        &ldquo;Provably zero&rdquo; is an asymptote. Each of
                        those seven rounds began from a system we believed was
                        correct. The product isn&#39;t &ldquo;we don&#39;t make
                        mistakes&rdquo;; it&#39;s measured, disclosed, and
                        fail-closed, with the adversary log public. The open
                        problems that remain are written down, not hidden:
                        cosmetic zoom/display-scale drift is 0% replayability
                        today, icon-only targets proceed flagged rather than
                        verified, and the agent arms run on small sample sizes.
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
                    never on a healthy run. A healthy run is a compiled local
                    replay: same steps, same order, no model calls, no per-run
                    bill. Your screen stays on your machines.
                </p>

                <div className="mt-6 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <p className="eyebrow">The support act: what repetition costs</p>
                    <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink">
                        We also measured it on a real EMR
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        With the safety story established above, here is the
                        efficiency case. An 18-step add-patient-note workflow on
                        the official OpenEMR public demo, run both ways and
                        judged by one arm-independent OCR check, with a distinct
                        parameterized note per run. Both arms succeeded every
                        time: 20/20 compiled, 10/10 for a Claude computer-use
                        agent. The agent doesn&#39;t fail here. The difference
                        is what each run costs.
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
                        100%. Same orchestrator, same agent setup, same style
                        of OCR check. The same shape of result, on a substrate
                        you can reproduce:
                    </p>
                    <BenchmarkCharts
                        dataset={benchmark.mockmed}
                        runs={500}
                    />
                    <p className="mt-4 text-xs leading-relaxed text-ink-3">
                        {benchmark.mockmed.caveats}
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
                        Where another tool is the better fit
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
                        and over, where repeatability and cost matter more than
                        improvisation.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        And where a real, stable API already exists for the
                        system you&#39;re driving, use it &mdash; a direct
                        integration beats driving a GUI every time. OpenAdapt is
                        an API compiler for the API-less long tail: the legacy
                        EMRs, Citrix estates, and desktop systems where the
                        integration you&#39;d want was never shipped, so a
                        recorded demonstration is the only interface you have.
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
