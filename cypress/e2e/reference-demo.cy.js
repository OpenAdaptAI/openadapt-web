describe('shared real-application demo', () => {
    const routes = [
        ['/', 'healthcare', 'exact-decoded-frame-bound'],
        ['/solutions/healthcare', 'healthcare', 'exact-decoded-frame-bound'],
        ['/solutions/lending', 'lending', 'exact-decoded-frame-bound'],
        ['/solutions/insurance', 'insurance', 'exact-decoded-frame-bound'],
        ['/how-it-works', 'healthcare', 'exact-decoded-frame-bound'],
        ['/dental', 'insurance', 'exact-decoded-frame-bound'],
    ]

    for (const [route, initialReference, replayTracking] of routes) {
        it(`renders the shared evidence player on ${route}`, () => {
            cy.visit(route)
            cy.get('[data-testid="reference-demo-showcase"]')
                .first()
                .should('have.attr', 'data-active-reference', initialReference)
                .within(() => {
                    cy.get('[data-testid="reference-evidence-player"]')
                        .should(
                            'have.attr',
                            'data-target-tracking',
                            replayTracking
                        )
                    cy.get('button[data-mode-kind="recording"]').click()
                    cy.get('[data-testid="reference-evidence-player"]')
                        .should(
                            'have.attr',
                            'data-target-tracking',
                            'omitted-without-exact-timeline'
                        )
                    cy.get('button[data-mode-kind="replay"]').click()
                    cy.get('[data-testid="reference-evidence-player"]')
                        .should('have.attr', 'data-target-tracking', replayTracking)
                    cy.contains('Open the full Cloud demo')
                })
        })
    }

    it('keeps the player usable on a narrow viewport', () => {
        cy.viewport(390, 844)
        cy.visit('/solutions/lending')
        cy.get('[data-testid="reference-evidence-player"]')
            .scrollIntoView()
            .should('be.visible')
            .within(() => {
                cy.get('video').should(($video) => {
                    expect($video[0].videoWidth).to.be.greaterThan(0)
                })
                cy.get('button[aria-label="Pause"], button[aria-label="Play"]')
                    .should('have.css', 'width', '44px')
                cy.get('button[aria-label="Enter full screen"]')
                    .should('have.css', 'height', '44px')
                cy.get('[data-overlay-kind="source-metadata"]').should(
                    'not.exist'
                )
            })
    })

    for (const [label, width, height] of [
        ['desktop', 1280, 900],
        ['mobile', 390, 844],
    ]) {
        it(`keeps exact Frappe target tracking clear of the ${label} status capsule`, () => {
            cy.viewport(width, height)
            cy.visit('/solutions/lending', {
                onBeforeLoad(win) {
                    win.IntersectionObserver = class {
                        constructor(callback) {
                            this.callback = callback
                        }

                        observe() {
                            this.callback([{ isIntersecting: true }])
                        }

                        disconnect() {}
                    }
                },
            })
            cy.get('[data-testid="reference-evidence-player"]')
                .scrollIntoView()
                .as('player')
            cy.contains('a', 'Reference method').should(
                'have.attr',
                'href',
                'https://github.com/OpenAdaptAI/openadapt-flow/tree/ef33c2f4691040e39eb831f84658b941f715c290/benchmark/frappe_lending'
            )
            cy.get('@player')
                .find('video')
                .should(($video) => {
                    expect($video[0].videoWidth).to.be.greaterThan(0)
                })
                .then(($video) => {
                    const video = $video[0]
                    return new Cypress.Promise((resolve) => {
                        video.currentTime = 0.59
                        setTimeout(() => {
                            video.playbackRate = 0.25
                            video.play().then(resolve)
                        }, 100)
                    })
                })
            cy.get('@player')
                .should('have.attr', 'data-decoded-frame-index', '1')
                .then(($player) => $player.find('video')[0].pause())
                .should('contain.text', 'Evidence')
                .and('contain.text', 'Application network traffic observed')
                .find('[data-decoded-frame-index="1"]')
                .should('be.visible')
                .then(($target) => {
                    cy.get('@player')
                        .find('[data-overlay-kind="canonical-runtime-state"]')
                        .should('be.visible')
                        .and(
                            'have.attr',
                            'aria-label',
                            'OpenAdapt verified replay in Frappe Lending'
                        )
                        .then(($capsule) => {
                            const target = $target[0].getBoundingClientRect()
                            const capsule = $capsule[0].getBoundingClientRect()
                            const intersects = !(
                                target.right <= capsule.left ||
                                target.left >= capsule.right ||
                                target.bottom <= capsule.top ||
                                target.top >= capsule.bottom
                            )
                            expect(intersects).to.equal(false)
                        })
                })
            cy.contains('a', 'Qualification pack').should('be.visible')
            cy.get('@player').screenshot(`frappe-exact-target-${label}`)
        })
    }

    it('remounts exact media and supports keyboard-complete application tabs', () => {
        cy.visit('/')
        cy.get('[data-testid="reference-demo-showcase"]')
            .first()
            .as('showcase')
        cy.get('@showcase')
            .find('video')
            .should(($video) =>
                expect($video[0].currentSrc).to.include('openemr-replay.mp4')
            )
        cy.get('@showcase')
            .find('[data-overlay-kind="canonical-runtime-state"]')
            .should('contain.text', 'OpenEMR')
        cy.get('@showcase').contains('button', 'Guided view').should('be.visible')
        cy.get('@showcase').contains('button', 'Raw footage').click()
        cy.get('@showcase')
            .find('[data-testid="reference-evidence-player"]')
            .should(
                'have.attr',
                'data-target-tracking',
                'omitted-without-exact-timeline'
            )
        cy.get('@showcase').contains('button', 'Guided view').click()
        cy.get('@showcase').find('button[data-mode-kind="recording"]').click()
        cy.get('@showcase')
            .contains('Source demonstration · synthetic data')
            .should('be.visible')
        cy.get('@showcase').should('not.contain.text', 'Reference qualification')
        cy.get('@showcase')
            .find('video')
            .should(($video) =>
                expect($video[0].currentSrc).to.include('openemr-source-recording.unbound.mp4')
            )

        cy.get('@showcase')
            .find('[role="tab"][aria-selected="true"]')
            .focus()
            .type('{rightarrow}')
        cy.get('@showcase')
            .should('have.attr', 'data-active-reference', 'lending')
            .find('[role="tab"][aria-selected="true"]')
            .should('contain.text', 'Lending')
            .type('{end}')
        cy.get('@showcase')
            .should('have.attr', 'data-active-reference', 'insurance')
            .find('[role="tabpanel"]')
            .should('have.attr', 'aria-labelledby')
    })

    it('binds openIMIS VERIFIED and HALTED modes to their exact evidence media', () => {
        cy.visit('/solutions/insurance')
        cy.get('[data-testid="reference-demo-showcase"]')
            .as('showcase')
            .within(() => {
                cy.get('button[data-mode-id]').should('have.length', 3)
                cy.get('video').should(($video) => {
                    expect($video[0].currentSrc).to.include(
                        'verified-replay/eligible-replay.mp4'
                    )
                })
                cy.contains('Local app traffic only · no off-box transmission')
                    .should('be.visible')
                cy.get('button[data-mode-id="fail_safe_halt"]').click()
                cy.get('video').should(($video) => {
                    expect($video[0].currentSrc).to.include(
                        'fail-safe-halt/expired-halt.mp4'
                    )
                })
                cy.get('[data-overlay-kind="canonical-runtime-state"]')
                    .should('be.visible')
                cy.contains('button', 'Raw footage').click()
                cy.get('[data-overlay-kind="canonical-runtime-state"]')
                    .should('not.exist')
            })

        for (const width of [390, 320]) {
            cy.viewport(width, 844)
            cy.get('@showcase')
                .find('button[data-mode-id]')
                .then(($buttons) => {
                    const boxes = [...$buttons].map((button) =>
                        button.getBoundingClientRect()
                    )
                    expect(
                        new Set(boxes.map((box) => Math.round(box.top))).size
                    ).to.equal(1)
                    expect(
                        new Set(boxes.map((box) => Math.round(box.width))).size
                    ).to.equal(1)
                })
            cy.window().then((window) => {
                window.scrollTo(0, 0)
                expect(window.document.documentElement.scrollWidth).to.be.at.most(
                    window.innerWidth
                )
                const overflowing = [...window.document.body.querySelectorAll('*')]
                    .filter((element) => {
                        const box = element.getBoundingClientRect()
                        const style = window.getComputedStyle(element)
                        return (
                            style.display !== 'none' &&
                            style.visibility !== 'hidden' &&
                            style.clipPath === 'none' &&
                            box.width > 1 &&
                            box.height > 1 &&
                            (box.left < -0.5 || box.right > window.innerWidth + 0.5)
                        )
                    })
                    .map((element) => ({
                        tag: element.tagName,
                        className: String(element.className),
                        text: element.textContent?.trim().slice(0, 80),
                        box: element.getBoundingClientRect().toJSON(),
                    }))
                expect(overflowing).to.deep.equal([])
            })
        }
    })

})
