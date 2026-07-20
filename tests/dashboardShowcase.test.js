const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('the Cloud showcase renders real product screenshots, not a mockup', () => {
    // The Cloud showcase renders on the hosted onboarding page (where the Cloud
    // product is the relevant context) and, as lower-funnel product proof, on
    // the marketing homepage.
    const hosted = read('pages/hosted/welcome.js')
    const home = read('pages/index.js')
    const component = read('components/DashboardShowcase.js')

    assert.match(hosted, /import DashboardShowcase/)
    assert.match(hosted, /<DashboardShowcase \/>/)
    assert.match(home, /import DashboardShowcase/)
    assert.match(home, /<DashboardShowcase \/>/)

    assert.match(component, /OpenAdapt/)
    assert.match(component, /Cloud/)

    // It is framed as the real shipping hosted product, not a concept.
    assert.match(component, /app\.openadapt\.ai/)
    assert.match(component, /Real OpenAdapt Cloud interface/)
    assert.match(component, /hosted product running today/)

    // The stylized dark-theme fake "mini app" mockup is gone: no synthetic
    // sidebar/guided-tour scaffolding may return. Regression guard against the
    // hand-drawn app UI the founder found confusing. (These guard the fabricated
    // mockup, not motion in general: the real-screenshot showcase below does
    // legitimately auto-rotate.)
    assert.doesNotMatch(component, /Operating view/)
    assert.doesNotMatch(component, /Choose a Cloud preview state/)
    assert.doesNotMatch(component, /guided Cloud tour/)
    assert.doesNotMatch(component, /Tour paused for reduced motion/)

    // No unverifiable domain and no em dashes in the copy.
    assert.doesNotMatch(component, /demo\.openadapt\.ai/)
    assert.doesNotMatch(component, /—/)
})

test('the large slot rotates through the real frames with labeled tabs', () => {
    const component = read('components/DashboardShowcase.js')

    // Rotation is real: an auto-advancing timer cycles the large slot.
    assert.match(component, /setInterval/)
    assert.match(component, /useEffect/)

    // Every real frame is a slide, in order: dashboard, run detail, halt
    // evidence, program visualizer, workflow catalog.
    const orderedSlides = [
        { key: 'dashboard', src: '/product-preview/dashboard-workflows.png' },
        { key: 'run', src: '/cloud-preview/healthcare-run.jpg' },
        { key: 'evidence', src: '/cloud-preview/healthcare-evidence.jpg' },
        { key: 'program', src: '/cloud-preview/program-graph.png' },
        { key: 'catalog', src: '/cloud-preview/workflow-catalog.png' },
    ]
    let previousIndex = -1
    for (const slide of orderedSlides) {
        const index = component.indexOf(`key: '${slide.key}'`)
        assert.ok(index > 0, `slide ${slide.key} should be defined`)
        assert.ok(
            index > previousIndex,
            `slide ${slide.key} should keep the display order`
        )
        previousIndex = index
        assert.match(
            component,
            new RegExp(slide.src.replaceAll('/', '\\/')),
            `slide ${slide.key} should reference ${slide.src}`
        )
    }

    // Labeled, clickable tabs to jump to any frame, plus progress dots. The
    // active tab is tracked for highlighting.
    assert.match(component, /role="tablist"/)
    assert.match(component, /role="tab"/)
    assert.match(component, /data-testid="dashboard-tab"/)
    assert.match(component, /data-testid="dashboard-dots"/)
    assert.match(component, /aria-selected=\{index === active\}/)
    for (const label of [
        'Dashboard',
        'Run detail',
        'Halt evidence',
        'Program visualizer',
        'Workflow catalog',
    ]) {
        assert.match(
            component,
            new RegExp(`label: '${label}'`),
            `tab label ${label} should exist`
        )
    }

    // The tabs are real clickable THUMBNAILS (small screenshots), not plain
    // text: each tab renders a thumbnail <img> bound to the slide src, plus a
    // short label. The founder wants to see the small screenshots.
    assert.match(component, /className=\{styles\.thumbImg\}/)
    assert.match(component, /className=\{styles\.thumbLabel\}/)

    // A visible countdown fills across the active thumbnail so the visitor sees
    // time-to-next-slide. It is keyed so it restarts each slide and pauses with
    // the timer, and it is NOT gated on reduced motion (keeps rotating).
    assert.match(component, /data-testid="dashboard-countdown"/)
    assert.match(component, /className=\{styles\.timerFill\}/)
    assert.match(component, /animationPlayState: paused/)

    // Pause on hover/focus so a visitor reading a frame is not yanked forward.
    assert.match(component, /onMouseEnter=\{\(\) => setPaused\(true\)\}/)
    assert.match(component, /onMouseLeave=\{\(\) => setPaused\(false\)\}/)
    assert.match(component, /onFocus=\{\(\) => setPaused\(true\)\}/)
    assert.match(component, /onBlur=\{\(\) => setPaused\(false\)\}/)

    // Founder decision: auto-advance is NOT gated on prefers-reduced-motion, so
    // the section visibly rotates even with reduce-motion enabled. The timer
    // effect must not branch on a reduced-motion media query.
    const timerEffect = component.slice(
        component.indexOf('useEffect(() => {'),
        component.indexOf('const jumpTo')
    )
    assert.ok(timerEffect.includes('setInterval'))
    assert.doesNotMatch(timerEffect, /prefers-reduced-motion/)
    assert.doesNotMatch(timerEffect, /matchMedia/)
})

