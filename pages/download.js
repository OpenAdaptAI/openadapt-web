import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import DesktopPreview from '@components/DesktopPreview'
import Footer from '@components/Footer'
import PyPIDownloadChart from '@components/PyPIDownloadChart'
import { track } from 'utils/analytics'
import {
    assetForPlatform,
    DESKTOP_PLATFORMS,
    DESKTOP_RELEASES_PAGE,
    detectDesktopPlatform,
    detectDesktopPlatformWithHints,
    releaseSigningState,
} from 'utils/desktopRelease'

function formatSize(bytes) {
    if (!bytes && bytes !== 0) return ''
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
}

export async function getStaticProps() {
    // The release list is fetched at build/revalidate time so visitor
    // browsers never call api.github.com (60 unauthenticated req/hr per
    // client IP means shared IPs got 403s and a broken download page).
    const { getDesktopRelease } = await import('../lib/githubApi')
    const { release, fetchFailed } = await getDesktopRelease()
    return { props: { release, fetchFailed }, revalidate: 60 }
}

export default function DownloadPage({ release, fetchFailed }) {
    // ready | none | error — decided at build time, rendered in initial HTML.
    const status = release ? 'ready' : fetchFailed ? 'error' : 'none'
    const [detectedId, setDetectedId] = useState(null)

    useEffect(() => {
        let active = true
        const navigatorValue =
            typeof navigator === 'undefined' ? null : navigator
        setDetectedId(detectDesktopPlatform(navigatorValue))
        detectDesktopPlatformWithHints(navigatorValue).then((next) => {
            if (active) setDetectedId(next)
        })
        return () => {
            active = false
        }
    }, [])

    const assets =
        release && Array.isArray(release.assets) ? release.assets : []
    const lifecycle = release?.lifecycle === 'beta' ? 'beta' : 'experimental'
    const releaseLabel =
        lifecycle === 'beta' ? 'Beta release' : 'Desktop release'

    // Resolve a download for each platform card.
    const platformDownloads = useMemo(
        () =>
            DESKTOP_PLATFORMS.map((p) => ({
                platform: p,
                asset: assetForPlatform(assets, p, lifecycle),
            })),
        [assets, lifecycle]
    )

    const recommended = useMemo(
        () =>
            platformDownloads.find(
                (d) => d.platform.id === detectedId && d.asset
            ) || null,
        [platformDownloads, detectedId]
    )
    const macosDownloads = useMemo(
        () =>
            platformDownloads.filter(({ platform, asset }) =>
                platform.id.startsWith('macos-') && asset
            ),
        [platformDownloads]
    )

    const version = release ? release.tag_name || release.name : null
    const signing = useMemo(
        () => releaseSigningState(assets, lifecycle),
        [assets, lifecycle]
    )
    const checksumAsset = assets.find((asset) => asset.name === 'SHA256SUMS')

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Install OpenAdapt | OpenAdapt</title>
                <meta
                    name="description"
                    content="Install the working OpenAdapt engine, or inspect native desktop packaging for Windows, macOS, and Linux."
                />
                <link rel="canonical" href="https://openadapt.ai/download" />
                <meta
                    property="og:title"
                    content="Install OpenAdapt | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="Install the OpenAdapt engine and inspect native desktop packaging for Windows, macOS, and Linux."
                />
                <meta
                    property="og:url"
                    content="https://openadapt.ai/download"
                />
            </Head>

            {/* Hero */}
            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">Install OpenAdapt</p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Start with the OpenAdapt CLI
                </h1>
                <p className="mt-5 max-w-2xl text-base text-ink-2 md:text-lg">
                    The flagship{' '}
                    <a
                        href="https://github.com/OpenAdaptAI/OpenAdapt"
                        className="font-medium underline underline-offset-4"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        OpenAdapt project
                    </a>{' '}
                    installs the compiler and governed runtime under the unified{' '}
                    <code>openadapt flow</code> command. Native OpenAdapt
                    Desktop Beta installers package that workflow engine for
                    Windows, macOS, and Linux.
                </p>
                <pre className="mt-6 max-w-2xl overflow-x-auto rounded-xl border border-hairline bg-panel p-4 font-mono text-sm text-ink">
                    <code>pip install openadapt</code>
                </pre>

                <div className="mt-6 flex flex-wrap gap-3">
                    <a
                        href="https://docs.openadapt.ai/get-started/"
                        className="btn-ink"
                    >
                        Read docs
                    </a>
                    <a href="#desktop-builds" className="btn-ghost-ink">
                        View desktop builds
                    </a>
                </div>

                {/* Recommended download */}
                <div id="desktop-builds" className="mt-12 scroll-mt-8">
                    <p className="eyebrow">Desktop packaging</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Native desktop Beta
                    </h2>
                    {status === 'ready' && recommended && (
                        <div className="rounded-2xl border-2 border-ink bg-panel p-6 md:p-7">
                            <p className="eyebrow">Recommended for you</p>
                            <p className="font-display mt-2 text-xl font-semibold tracking-tight text-ink">
                                {recommended.platform.label}
                                {recommended.platform.arch
                                    ? ` (${recommended.platform.arch})`
                                    : ''}
                            </p>
                            <p className="mt-1 text-sm text-ink-2">
                                {recommended.platform.hint}
                                {recommended.asset.size
                                    ? ` · ${formatSize(recommended.asset.size)}`
                                    : ''}
                            </p>
                            <div className="mt-4">
                                <a
                                    href={
                                        recommended.asset.browser_download_url
                                    }
                                    className="btn-ink"
                                    onClick={() =>
                                        track('download_click', {
                                            platform: recommended.platform.id,
                                            version,
                                            recommended: true,
                                        })
                                    }
                                >
                                    Download for {recommended.platform.label}
                                </a>
                            </div>
                            {version && (
                                <p className="mt-3 text-xs text-ink-3">
                                    {releaseLabel} {version}
                                </p>
                            )}
                        </div>
                    )}

                    {status === 'ready' &&
                        detectedId === 'macos' &&
                        macosDownloads.length > 0 && (
                            <div className="rounded-2xl border-2 border-ink bg-panel p-6 md:p-7">
                                <p className="eyebrow">macOS detected</p>
                                <p className="font-display mt-2 text-xl font-semibold tracking-tight text-ink">
                                    Choose your Mac processor
                                </p>
                                <p className="mt-2 text-sm text-ink-2">
                                    Choose Apple Silicon for M1, M2, M3, M4, or
                                    later Macs. Choose Intel for older
                                    Intel-based Macs. You can confirm this from
                                    Apple menu → About This Mac.
                                </p>
                                <div className="mt-5 flex flex-wrap gap-3">
                                    {macosDownloads.map(
                                        ({ platform, asset }) => (
                                            <a
                                                key={platform.id}
                                                href={
                                                    asset.browser_download_url
                                                }
                                                className="btn-ink"
                                                onClick={() =>
                                                    track('download_click', {
                                                        platform: platform.id,
                                                        version,
                                                        recommended: true,
                                                        architectureChooser:
                                                            true,
                                                    })
                                                }
                                            >
                                                Download for {platform.arch}
                                            </a>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {status === 'ready' &&
                        !recommended &&
                        detectedId !== 'macos' && (
                        <div>
                            <p className="eyebrow">
                                {releaseLabel} {version}
                            </p>
                            <p className="mt-2 text-sm text-ink-2">
                                Choose the build that matches your operating
                                system and processor below.
                            </p>
                        </div>
                    )}

                    {status === 'none' && (
                        <div className="rounded-2xl border border-hairline bg-panel p-6">
                            <p className="font-display text-lg font-semibold text-ink">
                                No complete native desktop release yet
                            </p>
                            <p className="mt-2 max-w-2xl text-sm text-ink-2">
                                The next complete Beta set has not been
                                published yet. Use{' '}
                                <code>pip install openadapt</code>, or watch the
                                desktop releases page for the native build.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <a
                                    href={DESKTOP_RELEASES_PAGE}
                                    className="btn-ink"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Watch releases on GitHub
                                </a>
                                <a
                                    href="https://docs.openadapt.ai"
                                    className="btn-ghost-ink"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Read docs
                                </a>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="rounded-2xl border border-hairline bg-panel p-6">
                            <p className="font-display text-lg font-semibold text-ink">
                                We could not reach GitHub just now
                            </p>
                            <p className="mt-2 max-w-2xl text-sm text-ink-2">
                                The download list is served from GitHub
                                Releases. You can open the releases page
                                directly to inspect the published builds.
                            </p>
                            <div className="mt-4">
                                <a
                                    href={DESKTOP_RELEASES_PAGE}
                                    className="btn-ink"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open releases on GitHub
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* All platforms */}
            {status === 'ready' && (
                <div className="mx-auto max-w-4xl px-4 pb-4">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                        All downloads
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                        Every installer in the latest {releaseLabel.toLowerCase()}
                        {version ? ` (${version})` : ''}. Choose the one that
                        matches your machine.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {platformDownloads.map(({ platform, asset }) => (
                            <div
                                key={platform.id}
                                className="flex flex-col rounded-xl border border-hairline bg-panel p-5"
                            >
                                <p className="font-display text-base font-semibold text-ink">
                                    {platform.label}
                                    {platform.arch ? ` (${platform.arch})` : ''}
                                </p>
                                <p className="mt-1 text-sm text-ink-2">
                                    {platform.hint}
                                    {asset && asset.size
                                        ? ` · ${formatSize(asset.size)}`
                                        : ''}
                                </p>
                                <div className="mt-4">
                                    {asset ? (
                                        <a
                                            href={asset.browser_download_url}
                                            className="text-accent font-medium underline underline-offset-4"
                                            onClick={() =>
                                                track('download_click', {
                                                    platform: platform.id,
                                                    version,
                                                    recommended: false,
                                                })
                                            }
                                        >
                                            Download →
                                        </a>
                                    ) : (
                                        <span className="text-sm text-ink-3">
                                            Not available in this release
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-sm text-ink-3">
                        Looking for a different build or an older version?{' '}
                        <a
                            href={DESKTOP_RELEASES_PAGE}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Browse all releases on GitHub
                        </a>
                        .
                    </p>
                </div>
            )}

            {/* Real captures of the native desktop surfaces (see component). */}
            <DesktopPreview />

            {/* Guidance is tied to the signing labels in the published assets. */}
            {status === 'ready' &&
                (!signing.macosNotarized || !signing.windowsSigned) && (
                    <div className="mx-auto max-w-4xl px-4 py-12">
                        <div className="border-t-2 border-ink pt-10">
                            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                                First launch
                            </h2>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                                Current native builds may trigger an
                                operating-system publisher warning. Verify the
                                release checksum before overriding it.
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                {!signing.macosNotarized && (
                                    <div className="rounded-xl border border-hairline bg-panel p-5">
                                        <p className="font-display text-base font-semibold text-ink">
                                            macOS
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                            The DMGs are ad-hoc signed, not yet
                                            Developer ID notarized. In Finder,
                                            Control-click OpenAdapt Desktop,
                                            choose Open, then confirm Open. Only
                                            override Gatekeeper after verifying
                                            the release checksum.
                                        </p>
                                    </div>
                                )}
                                {!signing.windowsSigned && (
                                    <div className="rounded-xl border border-hairline bg-panel p-5">
                                        <p className="font-display text-base font-semibold text-ink">
                                            Windows
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                            The Windows installers are not yet
                                            Authenticode signed, so Windows warns
                                            that the publisher is unknown — this
                                            is expected. On the &quot;Open File -
                                            Security Warning&quot; dialog shown
                                            below (or a SmartScreen &quot;Windows
                                            protected your PC&quot; prompt, where
                                            you choose More info), verify the
                                            release checksum first, then choose
                                            Run.
                                        </p>
                                        <figure className="mt-4">
                                            <img
                                                src="/desktop-preview/windows/security-warning-unsigned.png"
                                                width="990"
                                                height="740"
                                                alt='Windows "Open File - Security Warning" dialog reading "The publisher could not be verified" with Publisher: Unknown Publisher for the unsigned NSIS setup .exe, and Run and Cancel buttons.'
                                                loading="lazy"
                                                decoding="async"
                                                className="block h-auto w-full rounded-lg border border-hairline"
                                                data-testid="download-windows-security-warning"
                                            />
                                            <figcaption className="mt-2 text-xs leading-relaxed text-ink-3">
                                                The real warning on the pictured
                                                unsigned build: &quot;Unknown
                                                Publisher.&quot; It appears
                                                because the installer is
                                                unsigned, not because anything is
                                                wrong with the download.
                                            </figcaption>
                                        </figure>
                                    </div>
                                )}
                            </div>
                            {checksumAsset && (
                                <p className="mt-4 text-xs text-ink-3">
                                    <a
                                        href={
                                            checksumAsset.browser_download_url
                                        }
                                        className="font-medium underline underline-offset-4"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download SHA256SUMS
                                    </a>{' '}
                                    and verify GitHub build provenance from the
                                    release before installing.
                                </p>
                            )}
                        </div>
                    </div>
                )}

            {/* CTA */}
            <div className="mx-auto max-w-4xl px-4 pb-16">
                <div className="rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Need the working workflow engine?
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Start with <code>pip install openadapt</code>, or bring the workflow
                        you most want to automate to a 30-minute call.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/#open-source" className="btn-ink">
                            Try locally
                        </Link>
                        <a
                            href="https://docs.openadapt.ai"
                            className="btn-ghost-ink"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read docs
                        </a>
                    </div>
                </div>
            </div>

            <div className="mx-auto w-full max-w-5xl px-4 pb-12">
                <PyPIDownloadChart />
            </div>

            <Footer />
        </div>
    )
}
