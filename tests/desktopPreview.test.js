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
    // The Windows install-flow stills and the unsigned-warning capture ship.
    for (const required of [
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

test('desktop preview labels match the Experimental reality', () => {
    const component = read('components/DesktopPreview.js')

    // The desktop build is an Experimental prerelease with unsigned or
    // ad-hoc-signed artifacts, and the section says so.
    assert.match(component, /Experimental prerelease/)
    assert.match(component, /unsigned\s+or ad-hoc-signed/)

    // The tray is a separate package, carries its real version, and is not
    // claimed to control a released desktop build (no released build provides
    // the companion service it expects).
    assert.match(component, /pip install openadapt-tray/)
    assert.match(component, /TRAY_PACKAGE_VERSION = '0\.1\.1'/)
    assert.match(component, /not included in the installers/)
    assert.match(
        component,
        /no released desktop build provides\s+the companion service/
    )
    assert.doesNotMatch(component, /controls? the desktop app/i)

    // Static section: no animation or client state, so it cannot violate the
    // motion tokens or shift layout.
    assert.doesNotMatch(component, /useState|useEffect|setInterval/)
    assert.match(component, /width="1120"\s+height="760"/)
    assert.match(component, /width="290"\s+height="320"/)
})

test('windows install-flow captions stay honest about the unsigned prerelease', () => {
    const component = read('components/DesktopPreview.js')
    const download = read('pages/download.js')

    // The required honesty phrase for the Windows installer visuals: an
    // Experimental, unsigned build for which Windows shows an Unknown
    // Publisher warning, and that warning is expected.
    assert.match(
        component,
        /Experimental prerelease, unsigned/,
        'windows section must state the build is an unsigned Experimental prerelease'
    )
    assert.match(
        component,
        /Unknown Publisher warning \(expected\)/,
        'windows section must call the Unknown Publisher warning expected'
    )

    // The installer stills must NOT imply the app runs — the shipped build
    // panics at launch (openadapt-desktop issue #26). The finish caption says
    // so, and no app-window image is rendered anywhere on the page.
    assert.match(
        component,
        /does not launch yet \(issue #26\)/,
        'the finish caption must not imply the app runs'
    )
    assert.doesNotMatch(component, /app-window|app_window/i)

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
