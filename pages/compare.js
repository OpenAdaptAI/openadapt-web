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
        <div className="min-h-screen bg-[#06061f] text-white">
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
                <p className="text-sm font-medium uppercase tracking-widest text-[#60a5fa]">
                    Compare
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                    How OpenAdapt compares
                </h1>
                <p className="mt-5 max-w-3xl text-base font-light text-white/75 md:text-lg">
                    There are three common ways to automate desktop work today:
                    traditional RPA platforms, AI agents that operate a
                    computer with a large model, and browser recording tools.
                    OpenAdapt takes a fourth approach. It compiles a recorded
                    demonstration into a deterministic script that replays for
                    free and heals itself when the UI drifts. Each approach
                    wins somewhere, so here&#39;s the honest version.
                </p>

                <h2 className="mt-12 text-xl font-medium tracking-tight text-white/95">
                    Versus traditional RPA platforms
                </h2>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/75 md:text-base">
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
                <p className="mt-3 text-sm font-light leading-relaxed text-white/75 md:text-base">
                    OpenAdapt skips the authoring step entirely. You record
                    yourself doing the task once, and the compiler turns that
                    demonstration into a script. When the UI drifts, OpenAdapt
                    heals the script and proposes the fix as a reviewable
                    diff, not a broken bot and a support ticket. It runs on
                    your own machines and it&#39;s MIT-licensed open source.
                </p>

                <h2 className="mt-12 text-xl font-medium tracking-tight text-white/95">
                    Versus AI computer-use agents
                </h2>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/75 md:text-base">
                    Cloud agents in the OpenAI Operator and Claude
                    computer-use family re-reason through your task with a
                    large model on every single run. On tasks nobody has seen
                    before, they&#39;re genuinely impressive. For repetitive
                    work, though, re-reasoning is the wrong shape. Every run
                    is slow. Every run can take a different path than the
                    last. Every run is billed. And most of these services work
                    by sending screenshots of your screen to the cloud.
                </p>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/75 md:text-base">
                    OpenAdapt uses a model at compile time and at heal time,
                    never on a healthy run. A healthy run is a deterministic
                    local replay: same steps, same order, no model calls, no
                    per-run bill. Your screen stays on your machines.
                </p>

                <h2 className="mt-12 text-xl font-medium tracking-tight text-white/95">
                    Versus browser recording tools
                </h2>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/75 md:text-base">
                    Tools like Skyvern and browser-use record or drive
                    workflows inside the browser, using DOM selectors or model
                    inference. If your whole workflow lives in a browser tab,
                    they&#39;re worth a look. The limit is structural:
                    browser-only tools can&#39;t reach the desktop EMR, the
                    Windows loan origination system, or anything delivered
                    over Citrix.
                </p>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/75 md:text-base">
                    OpenAdapt works from pixels and inputs rather than the
                    DOM, so the same approach extends past the browser to
                    desktop applications and VDI/RDP sessions (adapters for
                    these are in progress). Recording, compiling, and
                    replaying all happen on your infrastructure.
                </p>

                <h2 className="mt-12 text-xl font-medium tracking-tight text-white/95">
                    Side by side
                </h2>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 font-medium text-white/60"></th>
                                <th className="p-4 font-semibold text-white/95">
                                    OpenAdapt
                                </th>
                                <th className="p-4 font-medium text-white/80">
                                    Traditional RPA
                                </th>
                                <th className="p-4 font-medium text-white/80">
                                    Computer-use agents
                                </th>
                                <th className="p-4 font-medium text-white/80">
                                    Browser recorders
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.dimension}
                                    className="border-b border-white/10 last:border-b-0"
                                >
                                    <td className="p-4 align-top font-medium text-white/90">
                                        {row.dimension}
                                    </td>
                                    <td className="bg-[#560df8]/10 p-4 align-top font-light text-white/90">
                                        {row.openadapt}
                                    </td>
                                    <td className="p-4 align-top font-light text-white/70">
                                        {row.rpa}
                                    </td>
                                    <td className="p-4 align-top font-light text-white/70">
                                        {row.agents}
                                    </td>
                                    <td className="p-4 align-top font-light text-white/70">
                                        {row.browser}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                    <h2 className="text-xl font-medium tracking-tight text-white/95">
                        Where agents beat us
                    </h2>
                    <p className="mt-3 text-sm font-light leading-relaxed text-white/75 md:text-base">
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

                <div className="mt-12 rounded-2xl border border-[#560df8]/40 bg-[#560df8]/10 p-6 text-center md:p-8">
                    <h2 className="text-xl font-medium tracking-tight text-white/95">
                        See it on your workflow
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm font-light text-white/75 md:text-base">
                        The fastest way to compare is to bring a real task.
                        Book 15 minutes, or read the code first.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/#book"
                            className="rounded-lg bg-[#560df8] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#7132d4]"
                        >
                            Book a demo
                        </Link>
                        <a
                            href="https://github.com/OpenAdaptAI/OpenAdapt"
                            className="rounded-lg border border-white/20 px-6 py-2.5 text-sm text-white/90 transition hover:border-white/40 hover:bg-white/5"
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