test('the showcase honestly labels the real UI without over-disclaiming', () => {
    const component = read('components/DashboardShowcase.js')

    // Founder decision: these are real product screenshots, so the visible
    // honesty note is simply that this is the real interface. The verbose
    // sample/mock-data caveat is intentionally dropped from the caption. We
    // still guard against the fabricated "mini app" mockup ever returning.
    assert.match(component, /Real OpenAdapt Cloud interface/)
    assert.doesNotMatch(component, /Operating view/)
    assert.doesNotMatch(component, /Choose a Cloud preview state/)
    assert.doesNotMatch(component, /guided Cloud tour/)

    // The trimmed caption no longer carries the long sample-data disclaimer.
    // Assert the exact figcaption is just the real-interface line (the phrase
    // may still appear in explanatory code comments, so scope to the JSX).
    const figcaption = component.slice(
        component.indexOf('<figcaption'),
        component.indexOf('</figcaption>')
    )
    assert.match(figcaption, /Real OpenAdapt Cloud interface/)
    assert.doesNotMatch(figcaption, /mock-data mode with synthetic records/)
    assert.doesNotMatch(figcaption, /not a customer or production run/)
})

test('every showcase screenshot is a real, provenance-backed Cloud capture', () => {
    const component = read('components/DashboardShowcase.js')
    const manifest = JSON.parse(read('public/product-preview/MANIFEST.json'))
    const provenance = JSON.parse(
        read('public/cloud-preview/provenance.json')
    )

    // The captures come from the real app.openadapt.ai product (openadapt-cloud)
    // in its explicit local mock mode, with obviously synthetic seed data.
    assert.equal(
        manifest.source.repository,
        'https://github.com/OpenAdaptAI/openadapt-cloud'
    )
    assert.match(manifest.source.mode, /mock/)
    assert.equal(provenance.synthetic_fixture, true)
    assert.equal(
        provenance.source.repository,
        'https://github.com/OpenAdaptAI/openadapt-cloud'
    )
    assert.match(provenance.source.commit, /^[a-f0-9]{40}$/)
    assert.match(provenance.source.mode, /mock/)

    // The large primary shot is the real workflows dashboard and is manifested.
    assert.match(component, /\/product-preview\/dashboard-workflows\.png/)
    assert.equal(
        fs.existsSync(
            path.join(root, 'public/product-preview/dashboard-workflows.png')
        ),
        true
    )
    assert.equal(
        typeof manifest.assets['dashboard-workflows.png']?.sha256,
        'string'
    )
    // Displayed large: the intrinsic capture is high-resolution. It is a
    // full-page capture at a 1280px viewport with device scale 2 (2560px wide),
    // matching the other four frames so the five share one product look.
    assert.equal(manifest.assets['dashboard-workflows.png'].width, 2560)
    assert.equal(manifest.assets['dashboard-workflows.png'].height, 1600)

    // Supporting shots: real run/evidence frames plus the newly added program
    // visualizer and workflow catalog captures. Each must exist on disk.
    const supporting = [
        '/cloud-preview/healthcare-run.jpg',
        '/cloud-preview/healthcare-evidence.jpg',
        '/cloud-preview/program-graph.png',
        '/cloud-preview/workflow-catalog.png',
    ]
    for (const asset of supporting) {
        assert.match(
            component,
            new RegExp(asset.replaceAll('/', '\\/')),
            `component should reference ${asset}`
        )
        assert.equal(
            fs.existsSync(path.join(root, 'public', asset)),
            true,
            `${asset} should exist`
        )
    }

    // The real run/evidence frames are provenance-backed with a sha256.
    for (const name of [
        'healthcare-run.jpg',
        'healthcare-evidence.jpg',
    ]) {
        assert.equal(
            typeof provenance.media[name]?.sha256,
            'string',
            `${name} should be provenance-backed`
        )
    }

    // Every rotating slide is lazy-loaded with intrinsic dimensions so the large
    // captures do not tank performance. The slides share one mapped <img> whose
    // src/width/height come from the slide record.
    const imgTags = component.match(/<img[\s\S]*?\/>/g) || []
    assert.ok(imgTags.length >= 1)
    for (const tag of imgTags) {
        assert.match(tag, /loading="lazy"/)
        assert.match(tag, /width=/)
        assert.match(tag, /height=/)
    }
    // Each slide record carries explicit intrinsic width and height.
    const widthDecls = component.match(/\bwidth:\s*\d+/g) || []
    const heightDecls = component.match(/\bheight:\s*\d+/g) || []
    assert.equal(widthDecls.length, 5)
    assert.equal(heightDecls.length, 5)
})
