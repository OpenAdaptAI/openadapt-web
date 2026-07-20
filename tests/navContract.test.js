const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const read = (relative) =>
    fs.readFileSync(path.join(process.cwd(), relative), 'utf8')

const links = read('data/developerLinks.js')
const nav = read('components/NavHeader.js')
const developers = read('components/Developers.js')
const footer = read('components/Footer.js')

test('developer ecosystem links have a single canonical source', () => {
    // Canonical destinations live in data/developerLinks.js only.
    assert.match(links, /https:\/\/blog\.openadapt\.ai/)
    for (const [label, href] of [
        [
            'Compiler/runtime source',
            'https://github.com/OpenAdaptAI/openadapt-flow',
        ],
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

    // The nav consumes the shared module rather than restating hrefs. The
    // in-funnel open-source section (components/Developers.js) no longer
    // renders these developer ecosystem links — they live in the nav and
    // footer only (conversion cleanup) — so it does not import the module.
    assert.match(
        nav,
        /import \{ BLOG_LINK, DEVELOPER_LINKS \} from 'data\/developerLinks'/
    )
    assert.doesNotMatch(developers, /https:\/\/docs\.openadapt\.ai/)
    assert.doesNotMatch(nav, /https:\/\/docs\.openadapt\.ai/)
})

test('top navigation consolidates solutions, product and developer destinations', () => {
    for (const [label, href] of [
        ['Healthcare', '/solutions/healthcare'],
        ['Lending', '/solutions/lending'],
        ['Insurance', '/solutions/insurance'],
    ]) {
        assert.ok(
            nav.includes(`{ label: '${label}', href: '${href}' }`),
            `Solutions carries ${label} → ${href}`
        )
    }
    assert.match(nav, /dropdown: SOLUTIONS_LINKS/)

    for (const [label, href] of [
        ['How it runs', '/#product-status'],
        ['Safety', '/safety'],
        ['Compare', '/compare'],
        ['Templates', '/templates'],
        ['Download', '/download'],
    ]) {
        assert.ok(
            nav.includes(`{ label: '${label}', href: '${href}' }`),
            `Product carries ${label} → ${href}`
        )
    }
    assert.match(nav, /dropdown: PRODUCT_LINKS/)

    assert.match(nav, /\{ label: 'Launch', href: '\/#pricing' \}/)
    assert.match(nav, /label: BLOG_LINK\.label, href: BLOG_LINK\.href/)

    assert.match(nav, /label: 'Developers',\s+dropdown: DEVELOPER_LINKS/)
    assert.match(
        nav,
        /label: 'Open source',\s+href: 'https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt'/
    )
    assert.doesNotMatch(
        links,
        /label: 'Compiler\/runtime source',\s+href: 'https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt'/
    )

    assert.doesNotMatch(nav, /'\/about'/)
    assert.match(footer, /href="\/about"/)
})

test('all dropdowns share the same keyboard, pointer and ARIA behavior', () => {
    assert.equal(
        nav.match(/aria-haspopup="true"/g).length,
        1,
        'one reusable dropdown trigger implementation'
    )
    assert.match(nav, /function NavDropdown\(\{ label, links, menuId, align \}\)/)
    for (const menuId of [
        'nav-solutions-menu',
        'nav-product-menu',
        'nav-developers-menu',
    ]) {
        assert.ok(nav.includes(`menuId: '${menuId}'`), menuId)
    }

    assert.match(nav, /aria-expanded=\{open\}/)
    assert.match(nav, /aria-controls=\{menuId\}/)
    assert.match(nav, /case 'Escape':/)
    assert.match(nav, /case 'ArrowDown':/)
    assert.match(nav, /case 'ArrowUp':/)
    assert.match(nav, /addEventListener\('pointerdown', onPointerDown\)/)
    assert.match(nav, /mobileGroupLabel/)
})
