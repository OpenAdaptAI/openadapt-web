const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('download page shows the desktop preview section', () => {
    const download = read('pages/download.js')

    assert.match(download, /import DesktopPreview/)
    assert.match(download, /<DesktopPreview \/>/)
})

test('desktop preview uses only provenance-backed real captures', () => {
    const manifest = JSON.parse(
        read('public/desktop-preview/MANIFEST.json')
    )

    // Every /desktop-preview/ image rendered anywhere on the download page —
    // the DesktopPreview component AND the download page's First-launch
    // guidance — must be declared in the manifest, exist on disk, and match
    // the manifest's recorded content hash. Nested paths (windows/…) included.
    const sources = [
        read('components/DesktopPreview.js'),
        read('pages/download.js'),
    ]
    // Match both literal src="…" attributes and array-defined src: '…' paths
    // (the Windows install-flow stills are rendered from a mapped array), for
    // any image extension under /desktop-preview/, nested paths included.
    const rendered = [
        ...new Set(
            sources.flatMap((source) =>
                [
                    ...source.matchAll(
                        /\/desktop-preview\/([\w./-]+\.(?:png|gif|jpg|jpeg|webp))/g
                    ),
                ].map((match) => match[1])
            )
        ),
    ]
    assert.ok(rendered.length >= 2, 'expected at least two captures')
    // The real cockpit gallery (live app on the real wired engine), the Windows
    // install-flow stills, and the unsigned-warning capture all ship. The lead
    // pair is the differentiator: the workflow library and the halt evidence.
    for (const required of [
        'cockpit/10_dashboard_workflows.png',
        'cockpit/40_watchrun_halted.png',
        'cockpit/45_watchrun_verified.png',
        'cockpit/50_teach.png',
        'cockpit/20_settings.png',
        'cockpit/05_onboarding.png',
        'cockpit/30_record.png',
        'cockpit/01_login.png',
        'windows/installer-welcome.png',
        'windows/installer-location.png',
        'windows/installer-finish.png',
        'windows/security-warning-unsigned.png',
    ]) {
        assert.ok(
            rendered.includes(required),
            `expected the page to render ${required}`
        )
    }

    for (const name of rendered) {
        const entry = manifest.assets[name]
        assert.ok(entry, `manifest entry missing for ${name}`)
        const bytes = fs.readFileSync(
            path.join(root, 'public/desktop-preview', name)
        )
        const sha256 = crypto
            .createHash('sha256')
            .update(bytes)
            .digest('hex')
        assert.equal(
            sha256,
            entry.sha256,
            `${name} on disk does not match its manifest hash`
        )
    }

    // Each manifest asset records where and how it was captured.
    for (const [name, entry] of Object.entries(manifest.assets)) {
        assert.ok(
            entry.source && entry.source.capture_method,
            `capture_method missing for ${name}`
        )
    }
})

test('desktop preview leads with the product and keeps provenance accessible', () => {
    const component = read('components/DesktopPreview.js')

    assert.match(component, /See the native app/)
    assert.match(component, /synthetic workflows/)
    assert.match(component, /desktop-preview\/MANIFEST\.json/)

    // The tray remains a separate package and is not presented as part of the
    // native installer.
    assert.match(component, /pip install openadapt-tray/)
    assert.match(component, /TRAY_PACKAGE_VERSION = '0\.1\.1'/)
    assert.match(component, /Install it separately/)
    assert.doesNotMatch(component, /controls? the desktop app/i)

    // The tray is shown as a per-OS representation of where the icon lives,
    // across macOS, Windows, and Linux — and it is labelled a representation,
    // not passed off as a screenshot.
    assert.match(component, /macOS menu bar/)
    assert.match(component, /Windows system tray/)
    assert.match(component, /Linux panel/)
    assert.match(component, /are not screenshots/)
    // The mark is the project's own favicon silhouette, rendered as a CSS mask
    // so it is theme-aware — no fabricated blue-dot placeholder.
    assert.match(component, /safari-pinned-tab\.svg/)

    // Static section: no animation or client state, so it cannot violate the
    // motion tokens or shift layout.
    assert.doesNotMatch(component, /useState|useEffect|setInterval/)
    // The cockpit captures reserve their real pixel dimensions (1600px-wide
    // retina resizes) so they cause no layout shift.
    assert.match(component, /width: 1600/)
    assert.match(component, /height: 1085/)
    assert.match(component, /height: 1348/)
})

