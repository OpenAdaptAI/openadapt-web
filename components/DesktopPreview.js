/**
 * DesktopPreview — real screenshots of the native desktop surfaces on
 * the download page, plus an honest per-OS representation of where the
 * separate tray companion places its icon.
 *
 * Honesty contract (enforced by tests/desktopPreview.test.js and documented in
 * public/desktop-preview/MANIFEST.json):
 *  - Every /desktop-preview/cockpit/ image is a capture of the real native
 *    desktop app running the real wired engine, signed in against a locally-run
 *    instance of the OpenAdapt cloud in mock mode (not a production org). The
 *    workflow, run, and halt data shown is a real local demo recording: two
 *    workflows recorded via demo-record, compiled, and replayed on this machine.
 *  - This is LOCAL demo data, not production data and not customer data. The
 *    captions say so and never claim a hosted production org.
 *  - No fabricated UI, no synthetic screens, no retouching beyond resizing.
 *  - The Windows install stills are the real NSIS installer flow on Windows 11.
 *  - The tray section is a labelled *representation* (OS chrome strips with the
 *    real OpenAdapt mark placed in the tray area), NOT a screenshot and not
 *    presented as one. It shows where the openadapt-tray icon appears on each
 *    OS; the mark is the project's own favicon silhouette.
 *  - The tray is NOT part of the installers on this page and is not described
 *    as controlling a released desktop build (no released build provides the
 *    companion service it expects).
 *
 * The section is fully static: no animation, no client state, and explicit
 * image dimensions so it causes no layout shift and needs no reduced-motion
 * handling.
 */

const TRAY_PACKAGE_VERSION = '0.1.1'
const WINDOWS_INSTALLER_VERSION = '0.6.1'

// Real captures of the live native desktop app running the real wired
// engine. Signed in against a locally-run instance of the cloud in mock mode
// (not a production org); the workflows/runs/halt shown are a real local demo
// recording (recorded via demo-record, compiled, and replayed on this machine).
// The lead pair is the differentiator: the workflow library and the halt
// evidence. The supporting grid rounds out the connected surfaces.
const COCKPIT_LEAD = [
    {
        src: '/desktop-preview/cockpit/10_dashboard_workflows.png',
        width: 1600,
        height: 1085,
        label: 'The workflow library',
        alt: 'OpenAdapt Desktop workflow library listing two real replayed demo workflows: MockMed refill triage (halted, needs attention) and Patient intake insurance verify (verified), with an engine-ready and synced status rail.',
        testid: 'desktop-preview-cockpit-dashboard',
        caption:
            'The real desktop app running two real replayed demo workflows: one halted and needing attention, one verified. Both were recorded via demo-record, compiled, and replayed locally on this machine.',
    },
    {
        src: '/desktop-preview/cockpit/40_watchrun_halted.png',
        width: 1600,
        height: 1085,
        label: 'Halt evidence: this run stopped safely',
        alt: 'OpenAdapt Desktop run detail for MockMed refill triage: a replay timeline with 9 of 11 steps verified and one halted, and a "This run stopped safely" card explaining that the typed value could not be verified for step_009.',
        testid: 'desktop-preview-cockpit-halt',
        caption:
            'The differentiator: a real replay that stopped safely at step 9 of 11 rather than write a value it could not verify. The halt reason is the app\'s real effect-verification output on local demo data: the field region changed, so the typed value is not readable there and retyping is unsafe.',
    },
]

