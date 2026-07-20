import Link from 'next/link'

// Positive "best fit" framing for the landing page. The full category
// breakdown — including when a direct API, mature RPA, or a computer-use
// agent is the better choice — lives on /compare ("Start with the right
// category"), linked below so the honest guidance stays one click away
// without leading the homepage with a disqualifier.

const fits = [
    {
        title: 'Repeated, high-volume work',
        detail: 'The task runs again and again and the business intent stays stable — so a compiled workflow pays back fast.',
    },
    {
        title: 'Wrong actions are expensive',
        detail: 'Every run is verified against an independent check and halts for an operator when it cannot confirm the result.',
    },
    {
        title: 'No practical API for the last mile',
        detail: 'The system is UI-only — legacy desktop, remote apps, or a vendor screen with no integration to call.',
    },
    {
        title: 'You can prove the outcome',
        detail: 'A REST call, SQL query, or export can independently confirm the effect, so success is measured, not assumed.',
    },
]

export default function Qualification() {
    return (
        <section
            id="qualification"
            className="border-b border-hairline bg-panel px-5 py-14 md:py-16"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Where OpenAdapt fits best</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Built for the repeated GUI work you can&rsquo;t afford to get wrong
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt turns one demonstration into a governed, verifiable
                    workflow. It is at its best on consequential, UI-only work
                    that repeats and can be checked against an independent source
                    of truth.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {fits.map((item) => (
                        <article
                            key={item.title}
                            className="rounded-2xl border border-hairline bg-ground p-6"
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    aria-hidden="true"
                                    className="mt-[2px] flex-shrink-0 font-mono text-accent"
                                >
                                    ✓
                                </span>
                                <div>
                                    <h3 className="font-display text-base font-semibold tracking-tight text-ink">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                                        {item.detail}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-ink-3">
                    Starting from a stable API, broad RPA connectors, or a novel
                    one-off task? See when each approach wins on the{' '}
                    <Link href="/compare" className="text-accent underline">
                        comparison page
                    </Link>
                    .
                </p>
            </div>
        </section>
    )
}
