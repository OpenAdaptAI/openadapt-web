const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('every homepage process visual follows the selected real reference app', () => {
    const howItWorks = read('components/HowItWorks.js')
    const panels = read('components/ReferenceStagePanel.js')
    const panelStyles = read('components/ReferenceStagePanel.module.css')

    assert.match(howItWorks, /import ReferenceStagePanel/)
    for (const key of ['healthcare', 'lending', 'insurance']) {
        assert.match(howItWorks, new RegExp(`key: '${key}'`))
    }
    for (const stage of ['record', 'compile', 'replay', 'resolve', 'verify']) {
        assert.match(howItWorks, new RegExp(`visualKey: '${stage}'`))
    }
    assert.match(howItWorks, /selectedReference\[\s*step\.visualKey\s*\]/)
    assert.match(howItWorks, /reference=\{selectedReference\}/)
    assert.doesNotMatch(howItWorks, /manifest\.steps\.(compile|heal|audit)/)
    assert.doesNotMatch(howItWorks, /MockMed|shared engine lifecycle/)

    const selectedAppSources = {
        healthcare: [
            '/how-it-works/record_openemr.gif',
            '/how-it-works/run_openemr.gif',
        ],
        lending: [
            '/lending-demo/record-frappe.gif',
            '/lending-demo/replay-frappe.gif',
        ],
        insurance: [
            '/insurance-demo/record-openimis.gif',
            '/insurance-demo/replay-openimis.gif',
        ],
    }
    for (const sources of Object.values(selectedAppSources)) {
        for (const source of sources) {
            assert.match(howItWorks, new RegExp(source.replaceAll('/', '\\/')))
        }
    }
    assert.equal(
        new Set(Object.values(selectedAppSources).flat()).size,
        6,
        'each reference app must use its own media sources'
    )

    for (const stage of ['compile', 'resolve', 'verify']) {
        assert.match(panels, new RegExp(`stage="${stage}"`))
    }
    assert.match(panels, /data-reference=\{reference\.key\}/)
    assert.match(panels, /data-stage-source=\{media\.src\}/)
    assert.match(panels, /src=\{media\.src\}/)
    assert.match(panels, /className=\{styles\.application\}/)
    assert.doesNotMatch(panels, /sourceChip/)
    const sceneMarkup = panels.slice(
        panels.indexOf('<div className={styles.scene}>'),
        panels.indexOf('<figcaption')
    )
    assert.doesNotMatch(sceneMarkup, /sourceLabel|sourceChip/)
    assert.match(panels, /OpenAdapt produces/)
    assert.doesNotMatch(panels, /MockMed/)
    assert.match(panelStyles, /animation: cardEnter/)
    assert.match(panelStyles, /@keyframes openemrTargets/)
    assert.match(panelStyles, /@keyframes frappeTargets/)
    assert.match(panelStyles, /@keyframes openimisTargets/)
    assert.match(panelStyles, /steps\(1, end\)/)
    assert.match(
        panelStyles,
        /prefers-reduced-motion:[\s\S]*?\.targetMarker\s*\{[\s\S]*?display: none/
    )
    assert.match(panelStyles, /animation: checkReveal/)
})

test('resolve tracks are app-specific and synchronized to each replay', () => {
    const howItWorks = read('components/HowItWorks.js')
    const panels = read('components/ReferenceStagePanel.js')

    const tracks = [
        ['openemrTargets', '6.58s'],
        ['frappeTargets', '10.18s'],
        ['openimisTargets', '19.79s'],
    ]
    for (const [animationClass, duration] of tracks) {
        assert.match(
            howItWorks,
            new RegExp(
                `animationClass: '${animationClass}'[\\s\\S]*?duration: '${duration.replace(
                    '.',
                    '\\.'
                )}'`
            )
        )
    }
    assert.equal(
        new Set(tracks.map(([animationClass]) => animationClass)).size,
        tracks.length
    )
    assert.equal(
        new Set(tracks.map(([, duration]) => duration)).size,
        tracks.length
    )
    assert.match(panels, /data-resolve-track=\{track\.animationClass\}/)
    assert.match(panels, /data-resolve-duration=\{track\.duration\}/)
    assert.match(panels, /styles\[track\.animationClass\]/)
    assert.match(panels, /data-media-ready=\{mediaReady \? 'true' : 'false'\}/)
    assert.match(panels, /new IntersectionObserver/)
    assert.match(panels, /key=\{mediaToken\}/)
    assert.match(panels, /onLoad=\{\(\) => setLoadedMedia\(mediaToken\)\}/)
})

test('industry panels distinguish bounded evidence from required qualification', () => {
    const howItWorks = read('components/HowItWorks.js')

    assert.match(
        howItWorks,
        /healthcare:[\s\S]*?status: 'qualification required'[\s\S]*?qualified: false/
    )
    assert.match(howItWorks, /effect oracle', 'not established by this media'/i)
    assert.match(howItWorks, /No application-specific audit result claimed/)
    assert.match(howItWorks, /status: '6 \/ 6 verified'/)
    assert.match(howItWorks, /0 silent incorrect successes/)
    assert.match(howItWorks, /status: '3 \/ 3 verified'/)
    assert.match(howItWorks, /0 duplicate claims/)
    assert.match(
        howItWorks,
        /Every stage uses the selected reference application/
    )
})

test('primary navigation exposes Insurance and collapses before links crowd', () => {
    const nav = read('components/NavHeader.js')
    const css = read('components/NavHeader.module.css')

    assert.match(nav, /label: 'Insurance', href: '\/solutions\/insurance'/)
    // 1200px: the twelve-item nav (Blog + Developers dropdown included)
    // collapses to the mobile menu before links crowd, while the
    // 1280px-wide desktop contract in cypress/e2e/basic.cy.js still
    // sees the full link row.
    assert.match(css, /@media \(max-width: 1200px\)/)
    assert.match(css, /max-height: calc\(100vh - 60px\)/)
    assert.match(css, /overflow-y: auto/)
    assert.match(css, /@media \(max-width: 420px\)/)
})
