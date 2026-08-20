const fits = [
    'A person can demonstrate the task from start to finish.',
    'Inputs are mostly structured and the business intent stays stable.',
    'The target application has no practical write API for the last mile.',
    'A wrong action has operational, financial, or compliance cost.',
    'The resulting state can be checked independently or by reacquiring the persisted record.',
    'The workflow repeats often enough to justify qualification.',
]

export default function Qualification() {
    return (
        <section
            id="qualification"
            className="border-b border-hairline bg-panel px-5 py-20 md:py-28"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">A strong first workflow</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Start where an error has a cost and the result can be checked
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    A good candidate repeats often, follows stable rules, and
                    ends in a result that another system or session can verify.
                </p>
                <div className="mx-auto mt-8 max-w-4xl">
                    <article className="rounded-2xl border border-hairline bg-ground p-6 md:p-8">
                        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                            Use this quick fit check
                        </h3>
                        <ul className="mt-5 grid gap-3 text-sm leading-relaxed text-ink-2 md:grid-cols-2 md:gap-x-8">
                            {fits.map((item) => (
                                <li key={item} className="flex gap-2.5">
                                    <span aria-hidden="true" className="mt-[2px] flex-shrink-0 font-mono text-accent">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                </div>
            </div>
        </section>
    )
}