const COCKPIT_GRID = [
    {
        src: '/desktop-preview/cockpit/45_watchrun_verified.png',
        width: 1600,
        height: 1085,
        label: 'A verified run',
        alt: 'OpenAdapt Desktop run detail for Patient intake insurance verify: all 11 of 11 steps verified, with a run report showing 11 steps, 8.2s duration, and $0.000 model cost.',
        testid: 'desktop-preview-cockpit-verified',
        caption:
            'The other workflow replays clean: 11 of 11 steps verified, 8.2s, $0.000 model cost. Real local demo run.',
    },
    {
        src: '/desktop-preview/cockpit/50_teach.png',
        width: 1600,
        height: 1085,
        label: 'Teach the fix',
        alt: 'OpenAdapt Desktop "Teach the fix" surface: the halted type-note step with its verification-failure reason, and options to re-record the step or describe the correct target.',
        testid: 'desktop-preview-cockpit-teach',
        caption:
            'When a run halts, you correct it in place by re-recording the step or describing the right target. The correction stays local.',
    },
    {
        src: '/desktop-preview/cockpit/20_settings.png',
        width: 1600,
        height: 1348,
        label: 'Settings and policy',
        alt: 'OpenAdapt Desktop settings: deployment lane (Cloud non-PHI vs BYOC self-hosted PHI), PHI mode, and a hosted-organization connection to https://app.openadapt.ai with a signed-in ingest-token session.',
        testid: 'desktop-preview-cockpit-settings',
        caption:
            'Deployment lane, PHI mode, and the signed-in session. The connection was validated against a locally-run instance of the cloud in mock mode, not a production org.',
    },
    {
        src: '/desktop-preview/cockpit/05_onboarding.png',
        width: 1600,
        height: 1085,
        label: 'First-run onboarding',
        alt: 'OpenAdapt Desktop first-run onboarding "Record your first workflow", with screen and input permission checks granted and macOS first-launch guidance.',
        testid: 'desktop-preview-cockpit-onboarding',
        caption:
            'First launch walks through the screen and input permissions capture needs before you record.',
    },
    {
        src: '/desktop-preview/cockpit/30_record.png',
        width: 1600,
        height: 1085,
        label: 'Record and review',
        alt: 'OpenAdapt Desktop record surface in its idle state, ready to capture a demonstration, with a Start recording button.',
        testid: 'desktop-preview-cockpit-record',
        caption:
            'Demonstrate a task once. The recorder captures it, then the engine compiles it into a replayable workflow.',
    },
    {
        src: '/desktop-preview/cockpit/01_login.png',
        width: 1600,
        height: 1085,
        label: 'Sign in',
        alt: 'OpenAdapt Desktop sign-in surface with a host field, a browser sign-in option, and an ingest-token paste option.',
        testid: 'desktop-preview-cockpit-login',
        caption:
            'Sign in with a browser or an ingest token. Validated against a locally-run instance of the cloud in mock mode, not a production org.',
    },
]

// The OpenAdapt mark is rendered as a CSS mask over the project's own favicon
// silhouette (public/safari-pinned-tab.svg), so the glyph inherits the current
// text colour and reads correctly in both light and dark themes — exactly how
// a real template tray/menu-bar icon behaves.
const TRAY_GLYPH_STYLE = {
    WebkitMaskImage: 'url(/safari-pinned-tab.svg)',
    maskImage: 'url(/safari-pinned-tab.svg)',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
}

function TrayGlyph({ className = 'h-4 w-4' }) {
    return (
        <span
            aria-hidden="true"
            style={TRAY_GLYPH_STYLE}
            className={`inline-block bg-current ${className}`}
        />
    )
}

// A faint neighbouring tray/menu-bar item, so the OpenAdapt mark reads as one
// indicator among the usual system items rather than a lone floating glyph.
function FauxTrayItem({ className = 'h-3 w-3 rounded-[3px]' }) {
    return (
        <span
            aria-hidden="true"
            className={`inline-block bg-ink-3/40 ${className}`}
        />
    )
}

