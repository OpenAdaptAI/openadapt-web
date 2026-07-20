import Link from 'next/link'

// Buyer qualification lifted from the /compare "start with the right category"
// guidance: APIs first, RPA for breadth, agents for novel work, and OpenAdapt
// for the repeated, consequential UI-only last mile that can be checked
// against an independent source of truth.

const fits = [
    'The work repeats and the business intent stays stable.',
    'A wrong action matters, so a run must be verified or halted.',
    'There is no practical API for the last mile — it is UI-only.',
    'An independent oracle (REST, SQL, export) can confirm the effect.',
]

const doesNot = [
    'A stable API already exists — call it directly instead.',
    'You need broad connector coverage and orchestration — use mature RPA.',
    'The task is novel or exploratory — a computer-use agent can re-plan each run.',
    'No independent check can confirm the outcome — the result cannot be trusted.',
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
                    OpenAdapt is deliberately narrow. It is built for repeated,
                    consequential GUI work that has no practical integration and
                    can be checked against an independent source of truth.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <article className="rounded-2xl border border-hairline bg-ground p-6">
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
                    <article className="rounded-2xl border border-hairline bg-ground p-6">
                        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                            When it isn&rsquo;t the right tool
                        </h3>
                        <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
                            {doesNot.map((item) => (
                                <li key={item} className="flex gap-2.5">
                                    <span
                                        aria-hidden="true"
                                        className="mt-[2px] flex-shrink-0 font-mono text-ink-3"
                                    >
                                        ·
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-ink-3">
                    See the full breakdown against RPA, computer-use agents, and
                    browser recorders on the{' '}
                    <Link href="/compare" className="text-accent underline">
                        comparison page
                    </Link>
                    .
                </p>
            </div>
        </section>
    )
}
