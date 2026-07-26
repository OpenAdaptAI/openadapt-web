import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import { EVENTS, track } from 'utils/analytics'

const INSTALL = 'python -m pip install --upgrade openadapt'
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
                    content="Install OpenAdapt and complete your first local record, compile, certify, and replay loop with no account, model API, or Cloud service."
                />
                <link rel="canonical" href="https://openadapt.ai/start" />
                <meta
                    property="og:title"
                    content="Run OpenAdapt Locally for Free | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="Reach a real local OpenAdapt run in two copy-and-paste commands, then inspect the workflow and its run evidence."
                />
                <meta property="og:url" content="https://openadapt.ai/start" />
            </Head>

            <section className="border-b border-hairline px-5 py-16 md:py-24">
                <div className="mx-auto max-w-4xl">
                    <p className="eyebrow">Free local quickstart · MIT licensed</p>
                    <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
                        Get to your first local run in two commands.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg">
                        The quickstart records a bundled synthetic tutorial,
                        compiles it into an inspectable workflow, applies its
                        explicit demo policy, and replays it locally. No account,
                        target application, model API, or Cloud service is needed.
                    </p>

                    <div className="mt-10 grid gap-8 md:grid-cols-[1fr_0.85fr]">
                        <div>
                            <div>
                                <p className="eyebrow">1 · Install</p>
                                <Command
                                    command={INSTALL}
                                    event={EVENTS.LOCAL_QUICKSTART_INSTALL_COPIED}
                                />
                            </div>
                            <div className="mt-7">
                                <p className="eyebrow">2 · Run the whole loop</p>
                                <Command
                                    command={QUICKSTART}
                                    event={EVENTS.LOCAL_QUICKSTART_RUN_COPIED}
                                />
                            </div>
                            <p className="mt-5 text-sm leading-relaxed text-ink-3">
                                Requires Python 3.10–3.12 on Windows, macOS, or
                                Linux. The first run downloads Chromium once
                                (about 150 MB), so it can take a few minutes.
                            </p>
                        </div>

                        <aside className="rounded-2xl border border-hairline bg-panel p-5 md:p-6">
                            <p className="eyebrow">What you get</p>
                            <ol className="mt-4 grid gap-4 text-sm leading-relaxed text-ink-2">
                                <li>
                                    <strong className="text-ink">Recording</strong>
                                    <br />
                                    The demonstrated interaction and retained
                                    target evidence.
                                </li>
                                <li>
                                    <strong className="text-ink">
                                        Workflow bundle
                                    </strong>
                                    <br />
                                    The readable program OpenAdapt compiled.
                                </li>
                                <li>
                                    <strong className="text-ink">Run report</strong>
                                    <br />
                                    The actions, evidence, result, and any halt
                                    reason.
                                </li>
                            </ol>
                            <a
                                className="mt-5 inline-block text-sm underline underline-offset-4"
                                href="https://docs.openadapt.ai/get-started/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                    track(EVENTS.DOCS_CLICK, {
                                        location: 'local_quickstart',
                                    })
                                }
                            >
                                Open the full walkthrough
                            </a>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="border-b border-hairline bg-panel px-5 py-16 md:py-20">
                <div className="mx-auto max-w-4xl">
                    <p className="eyebrow">After your first run</p>
                    <h2 className="mt-2 max-w-2xl font-display text-2xl font-semibold tracking-tight md:text-3xl">
                        Keep it local, connect Cloud, or qualify the real work.
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