function WindowFrame({ title, children }) {
    return (
        <div className="overflow-hidden rounded-xl border border-hairline bg-panel shadow-sm">
            <div className="flex items-center gap-2 border-b border-hairline px-4 py-2.5">
                <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"
                />
                <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-[#febc2e]"
                />
                <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-[#28c840]"
                />
                <span className="ml-2 text-xs font-medium text-ink-3">
                    {title}
                </span>
            </div>
            {children}
        </div>
    )
}

// A neutral Windows-style chrome (title left, window controls right) so the
// installer stills read as Windows without borrowing the macOS traffic lights.
// Note: no `h-full` here — these frames are figure children inside a stretched
// grid, and stretching the frame to the figure's full height would push the
// figcaption out of its box and overlap the following content.
function WindowsFrame({ title, children }) {
    return (
        <div className="overflow-hidden rounded-xl border border-hairline bg-panel shadow-sm">
            <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
                <span className="text-xs font-medium text-ink-3">{title}</span>
                <span aria-hidden="true" className="flex items-center gap-2">
                    <span className="h-2 w-2.5 border-b border-ink-3" />
                    <span className="h-2.5 w-2.5 border border-ink-3" />
                    <span className="text-xs leading-none text-ink-3">
                        &times;
                    </span>
                </span>
            </div>
            {children}
        </div>
    )
}

// Highlight chip that marks the OpenAdapt mark as the active/selected tray
// indicator (as an OS renders the icon when its menu is open).
function TrayIndicator() {
    return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-ink/10 text-ink ring-1 ring-inset ring-ink/15">
            <TrayGlyph className="h-4 w-4" />
        </span>
    )
}

// macOS: top menu bar. Active app title at the left, status items (with the
// OpenAdapt indicator) and the clock at the right.
function MacTray() {
    return (
        <div className="overflow-hidden rounded-xl border border-hairline bg-ground shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-hairline bg-panel px-3 py-1.5">
                <div className="flex items-center gap-2.5 text-[11px] leading-none">
                    <span className="font-semibold text-ink">OpenAdapt</span>
                    <span className="hidden text-ink-3 sm:inline">File</span>
                    <span className="hidden text-ink-3 sm:inline">Edit</span>
                </div>
                <div className="flex items-center gap-2 text-ink-3">
                    <FauxTrayItem className="h-3 w-3 rounded-[3px]" />
                    <FauxTrayItem className="h-3 w-3 rounded-full" />
                    <TrayIndicator />
                    <span className="text-[11px] leading-none tabular-nums text-ink-2">
                        9:41
                    </span>
                </div>
            </div>
            <div className="h-20 bg-ground" />
        </div>
    )
}

// Linux (GNOME-style): top panel. Activities at the left, clock centred,
// indicator area (with the OpenAdapt indicator) at the right.
function LinuxTray() {
    return (
        <div className="overflow-hidden rounded-xl border border-hairline bg-ground shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-hairline bg-panel px-3 py-1.5">
                <span className="text-[11px] font-medium leading-none text-ink-2">
                    Activities
                </span>
                <span className="text-[11px] leading-none tabular-nums text-ink-2">
                    9:41
                </span>
                <div className="flex items-center gap-2 text-ink-3">
                    <FauxTrayItem className="h-3 w-3 rounded-full" />
                    <FauxTrayItem className="h-3 w-3 rounded-[3px]" />
                    <TrayIndicator />
                </div>
            </div>
            <div className="h-20 bg-ground" />
        </div>
    )
}

// Windows: bottom taskbar. Start + pinned apps at the left, the system-tray
// cluster (with the OpenAdapt indicator) and clock at the right.
function WindowsTray() {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-hairline bg-ground shadow-sm">
            <div className="h-20 bg-ground" />
            <div className="flex items-center justify-between gap-2 border-t border-hairline bg-panel px-3 py-1.5">
                <div className="flex items-center gap-2 text-ink-3">
                    <FauxTrayItem className="h-3.5 w-3.5 rounded-[3px]" />
                    <FauxTrayItem className="h-3.5 w-3.5 rounded-[3px]" />
                    <FauxTrayItem className="h-3.5 w-3.5 rounded-[3px]" />
                </div>
                <div className="flex items-center gap-2 text-ink-3">
                    <span
                        aria-hidden="true"
                        className="text-[10px] leading-none text-ink-3"
                    >
                        &and;
                    </span>
                    <FauxTrayItem className="h-3 w-3 rounded-[3px]" />
                    <TrayIndicator />
                    <span className="text-right text-[10px] leading-tight tabular-nums text-ink-2">
                        9:41 AM
                    </span>
                </div>
            </div>
        </div>
    )
}

const TRAY_SURFACES = [
    {
        id: 'macos',
        label: 'macOS menu bar',
        note: 'The OpenAdapt icon sits with the status items at the right of the menu bar.',
        Chrome: MacTray,
    },
    {
        id: 'windows',
        label: 'Windows system tray',
        note: 'The OpenAdapt icon appears in the notification area at the corner of the taskbar.',
        Chrome: WindowsTray,
    },
    {
        id: 'linux',
        label: 'Linux panel',
        note: 'The OpenAdapt icon shows in the top panel indicator area (GNOME and compatible shells).',
        Chrome: LinuxTray,
    },
]

const WINDOWS_INSTALLER_STEPS = [
    {
        step: '1',
        src: '/desktop-preview/windows/installer-welcome.png',
        alt: 'NSIS setup wizard welcome page reading "Welcome to OpenAdapt Desktop Setup" with a Next button.',
        testid: 'desktop-preview-windows-welcome',
        caption: 'Welcome — the NSIS setup wizard opens.',
    },
    {
        step: '2',
        src: '/desktop-preview/windows/installer-location.png',
        alt: 'Choose Install Location page defaulting to a per-user path under AppData\\Local\\OpenAdapt Desktop; the footer reads Nullsoft Install System v3.11.',
        testid: 'desktop-preview-windows-location',
        caption:
            'Choose location — a per-user install to %LOCALAPPDATA%\\OpenAdapt Desktop, no admin rights needed.',
    },
    {
        step: '3',
        src: '/desktop-preview/windows/installer-finish.png',
        alt: 'Completing page reading "Completing OpenAdapt Desktop Setup" with "Run OpenAdapt Desktop" and "Create desktop shortcut" checked.',
        testid: 'desktop-preview-windows-finish',
        caption:
            'Finish: files are placed and the app launches. Earlier prereleases panicked on startup (issue #26); v0.6.2 fixes it, and the running app surfaces above are that launched app.',
    },
]

