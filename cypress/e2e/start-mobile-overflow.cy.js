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

                const viewportWidth = doc.documentElement.clientWidth

                expect(doc.documentElement.scrollWidth).to.be.at.most(
                    viewportWidth
                )
                expect(doc.body.scrollWidth).to.be.at.most(viewportWidth)
            })
        })
    }
})
