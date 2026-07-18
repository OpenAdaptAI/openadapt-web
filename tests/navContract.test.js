const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const read = (relative) =>
    fs.readFileSync(path.join(process.cwd(), relative), 'utf8')

const links = read('data/developerLinks.js')
const nav = read('components/NavHeader.js')
const developers = read('components/Developers.js')

test('developer ecosystem links have a single canonical source', () => {
    // Canonical destinations live in data/developerLinks.js only.
    assert.match(links, /https:\/\/blog\.openadapt\.ai/)
    for (const [label, href] of [
        ['Engine source', 'https://github.com/OpenAdaptAI/OpenAdapt'],
        ['Docs', 'https://docs.openadapt.ai'],
        [
            'Technical paper source',
            'https://github.com/OpenAdaptAI/openadapt-flow/tree/main/paper',
        ],
        ['Discord', 'https://discord.gg/yF527cQbDG'],
        [
            'Report an issue',
            'https://github.com/OpenAdaptAI/openadapt-flow/issues/new/choose',
        ],
    ]) {
        assert.match(links, new RegExp(`label: '${label}'`))
        assert.ok(links.includes(`href: '${href}'`), `${label} → ${href}`)
    }

    // Both surfaces consume the shared module rather than restating hrefs.
    for (const source of [nav, developers]) {
        assert.match(
            source,
            /import \{ BLOG_LINK, DEVELOPER_LINKS \} from 'data\/developerLinks'/
        )
    }
    assert.doesNotMatch(developers, /https:\/\/docs\.openadapt\.ai/)
    assert.doesNotMatch(nav, /https:\/\/docs\.openadapt\.ai/)
})

test('top navigation exposes Blog, a Developers dropdown, and Open source', () => {
    // Blog is a top-level external item sourced from the shared module.
    assert.match(nav, /label: BLOG_LINK\.label, href: BLOG_LINK\.href/)

    // The Developers dropdown nests the developer ecosystem links.
    assert.match(nav, /label: 'Developers', dropdown: DEVELOPER_LINKS/)
    assert.match(nav, /aria-expanded=\{open\}/)
    assert.match(nav, /aria-controls="nav-developers-menu"/)
    assert.match(nav, /case 'Escape':/)
    assert.match(nav, /case 'ArrowDown':/)
    assert.match(nav, /addEventListener\('pointerdown', onPointerDown\)/)

    // Open source stays top-level and keeps pointing at the flagship repo.
    assert.match(
        nav,
        /label: 'Open source',\s+href: 'https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt'/
    )
})