test('cockpit gallery is the real wired-engine app on honest local demo data', () => {
    const component = read('components/DesktopPreview.js')
    const manifest = JSON.parse(read('public/desktop-preview/MANIFEST.json'))

    // Every cockpit capture must be declared, exist on disk, and match its
    // recorded hash. These are the real Experimental app on the real wired
    // engine, not the old single connect-screen still.
    const cockpitAssets = [
        'cockpit/10_dashboard_workflows.png',
        'cockpit/40_watchrun_halted.png',
        'cockpit/45_watchrun_verified.png',
        'cockpit/50_teach.png',
        'cockpit/20_settings.png',
        'cockpit/05_onboarding.png',
        'cockpit/30_record.png',
        'cockpit/01_login.png',
    ]
    for (const name of cockpitAssets) {
        const entry = manifest.assets[name]
        assert.ok(entry, `manifest must declare ${name}`)
        const bytes = fs.readFileSync(
            path.join(root, 'public/desktop-preview', name)
        )
        const sha256 = crypto.createHash('sha256').update(bytes).digest('hex')
        assert.equal(
            sha256,
            entry.sha256,
            `${name} on disk does not match its manifest hash`
        )
        assert.match(
            entry.source.capture_method,
            /wired engine/,
            `${name} provenance must name the real wired engine`
        )
    }

    // The stale single connect-screen still is gone from both the manifest and
    // the component.
    assert.ok(
        !manifest.assets['cockpit-connect.png'],
        'the stale cockpit-connect.png entry must be removed'
    )
    assert.doesNotMatch(component, /cockpit-connect\.png/)

    // The manifest carries a shared cockpit provenance block that states the
    // honest boundary: real wired engine, local demo data, mock-mode cloud.
    assert.ok(manifest.cockpit_capture, 'manifest must declare cockpit_capture')
    assert.match(manifest.cockpit_capture.engine, /wired engine/)
    assert.match(manifest.cockpit_capture.session, /mock mode/)
    assert.match(manifest.cockpit_capture.session, /not a production org/)
    assert.match(manifest.cockpit_capture.data, /demo-record/)
    assert.match(manifest.cockpit_capture.boundary, /Not production data/)

    // The component leads with the differentiator (the workflow library and the
    // halt evidence) and shows the connected surfaces.
    assert.match(component, /desktop-preview\/cockpit\/10_dashboard_workflows/)
    assert.match(component, /desktop-preview\/cockpit\/40_watchrun_halted/)
    assert.match(component, /The workflow library/)
    assert.match(component, /Halt evidence/)

    // The consumer page names the synthetic boundary once and links to the full
    // provenance record instead of repeating development-state narration in
    // every caption.
    assert.match(component, /wired engine/)
    assert.match(component, /synthetic workflows/i)
    assert.match(component, /desktop-preview\/MANIFEST\.json/)
    assert.doesNotMatch(component, /mock mode|not a production org/i)

    // No overclaiming: no mockup language survives (the captures are real, not
    // mockups), and the stale launch caveat is gone because the app runs.
    assert.doesNotMatch(component, /\bmockups?\b/i)
    assert.doesNotMatch(component, /does not launch yet/)
})

test('windows install-flow keeps current product copy and signing guidance', () => {
    const component = read('components/DesktopPreview.js')
    const download = read('pages/download.js')

    // The capture version stays explicit and unsigned builds route to the
    // security-critical first-launch guidance.
    assert.match(component, /v\{WINDOWS_INSTALLER_VERSION\}/)
    assert.match(
        component,
        /Unsigned builds can trigger an Unknown\s+Publisher warning/,
        'windows section must route unsigned builds to first-launch guidance'
    )

    // Historical implementation defects do not become permanent sales copy.
    assert.doesNotMatch(
        component,
        /does not launch yet|no app window is shown|issue #26|pictured predecessor/i
    )

    // The Windows install stills reserve their real pixel aspect ratio so the
    // three-up strip causes no layout shift, and there is still no client
    // state or animation in the section.
    assert.match(component, /width="1044"\s+height="784"/)

    // The real unsigned-download warning capture is paired with the download
    // page's existing First-launch guidance and captioned honestly.
    assert.match(
        download,
        /src="\/desktop-preview\/windows\/security-warning-unsigned\.png"/,
        'the unsigned-warning capture must sit in the First-launch guidance'
    )
    assert.match(download, /width="990"\s+height="740"/)
    assert.match(
        download,
        /Unknown Publisher/,
        'the First-launch Windows guidance must name the Unknown Publisher warning'
    )
})
