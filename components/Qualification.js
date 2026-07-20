import Link from 'next/link'

// Buyer qualification lifted from the /compare "start with the right category"
// guidance: APIs first, RPA for breadth, agents for novel work, and OpenAdapt
// for the repeated, consequential UI-only last mile that can be checked
// against an independent source of truth. We lead with fit and demote the
// "when it isn't the right tool" detail to a single honest line plus the full
// /compare breakdown, rather than a co-equal above-the-fold column.

const fits = [
    'The work repeats and the business intent stays stable.',
    'A wrong action matters, so a run has to be verified or halted.',
    "There's no practical API for the last mile, so it's UI-only.",
    'An independent oracle (REST, SQL, export) can confirm the effect.',
]

export default function Qualification() {
    return (
        <section
            id="qualification"
            className="border-b border-hairline bg-panel px-5 py-14 md:py-16"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Is this the right tool?</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Use APIs first. Use OpenAdapt for the UI-only last mile.
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt is deliberately narrow. It&rsquo;s for repeated,
                    high-stakes GUI work that has no real API and can be checked
                    against an independent source of truth.
                </p>
                <article className="mx-auto mt-8 max-w-2xl rounded-2xl border border-hairline bg-ground p-6 md:p-7">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                        When OpenAdapt fits
                    </h3>
                    <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
                        {fits.map((item) => (
                            <li key={item} className="flex gap-2.5">
                                <span
                                    aria-hidden="true"
                                    className="mt-[2px] flex-shrink-0 font-mono text-accent"
                                >
                                    ✓
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </article>
                <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-ink-3">
                    Not every workflow needs this. If a stable API already
                    exists, if you need broad connector coverage, or if the task
                    changes every run, another tool fits better. Compare
                    OpenAdapt with RPA, computer-use agents, and browser
                    recorders on the{' '}
                    <Link href="/compare" className="text-accent underline">
                        comparison page
                    </Link>
                    .
                </p>
            </div>
        </section>
    )
}
