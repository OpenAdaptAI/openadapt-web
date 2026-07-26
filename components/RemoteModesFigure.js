import Link from 'next/link'

// The two remote execution modes, side by side, as a styled HTML/CSS figure.
//
// Honesty contract (kept in sync with public/status.json): the external lane
// is qualified today against a deterministic no-DOM stand-in for the Citrix
// Workspace window contract plus a real FreeRDP round trip for RDP; a real
// ICA/HDX environment is qualified per customer before consequential use.
// Neither panel claims universal production coverage.

function DownArrow({ label }) {
    return (
        <div className="flex flex-col items-center gap-1 py-2">
            <svg
                viewBox="0 0 24 32"
                width="18"
                height="24"
                aria-hidden="true"
                focusable="false"
                className="text-ink-3"
            >
                <path
                    d="M12 2v22m0 0l-7-7m7 7l7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            {label && (
                <span className="text-center text-xs leading-snug text-ink-3">
                    {label}
                </span>
            )}
        </div>
    )
}

function Box({ title, detail, tone = 'default' }) {
    const toneClass =
        tone === 'accent'
            ? 'border-accent/60 bg-accent/10'
            : tone === 'dashed'
              ? 'border-dashed border-ink/40 bg-ground'
              : 'border-hairline bg-panel'
    return (
        <div className={`rounded-xl border ${toneClass} px-4 py-3`}>
            <p className="text-sm font-semibold text-ink">{title}</p>
            {detail && (
                <p className="mt-1 text-xs leading-relaxed text-ink-2">
                    {detail}
                </p>
            )}
        </div>
    )
}

export default function RemoteModesFigure() {
    return (
        <section
            id="remote-modes"
            className="border-b border-hairline bg-panel px-5 py-16 md:py-20"
            aria-labelledby="remote-modes-heading"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Remote execution modes</p>
                <h2
                    id="remote-modes-heading"
                    className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                >
                    Two ways into managed Citrix, RDP, and VDI estates
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    Where policy permits software inside the managed session,
                    the runner executes in-session. Where it does not, the
                    external lane drives the local remote-desktop client
                    window from outside, so nothing is installed in the remote
                    environment. Both modes keep the same identity, policy,
                    verification, and halt contracts.
                </p>

                <figure className="mt-10">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-hairline bg-ground p-5 md:p-6">
                            <h3 className="font-display text-lg font-semibold text-ink">
                                In-session
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-ink-2">
                                The runner is installed inside the managed
                                session, when your policy permits it.
                            </p>
                            <div className="mt-5">
                                <div className="rounded-2xl border-2 border-ink/50 bg-panel p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
                                        Managed session (Citrix / RDP / VDI)
                                    </p>
                                    <div className="mt-3 space-y-0">
                                        <Box
                                            title="OpenAdapt runner"
                                            detail="Runs beside the application with native accessibility and visual evidence."
                                            tone="accent"
                                        />
                                        <DownArrow label="native control and evidence" />
                                        <Box
                                            title="Target application"
                                            detail="The system-of-record UI inside the session."
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-xs leading-relaxed text-ink-3">
                                Requires software inside the session image, so
                                it fits estates where you control the image or
                                policy allows an installed agent.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-hairline bg-ground p-5 md:p-6">
                            <h3 className="font-display text-lg font-semibold text-ink">
                                External black-box
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-ink-2">
                                The runner drives the local Citrix or RDP
                                client window. Zero install inside the remote
                                session.
                            </p>
                            <div className="mt-5">
                                <div className="rounded-2xl border-2 border-ink/50 bg-panel p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">
                                        Your workstation
                                    </p>
                                    <div className="mt-3 space-y-0">
                                        <Box
                                            title="OpenAdapt runner (outside the session)"
                                            detail="Operates through pixels, keyboard, and mouse with a two-phase lease: re-resolve on a fresh frame, refuse if anything changed before delivery."
                                            tone="accent"
                                        />
                                        <DownArrow label="pixels, keyboard, mouse" />
                                        <Box
                                            title="Local Citrix / RDP client window"
                                            detail="The vendor client you already run."
                                        />
                                    </div>
                                </div>
                                <DownArrow label="the vendor's own remote protocol" />
                                <Box
                                    title="Managed session (remote)"
                                    detail="Untouched: no agent, driver, or install inside the session."
                                    tone="dashed"
                                />
                            </div>
                            <p className="mt-4 text-xs leading-relaxed text-ink-3">
                                Fits locked-down estates where nothing may be
                                installed in the managed environment.
                            </p>
                        </div>
                    </div>
                    <figcaption className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-ink-3">
                        Status, stated plainly: the external lane is qualified
                        today against a deterministic no-DOM stand-in for the
                        Citrix Workspace window contract and a real FreeRDP
                        round trip for RDP. A real ICA/HDX environment is
                        qualified per customer before consequential use. Per
                        surface results are published in the{' '}
                        <a
                            href="https://docs.openadapt.ai/get-started/what-works-today/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent"
                        >
                            qualification evidence
                        </a>
                        , and machine-readable status in{' '}
                        <Link href="/status.json" className="text-accent">
                            status.json
                        </Link>
                        .
                    </figcaption>
                </figure>
            </div>
        </section>
    )
}
