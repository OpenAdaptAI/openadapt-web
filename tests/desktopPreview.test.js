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

test('cockpit gallery assets retain hash-bound synthetic capture provenance', () => {
    const manifest = JSON.parse(read('public/desktop-preview/MANIFEST.json'))

    // Every cockpit capture must be declared, exist on disk, and match its
    // recorded hash. The manifest is the source of truth for its capture
    // boundary; this test does not pin presentation copy.
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
        assert.ok(entry.source.capture_method, `${name} must name its capture method`)
    }

    // The stale single connect-screen still is not an approved media asset.
    assert.ok(
        !manifest.assets['cockpit-connect.png'],
        'the stale cockpit-connect.png entry must be removed'
    )

    // The manifest carries a shared cockpit provenance block that states the
    // honest synthetic-data boundary.
    assert.ok(manifest.cockpit_capture, 'manifest must declare cockpit_capture')
    assert.ok(manifest.cockpit_capture.engine)
    assert.ok(manifest.cockpit_capture.session)
    assert.ok(manifest.cockpit_capture.data)
    assert.ok(manifest.cockpit_capture.boundary)
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