export default function DesktopPreview() {
    return (
        <div
            className="mx-auto max-w-4xl px-4 py-12"
            data-testid="desktop-preview"
        >
            <div className="border-t-2 border-ink pt-10">
                <p className="eyebrow">What you&apos;re installing</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                    Real screenshots, honest state
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                    These are unretouched captures of the real native desktop
                    app running the real wired engine, not a rendering of
                    a finished product. The workflows, runs, and the halt shown
                    below are a real local demo recording: two workflows recorded
                    via demo-record, compiled, and replayed on one machine. It is
                    local demo data, not production or customer data, and the
                    signed-in session was validated against a locally-run
                    instance of the cloud in mock mode. The pictured release
                    predates the Beta lane and uses{' '}
                    <span className="whitespace-nowrap">
                        unsigned or ad-hoc-signed
                    </span>{' '}
                    installers; see the release notes before installing.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {COCKPIT_LEAD.map((item) => (
                        <figure key={item.src}>
                            <WindowFrame title="OpenAdapt Desktop">
                                <img
                                    src={item.src}
                                    width={item.width}
                                    height={item.height}
                                    alt={item.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="block h-auto w-full"
                                    data-testid={item.testid}
                                />
                            </WindowFrame>
                            <figcaption className="mt-3 text-xs leading-relaxed text-ink-3">
                                <span className="font-medium text-ink-2">
                                    {item.label}.
                                </span>{' '}
                                {item.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {COCKPIT_GRID.map((item) => (
                        <figure key={item.src}>
                            <WindowFrame title="OpenAdapt Desktop">
                                <img
                                    src={item.src}
                                    width={item.width}
                                    height={item.height}
                                    alt={item.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="block h-auto w-full"
                                    data-testid={item.testid}
                                />
                            </WindowFrame>
                            <figcaption className="mt-3 text-xs leading-relaxed text-ink-3">
                                <span className="font-medium text-ink-2">
                                    {item.label}.
                                </span>{' '}
                                {item.caption}
                            </figcaption>
                        </figure>
                    ))}
                </div>

                <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink-3">
                    Every capture above is the real native app on the real
                    wired engine. The data shown is a local demo recording; it is
                    not a hosted production org and not customer data.
                </p>

                <div className="mt-12 border-t border-hairline pt-10">
                    <p className="eyebrow">The tray companion</p>
                    <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                        OpenAdapt in the tray, on macOS, Windows, and Linux
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                        <code>openadapt-tray</code> {TRAY_PACKAGE_VERSION} is a
                        separate <code>pip install openadapt-tray</code> package
                        that puts an OpenAdapt indicator in the menu bar or
                        system tray to mirror status and launch surfaces. The
                        panels below are a representation of where that icon
                        appears on each OS — they are not screenshots. The tray
                        is not included in the installers on this page, and{' '}
                        {'no released desktop build provides the companion service'}{' '}
                        it connects to yet.
                    </p>

                    <div className="mt-8 grid grid-cols-1 items-start gap-6 sm:grid-cols-3">
                        {TRAY_SURFACES.map(({ id, label, note, Chrome }) => (
                            <figure
                                key={id}
                                data-testid={`desktop-preview-tray-${id}`}
                            >
                                <Chrome />
                                <figcaption className="mt-3 text-xs leading-relaxed text-ink-3">
                                    <span className="font-medium text-ink-2">
                                        {label}.
                                    </span>{' '}
                                    {note}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>

                <div className="mt-12 border-t border-hairline pt-10">
                    <p className="eyebrow">Windows install flow</p>
                    <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                        The real NSIS installer, start to finish
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                        Captured from the actual{' '}
                        <code>
                            windows-x86_64-unsigned-nsis-setup.exe
                        </code>{' '}
                        (v{WINDOWS_INSTALLER_VERSION}) running on a real Windows
                        11 machine. This pictured predecessor is unsigned, so
                        Windows shows an Unknown Publisher warning (expected);
                        see First launch below for how to proceed safely.
                    </p>

                    <div className="mt-8 grid grid-cols-1 items-start gap-6 sm:grid-cols-3">
                        {WINDOWS_INSTALLER_STEPS.map((item) => (
                            <figure key={item.step}>
                                <WindowsFrame title="OpenAdapt Desktop Setup">
                                    <img
                                        src={item.src}
                                        width="1044"
                                        height="784"
                                        alt={item.alt}
                                        loading="lazy"
                                        decoding="async"
                                        className="block h-auto w-full"
                                        data-testid={item.testid}
                                    />
                                </WindowsFrame>
                                <figcaption className="mt-3 text-xs leading-relaxed text-ink-3">
                                    <span className="font-medium text-ink-2">
                                        Step {item.step}.
                                    </span>{' '}
                                    {item.caption}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>

                <p className="mt-6 text-xs text-ink-3">
                    Capture provenance for every screenshot is recorded in{' '}
                    <a
                        href="/desktop-preview/MANIFEST.json"
                        className="font-medium underline underline-offset-4"
                    >
                        the media manifest
                    </a>
                    .
                </p>
            </div>
        </div>
    )
}
