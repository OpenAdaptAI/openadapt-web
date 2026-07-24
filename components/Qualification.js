import Link from 'next/link'

// Buyer qualification lifted from the /compare "start with the right category"
// guidance: OpenAdapt is for the repeated, consequential UI-only last mile.
// Where an independent source of truth exists it verifies the effect end to
// end; where one does not, it halts for a human or an AI instead of trusting
// the screen. The oracle is an enhancement, never a gate on using the product.
// We lead with fit, then affirm that when work fits that shape OpenAdapt runs
// it across every interface (browser, Windows, macOS, Linux, RDP, Citrix) under one
// governed loop, with the full /compare breakdown one click away.

const fits = [
    'Inputs are mostly structured and the business intent stays stable.',
    'The target application has no practical write API for the last mile.',
    'A wrong action has operational, financial, or compliance cost.',
    'The resulting state can be checked independently or by reacquiring the persisted record.',
    'The workflow repeats often enough to justify qualification.',
]

const doesNotFit = [
    'A reliable supported API already completes the work.',
    'The task depends on open-ended judgment or changes constantly.',
    'No meaningful success condition can be defined.',
    'The task is low-volume, low-consequence, and ordinary scripting already works.',
]

export default function Qualification() {
    return (
        <section
            id="qualification"
            className="border-b border-hairline bg-panel px-5 py-20 md:py-28"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">The right fit</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Built for consequential UI-only work
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    Use the simplest reliable tool. OpenAdapt fits when the
                    interface is unavoidable and the outcome must be proved.
                </p>
                <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
                    <article className="rounded-2xl border border-hairline bg-ground p-6 md:p-7">
                        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                            Use OpenAdapt when
                        </h3>
                        <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
                            {fits.map((item) => (
                                <li key={item} className="flex gap-2.5">
                                    <span aria-hidden="true" className="mt-[2px] flex-shrink-0 font-mono text-accent">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                    <article className="rounded-2xl border border-hairline bg-ground p-6 md:p-7">
                        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                            Do not use OpenAdapt when
                        </h3>
                        <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
                            {doesNotFit.map((item) => (
                                <li key={item} className="flex gap-2.5">
                                    <span aria-hidden="true" className="mt-[2px] flex-shrink-0 font-mono text-ink-3">—</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-ink-3">
                    See the complete decision guide for APIs, browser automation,
                    RPA, computer-use agents, scripts, and OpenAdapt on the{' '}
                    <Link href="/compare" className="text-accent underline">
                        comparison page
                    </Link>
                    .
                </p>
            </div>
        </section>
    )
}
