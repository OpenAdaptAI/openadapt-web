const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const css = fs.readFileSync(
    path.join(process.cwd(), 'styles', 'globals.css'),
    'utf8'
)

function luminance(hex) {
    const channels = [1, 3, 5].map((offset) =>
        Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
    )
    const linear = channels.map((channel) =>
        channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4
    )
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function contrast(foreground, background) {
    const values = [luminance(foreground), luminance(background)].sort(
        (left, right) => right - left
    )
    return (values[0] + 0.05) / (values[1] + 0.05)
}

test('prose links use persistent non-color affordances without flattening UI links', () => {
    assert.match(
        css,
        /main :where\(p, li, dd, blockquote, figcaption, td\) a:not\(\.btn-ink\):not\(\.btn-ghost-ink\)/
    )
    assert.match(css, /text-decoration-line: underline/)
    assert.match(css, /text-underline-offset: 0\.2em/)
    assert.match(css, /:visited/)
    assert.match(css, /\.btn-ink:hover[\s\S]*text-decoration: none/)
})

test('keyboard focus and reduced-motion behavior are global interaction contracts', () => {
    assert.match(css, /:focus-visible[\s\S]*outline: 3px solid var\(--focus-ring\)/)
    assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
    assert.match(css, /scroll-behavior: auto !important/)
    assert.match(css, /transition-duration: 0\.01ms !important/)
})

test('link and focus colors retain AA contrast on the paper ground', () => {
    const ground = '#f2f1ec'
    for (const color of ['#3e6b4f', '#2f5340', '#76512f', '#a74612']) {
        assert.ok(
            contrast(color, ground) >= 4.5,
            `${color} must retain 4.5:1 contrast on ${ground}`
        )
    }
})
