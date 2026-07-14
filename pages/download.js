import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import { track } from 'utils/analytics'

const REPO = 'OpenAdaptAI/openadapt-desktop'
const RELEASES_API = `https://api.github.com/repos/${REPO}/releases/latest`
const RELEASES_PAGE = `https://github.com/${REPO}/releases`

// Platform definitions. `match` classifies a release asset by filename so the
// page stays correct no matter how the CI names its artifacts, as long as the
// extension and arch token are present.
const PLATFORMS = [
    {
        id: 'windows',
        label: 'Windows',
        arch: 'x64',
        hint: '.msi installer (or .exe)',
        match: (name) =>
            /\.msi$/i.test(name) ||
            (/\.exe$/i.test(name) && /setup/i.test(name)),
        // Prefer the .msi over the NSIS .exe when both are present.
        rank: (name) => (/\.msi$/i.test(name) ? 0 : 1),
    },
    {
        id: 'macos-arm',
        label: 'macOS',
        arch: 'Apple Silicon',
        hint: '.dmg for M1 and later',
        match: (name) => /\.dmg$/i.test(name) && /(aarch64|arm64)/i.test(name),
        rank: () => 0,
    },
    {
        id: 'macos-x64',
        label: 'macOS',
        arch: 'Intel',
        hint: '.dmg for Intel Macs',
        match: (name) =>
            /\.dmg$/i.test(name) && /(x64|x86_64|intel)/i.test(name),
        rank: () => 0,
    },
    {
        id: 'linux',
        label: 'Linux',
        arch: 'x64',
        hint: '.AppImage (or .deb)',
        match: (name) => /\.appimage$/i.test(name) || /\.deb$/i.test(name),
        rank: (name) => (/\.appimage$/i.test(name) ? 0 : 1),
    },
]

// Best-effort OS + arch detection so we can surface the right build first.
// Returns a platform id, or null when we cannot tell.
function detectPlatformId() {
    if (typeof navigator === 'undefined') return null
    const ua = (navigator.userAgent || '').toLowerCase()
    const platform = (navigator.platform || '').toLowerCase()

    if (/win/.test(ua) || /win/.test(platform)) return 'windows'
    if (/linux/.test(ua) && !/android/.test(ua)) return 'linux'
    if (/mac/.test(ua) || /mac/.test(platform)) {
        // On Apple Silicon, WebGL/renderer and touch heuristics are unreliable;
        // default to Apple Silicon (the common case) and let the user pick
        // Intel from the full list if needed.
        return 'macos-arm'
    }
    return null
}

// Given a release's assets and a platform, pick the best matching download.
function assetForPlatform(assets, platform) {
    const candidates = assets
        .filter((a) => platform.match(a.name))
        .sort((a, b) => platform.rank(a.name) - platform.rank(b.name))
    return candidates[0] || null
}

function formatSize(bytes) {
    if (!bytes && bytes !== 0) return ''
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
}

