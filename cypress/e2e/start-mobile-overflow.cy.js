describe('start page fits narrow mobile viewports', () => {
    for (const width of [320, 375, 390]) {
        it(`keeps all page content reachable at ${width}px`, () => {
            cy.viewport(width, 812)
            cy.visit('/start')

            cy.document().then((doc) => {
                const style = doc.createElement('style')
                style.setAttribute('data-test-unmask', 'overflow')
                style.innerHTML =
                    'html, body { overflow-x: visible !important; width: auto !important; }'
                doc.head.appendChild(style)
            })

            cy.window().then((win) => {
                const doc = win.document
                const viewportWidth = doc.documentElement.clientWidth
                const clipped = []

                const hasHorizontalScroller = (element) => {
                    let node = element.parentElement
                    while (node) {
                        const overflowX = win.getComputedStyle(node).overflowX
                        if (overflowX === 'auto' || overflowX === 'scroll') {
                            return true
                        }
                        node = node.parentElement
                    }
                    return false
                }

                doc.querySelectorAll('body *').forEach((element) => {
                    const bounds = element.getBoundingClientRect()
                    if (
                        bounds.width > 0 &&
                        bounds.right > viewportWidth + 1 &&
                        !hasHorizontalScroller(element)
                    ) {
                        clipped.push(
                            `${element.tagName.toLowerCase()}.${element.className}`
                        )
                    }
                })

                expect(clipped, 'elements clipped past viewport').to.deep.equal(
                    []
                )
                expect(doc.documentElement.scrollWidth).to.be.at.most(
                    viewportWidth
                )
                expect(doc.body.scrollWidth).to.be.at.most(viewportWidth)
            })
        })
    }
})
