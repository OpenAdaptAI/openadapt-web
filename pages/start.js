import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import { EVENTS, track } from 'utils/analytics'

const INSTALL = "python -m pip install --upgrade 'openadapt[browser]'"
const QUICKSTART = 'openadapt quickstart'

function Command({ command, event }) {
    const [copyState, setCopyState] = useState('idle')

    async function copy() {
        try {
            await navigator.clipboard.writeText(command)
            setCopyState('copied')
            track(event, { surface: 'local_quickstart' })
            window.setTimeout(() => setCopyState('idle'), 1800)
        } catch {
            setCopyState('failed')
        }
    }

    return (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-hairline bg-panel p-3 sm:p-4">
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm text-ink">
                {command}
            </code>
            <button
                type="button"
                className="btn-ghost-ink shrink-0"
                onClick={copy}
                aria-label={`Copy ${command}`}
                aria-live="polite"
            >
                {copyState === 'copied'
                    ? 'Copied'
                    : copyState === 'failed'
                      ? 'Copy failed'
                      : 'Copy'}
            </button>
        </div>
    )
}

export default function StartPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Run OpenAdapt Locally for Free | OpenAdapt</title>
                <meta
                    name="description"
                    content="Run OpenAdapt locally through the native Desktop app or CLI, with no account, model API, or Cloud service required."
                />
                <link rel="canonical" href="https://openadapt.ai/start" />
                <meta
                    property="og:title"
                    content="Run OpenAdapt Locally for Free | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="Choose the native Desktop app or CLI and complete the same local record, compile, qualify, run, and evidence lifecycle."
                />
                <meta property="og:url" content="https://openadapt.ai/start" />
            </Head>

            <section className="border-b border-hairline px-5 py-16 md:py-24">
                <div className="mx-auto max-w-4xl">
                    <p className="eyebrow">Free local start · MIT licensed</p>
                    <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
                        Start locally with Desktop or the CLI.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg">
                        Both paths use the same local compiler and governed
                        runtime. Choose the visual Desktop cockpit or the
                        scriptable command line. Neither requires a Cloud account
                        or model API.
                    </p>

                    <div
                        className="mt-10 grid gap-5 md:grid-cols-2"
                        role="list"
                        aria-label="Local ways to run OpenAdapt"
                    >
                        <article
                            className="flex h-full flex-col rounded-2xl border border-hairline bg-panel p-5 md:p-6"
                            role="listitem"
                        >
                            <p className="eyebrow">Command line</p>
                            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                                OpenAdapt CLI
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-ink-2">
                                Run the complete local tutorial, inspect every
                                artifact, and script the same lifecycle in a
                                terminal or CI environment.
                            </p>

                            <div className="mt-6">
                                <p className="eyebrow">1 · Install</p>
                                <Command
                                    command={INSTALL}
                                    event={EVENTS.LOCAL_QUICKSTART_INSTALL_COPIED}
                                />
                            </div>
                            <div className="mt-5">
                                <p className="eyebrow">2 · Run the whole loop</p>
                                <Command
                                    command={QUICKSTART}
                                    event={EVENTS.LOCAL_QUICKSTART_RUN_COPIED}
                                />
                            </div>
                            <p className="mt-5 text-xs leading-relaxed text-ink-3">
                                Requires Python 3.10–3.12. The browser extra is
                                only for this web tutorial; its first web action
                                downloads matching Chromium once. Native, RDP,
                                and Citrix installs do not need it.
                            </p>
                            <div className="mt-auto pt-6">
                                <a
                                    data-testid="local-cli-walkthrough"
                                    className="inline-block text-sm underline underline-offset-4"
                                    href="https://docs.openadapt.ai/get-started/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() =>
                                        track(EVENTS.DOCS_CLICK, {
                                            location: 'local_quickstart',
                                        })
                                    }
                                >
                                    Open the CLI walkthrough
                                </a>
                            </div>
                        </article>

                        <article
                            className="flex h-full flex-col rounded-2xl border border-hairline bg-panel p-5 md:p-6"
                            role="listitem"
                        >
                            <p className="eyebrow">Native app · Beta</p>
                            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                                OpenAdapt Desktop
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-ink-2">
                                Record, compile, inspect, qualify, run, and review
                                evidence from the visual cockpit. It packages the
                                same governed workflow engine behind a native app.
                            </p>
                            <ol className="mt-6 grid gap-4 text-sm leading-relaxed text-ink-2">
                                <li>
                                    <strong className="text-ink">
                                        1 · Choose your installer
                                    </strong>
                                    <br />
                                    Available for Windows, macOS, and Linux.
                                </li>
                                <li>
                                    <strong className="text-ink">
                                        2 · Follow first-run setup
                                    </strong>
                                    <br />
                                    Grant the local permissions needed to capture
                                    your demonstration.
                                </li>
                                <li>
                                    <strong className="text-ink">
                                        3 · Run the visual workflow
                                    </strong>
                                    <br />
                                    Review the compiled graph, policy, result, and
                                    retained evidence in one place.
                                </li>
                            </ol>
                            <div className="mt-auto flex flex-wrap gap-3 pt-7">
                                <Link
                                    data-testid="local-desktop-download"
                                    className="btn-ink"
                                    href="/download#desktop-builds"
                                    onClick={() =>
                                        track(EVENTS.DOWNLOAD_CLICK, {
                                            surface: 'local_start',
                                            platform: 'chooser',
                                        })
                                    }
                                >
                                    Download Desktop
                                </Link>
                                <Link
                                    className="btn-ghost-ink"
                                    href="/download#desktop-preview"
                                >
                                    See the app
                                </Link>
                            </div>
                            <p className="mt-4 text-xs leading-relaxed text-ink-3">
                                Desktop opens without a browser download.
                                Chromium is added only if you choose a browser
                                workflow; native, RDP, and Citrix work stays on
                                its own substrate path.
                            </p>
                        </article>
                    </div>

                    <aside className="mt-5 rounded-2xl border border-hairline bg-ground p-5 md:p-6">
                        <p className="eyebrow">One local product</p>
                        <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
                            Whichever path you choose, the result is portable.
                        </h2>
                        <div className="mt-5 grid gap-4 text-sm leading-relaxed text-ink-2 sm:grid-cols-3">
                            <p>
                                <strong className="text-ink">Recording</strong>
                                <br />
                                The demonstration and retained target evidence.
                            </p>
                            <p>
                                <strong className="text-ink">
                                    Workflow bundle
                                </strong>
                                <br />
                                The inspectable program OpenAdapt compiled.
                            </p>
                            <p>
                                <strong className="text-ink">Run evidence</strong>
                                <br />
                                The result, contract evidence, and any halt reason.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>

            <section
                className="border-b border-hairline bg-panel px-5 py-16 md:py-20"
                data-testid="local-next-steps"
            >
                <div className="mx-auto max-w-4xl">
                    <p className="eyebrow">Optional after local success</p>
                    <h2 className="mt-2 max-w-2xl font-display text-2xl font-semibold tracking-tight md:text-3xl">
                        Keep running locally, connect Cloud, or qualify the real
                        work.
                    </h2>
                    <div className="mt-7 grid gap-5 md:grid-cols-2">
                        <article className="rounded-2xl border border-hairline bg-ground p-5 md:p-6">
                            <h3 className="font-display text-xl font-semibold">
                                Connect this computer
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-ink-2">
                                Pair the local runtime with your Cloud workspace
                                for approved workflow handoff, run history, and
                                collaboration. Pairing is free; managed runs use
                                the Cloud plan.
                            </p>
                            <a
                                className="btn-ink mt-5 inline-block"
                                href="https://app.openadapt.ai/dashboard/settings/ingest"
                                onClick={() =>
                                    track(EVENTS.LOCAL_TO_CLOUD_CLICK, {
                                        location: 'local_quickstart',
                                    })
                                }
                            >
                                Connect to Cloud
                            </a>
                        </article>
                        <article className="rounded-2xl border border-hairline bg-ground p-5 md:p-6">
                            <h3 className="font-display text-xl font-semibold">
                                Bring the actual workflow
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-ink-2">
                                For consequential browser, desktop, RDP, or
                                Citrix work, qualify the exact application,
                                identities, effect verifier, failure cases, and
                                deployment boundary.
                            </p>
                            <Link
                                className="btn-ghost-ink mt-5 inline-block"
                                href="/qualify"
                                onClick={() =>
                                    track(EVENTS.HERO_CTA_CLICK, {
                                        cta: 'qualify_after_local_quickstart',
                                    })
                                }
                            >
                                Qualify one workflow
                            </Link>
                        </article>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
