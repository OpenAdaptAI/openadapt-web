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
    const component = read('components/DesktopPreview.js')
    const manifest = JSON.parse(
        read('public/desktop-preview/MANIFEST.json')
    )

    // Every image the component renders must be declared in the manifest,
    // exist on disk, and match the manifest's recorded content hash.
    const rendered = [
        ...component.matchAll(/src="\/desktop-preview\/([^"]+)"/g),
    ].map((match) => match[1])
    assert.ok(rendered.length >= 2, 'expected at least two captures')

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