export default function DownloadPage() {
    const [status, setStatus] = useState('loading') // loading | ready | none | error
    const [release, setRelease] = useState(null)
    const [detectedId, setDetectedId] = useState(null)

    useEffect(() => {
        setDetectedId(detectPlatformId())

        let cancelled = false
        async function load() {
            try {
                const res = await fetch(RELEASES_API, {
                    headers: { Accept: 'application/vnd.github+json' },
                })
                if (cancelled) return
                if (res.status === 404) {
                    setStatus('none')
                    return
                }
                if (!res.ok) {
                    setStatus('error')
                    return
                }
                const data = await res.json()
                setRelease(data)
                const hasAssets =
                    Array.isArray(data.assets) && data.assets.length > 0
                setStatus(hasAssets ? 'ready' : 'none')
            } catch (err) {
                if (!cancelled) setStatus('error')
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [])

    const assets =
        release && Array.isArray(release.assets) ? release.assets : []

    // Resolve a download for each platform card.
    const platformDownloads = useMemo(
        () =>
            PLATFORMS.map((p) => ({
                platform: p,
                asset: assetForPlatform(assets, p),
            })),
        [assets]
    )

    const recommended = useMemo(
        () =>
            platformDownloads.find(
                (d) => d.platform.id === detectedId && d.asset
            ) || null,
        [platformDownloads, detectedId]
    )

    const version = release ? release.tag_name || release.name : null

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Download OpenAdapt Desktop | OpenAdapt</title>
                <meta
                    name="description"
                    content="Download OpenAdapt Desktop for Windows, macOS, and Linux. Record a workflow once and replay it as a self-healing automation on your own machine. Open source, MIT licensed."
                />
                <link rel="canonical" href="https://openadapt.ai/download" />
                <meta
                    property="og:title"
                    content="Download OpenAdapt Desktop | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="Installers for Windows, macOS, and Linux. Record once, replay as a self-healing automation on your own machine."
                />
                <meta
                    property="og:url"
                    content="https://openadapt.ai/download"
                />
            </Head>

            {/* Hero */}
            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">Download</p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Get OpenAdapt Desktop
                </h1>
                <p className="mt-5 max-w-2xl text-base text-ink-2 md:text-lg">
                    Record a workflow once. OpenAdapt compiles it into a
                    self-healing automation that replays on your own machine.
                    Healthy runs make no cloud model calls, and your recordings
                    stay local. Open source, MIT licensed.
                </p>

                {/* Recommended download */}
                <div className="mt-8">
                    {status === 'loading' && (
                        <p className="text-sm text-ink-3">
                            Finding the latest release...
                        </p>
                    )}

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
                                    Latest release {version}
                                </p>
                            )}
                        </div>
                    )}

                    {status === 'ready' && !recommended && (
                        <p className="text-sm text-ink-2">
                            We could not detect your operating system
                            automatically. Pick your platform below.
                        </p>
                    )}

                    {status === 'none' && (
                        <div className="rounded-2xl border border-hairline bg-panel p-6">
                            <p className="font-display text-lg font-semibold text-ink">
                                Installers are on the way
                            </p>
                            <p className="mt-2 max-w-2xl text-sm text-ink-2">
                                The first public build has not been published
                                yet. In the meantime you can run OpenAdapt from
                                source, and you can watch the releases page to
                                be notified when installers land.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <a
                                    href={RELEASES_PAGE}
                                    className="btn-ink"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Watch releases on GitHub
                                </a>
                                <a
                                    href={`https://github.com/${REPO}`}
                                    className="btn-ghost-ink"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Run from source
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
                                directly to grab the right installer.
                            </p>
                            <div className="mt-4">
                                <a
                                    href={RELEASES_PAGE}
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
                        Every installer for the latest release
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
                                            className="text-accent font-medium"
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
                            href={RELEASES_PAGE}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Browse all releases on GitHub
                        </a>
                        .
                    </p>
                </div>
            )}

            {/* Get past the OS warning */}
            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="border-t-2 border-ink pt-10">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                        First time you open it
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                        These builds are not code-signed yet, so your operating
                        system will show a one-time warning before the first
                        launch. Here is exactly how to get past it.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-hairline bg-panel p-5">
                            <p className="font-display text-base font-semibold text-ink">
                                macOS
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                macOS will say the app is from an unidentified
                                developer. To open it the first time:
                                right-click (or Control-click) OpenAdapt in
                                Applications, choose Open, then Open again.
                                macOS remembers your choice, so you will not see
                                this again. We are rolling out Apple
                                notarization shortly.
                            </p>
                        </div>
                        <div className="rounded-xl border border-hairline bg-panel p-5">
                            <p className="font-display text-base font-semibold text-ink">
                                Windows
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                Windows SmartScreen may show a blue
                                &quot;Windows protected your PC&quot; banner.
                                Click More info, then Run anyway to install.
                                This appears because the installer is not
                                code-signed yet. Signing is on our roadmap.
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-ink-3">
                        Both warnings are expected for unsigned software and do
                        not indicate a problem with the download.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="mx-auto max-w-4xl px-4 pb-16">
                <div className="rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Want it running on a real workflow?
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring the workflow you most want to automate. Fifteen
                        minutes, one workflow, on your own machine.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/#book" className="btn-ink">
                            Book a demo
                        </Link>
                        <a
                            href="https://docs.openadapt.ai"
                            className="btn-ghost-ink"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read the docs
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
