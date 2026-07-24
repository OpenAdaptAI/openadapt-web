import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
    assetForPlatform,
    DESKTOP_PLATFORMS,
    desktopReleaseLifecycle,
    isCompleteDesktopRelease,
    selectDesktopRelease,
} from '../utils/desktopRelease.js'

const url = (name) => ({
    name,
    size: 1024,
    browser_download_url: `https://github.com/OpenAdaptAI/openadapt-desktop/releases/download/test/${name}`,
})

function binaryNames(lifecycle, version = '0.7.0') {
    const prefix = `OpenAdapt-Desktop-${lifecycle}-v${version}`
    return [
        `${prefix}-macos-arm64-adhoc.dmg`,
        `${prefix}-macos-x86_64-adhoc.dmg`,
        `${prefix}-windows-x86_64-unsigned.msi`,
        `${prefix}-windows-x86_64-unsigned-nsis-setup.exe`,
        `${prefix}-linux-x86_64-unsigned.AppImage`,
        `${prefix}-linux-x86_64-unsigned.deb`,
    ]
}

function betaMetadataNames(version = '0.7.0') {
    const prefix = `OpenAdapt-Desktop-Beta-v${version}`
    return [
        `${prefix}-macos-arm64-adhoc-metadata.json`,
        `${prefix}-macos-x86_64-adhoc-metadata.json`,
        `${prefix}-windows-x86_64-unsigned-metadata.json`,
        `${prefix}-linux-x86_64-unsigned-metadata.json`,
    ]
}

function release(lifecycle, version, publishedAt) {
    const names = [
        ...binaryNames(lifecycle, version),
        ...(lifecycle === 'Beta' ? betaMetadataNames(version) : []),
        'SHA256SUMS',
    ]
    return {
        tag_name: `desktop-v${version}`,
        prerelease: true,
        draft: false,
        published_at: publishedAt,
        assets: names.map(url),
    }
}

test('accepts a complete Beta set only with checksums and per-platform provenance', () => {
    const candidate = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    assert.equal(isCompleteDesktopRelease(candidate), true)
    assert.equal(desktopReleaseLifecycle(candidate), 'beta')

    candidate.assets = candidate.assets.filter(
        (asset) => !asset.name.endsWith('windows-x86_64-unsigned-metadata.json')
    )
    assert.equal(isCompleteDesktopRelease(candidate), false)
})

test('keeps complete legacy Experimental sets discoverable during transition', () => {
    const candidate = release(
        'Experimental',
        '0.6.2',
        '2026-07-20T12:00:00Z'
    )
    assert.equal(isCompleteDesktopRelease(candidate), true)
    assert.equal(desktopReleaseLifecycle(candidate), 'experimental')
})

test('binds every Beta asset version to the release tag', () => {
    const candidate = release('Beta', '0.8.0', '2026-07-21T12:00:00Z')
    candidate.tag_name = 'desktop-v0.9.0'
    assert.equal(isCompleteDesktopRelease(candidate), false)
})

test('binds every legacy asset version to the release tag', () => {
    const candidate = release(
        'Experimental',
        '0.6.2',
        '2026-07-20T12:00:00Z'
    )
    candidate.tag_name = 'desktop-v0.6.3'
    assert.equal(isCompleteDesktopRelease(candidate), false)
})

test('never assembles a complete release by mixing lifecycle asset families', () => {
    const candidate = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    const missing = candidate.assets.findIndex((asset) =>
        asset.name.endsWith('macos-arm64-adhoc.dmg')
    )
    candidate.assets[missing] = url(
        'OpenAdapt-Desktop-Experimental-v0.7.0-macos-arm64-adhoc.dmg'
    )
    assert.equal(isCompleteDesktopRelease(candidate), false)
})

test('selects the newest complete release and preserves Experimental fallback', () => {
    const legacy = release(
        'Experimental',
        '0.6.2',
        '2026-07-20T12:00:00Z'
    )
    const beta = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    assert.equal(selectDesktopRelease([legacy, beta]), beta)
    assert.equal(selectDesktopRelease([legacy]), legacy)
})

test('selects desktop-v0.9.0 over desktop-v0.6.2 with package releases interleaved', () => {
    const legacy = release(
        'Experimental',
        '0.6.2',
        '2026-07-19T17:28:56Z'
    )
    const packageOnly = {
        tag_name: 'v0.9.0',
        prerelease: false,
        draft: false,
        published_at: '2026-07-24T02:34:42Z',
        assets: [url('openadapt_desktop-0.9.0-py3-none-any.whl')],
    }
    const current = release('Beta', '0.9.0', '2026-07-24T02:52:30Z')

    assert.equal(
        selectDesktopRelease([packageOnly, legacy, current]),
        current
    )
})

test('a complete Beta remains primary when a legacy release is newer', () => {
    const beta = release('Beta', '0.7.0', '2026-07-21T12:00:00Z')
    const laterLegacy = release(
        'Experimental',
        '0.6.3',
        '2026-07-22T12:00:00Z'
    )
    assert.equal(selectDesktopRelease([laterLegacy, beta]), beta)
})

test('platform selection stays in the chosen release lifecycle', () => {
    const assets = [
        ...release('Experimental', '0.6.2', '2026-07-20T12:00:00Z').assets,
        ...release('Beta', '0.7.0', '2026-07-21T12:00:00Z').assets,
    ]
    const windows = DESKTOP_PLATFORMS.find((platform) => platform.id === 'windows')
    assert.match(assetForPlatform(assets, windows, 'beta').name, /-Beta-/)
    assert.match(
        assetForPlatform(assets, windows, 'experimental').name,
        /-Experimental-/
    )
})

test('download copy leads with Beta without exposing the predecessor lifecycle', () => {
    const page = readFileSync(new URL('../pages/download.js', import.meta.url), 'utf8')
    assert.match(page, /Native desktop Beta/)
    assert.match(page, /Desktop release/)
    assert.doesNotMatch(page, /Experimental/)
})
