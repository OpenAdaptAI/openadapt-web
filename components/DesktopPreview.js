/**
 * DesktopPreview — real screenshots of the Experimental desktop surfaces on
 * the download page.
 *
 * Honesty contract (enforced by tests/desktopPreview.test.js and documented in
 * public/desktop-preview/MANIFEST.json):
 *  - Every image is a capture of real product code in the state it honestly
 *    renders: the cockpit's connect screen without a running engine, and the
 *    separately installed openadapt-tray package in its standalone state.
 *  - No fabricated UI, no synthetic screens, no retouching beyond cropping.
 *  - The tray is NOT part of the installers on this page and is not described
 *    as controlling a released desktop build (no released build provides the
 *    companion service it expects).
 *
 * The section is fully static: no animation, no client state, and explicit
 * image dimensions so it causes no layout shift and needs no reduced-motion
 * handling.
 */

const COCKPIT_CAPTURE_VERSION = '0.6.1'
const TRAY_PACKAGE_VERSION = '0.1.1'

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
                    These are unretouched captures of the actual Experimental
                    surfaces — shown in the state a first launch honestly
                    renders, not a mockup of a finished product.
                </p>

                <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-5">
                    <figure className="md:col-span-3">
                        <WindowFrame title="OpenAdapt Desktop">
                            <img
                                src="/desktop-preview/cockpit-connect.png"
                                width="1120"
                                height="760"
                                alt="OpenAdapt Desktop connect screen: a Sign in card with a host field, a browser sign-in button, and an ingest-token paste option."
                                loading="lazy"
                                decoding="async"
                                className="block h-auto w-full"
                                data-testid="desktop-preview-cockpit"
                            />
                        </WindowFrame>
                        <figcaption className="mt-3 text-xs leading-relaxed text-ink-3">
                            <strong className="font-medium text-ink-2">
                                The desktop app&apos;s connect screen
                            </strong>{' '}
                            — rendered from the Experimental prerelease&apos;s
                            unmodified interface code (v
                            {COCKPIT_CAPTURE_VERSION}) with no engine attached.
                            First launch asks you to sign in or paste an ingest
                            token; workflow authoring surfaces open after the
                            engine connects. Experimental prerelease, unsigned
                            or ad-hoc-signed builds — see the release notes
                            before installing.
                        </figcaption>
                    </figure>

                    <figure className="md:col-span-2">
                        <WindowFrame title="macOS menu bar">
                            <img
                                src="/desktop-preview/tray-menu.png"
                                width="290"
                                height="320"
                                alt="The openadapt-tray menu open in the macOS menu bar with items for Start Recording, Recent Captures, Open Desktop App, Open Cloud Dashboard, Sync (offline), Login, Settings, and Quit."
                                loading="lazy"
                                decoding="async"
                                className="mx-auto block h-auto w-full max-w-[290px]"
                                data-testid="desktop-preview-tray"
                            />
                        </WindowFrame>
                        <figcaption className="mt-3 text-xs leading-relaxed text-ink-3">
                            <strong className="font-medium text-ink-2">
                                The experimental tray companion
                            </strong>{' '}
                            — <code>openadapt-tray</code> {TRAY_PACKAGE_VERSION}
                            , a separate <code>pip install openadapt-tray</code>{' '}
                            package, captured live on macOS in its real
                            standalone state. It mirrors status and launches
                            surfaces; it is not included in the installers on
                            this page, and no released desktop build provides
                            the companion service it connects to yet.
                        </figcaption>
                    </figure>
                </div>

                <p className="mt-6 text-xs text-ink-3">
                    Capture provenance for both screenshots is recorded in{' '}
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
