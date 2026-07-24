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
    'The work repeats and the business intent stays stable.',
    'A wrong action matters, so a run has to be verified or halted.',
    "There's no practical API for the last mile, so it's UI-only.",
    'Optional: a system of record (SQL, REST, FHIR, or a file) can confirm the write out of band from the screen. With one, OpenAdapt verifies the effect end to end; without one, it halts instead of guessing.',
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
                    Use OpenAdapt for the UI-only last mile.
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt is deliberately narrow: repeated, high-stakes GUI
                    work with no practical API. When the result can be checked
                    against a system of record, OpenAdapt verifies it end to
                    end; otherwise it halts instead of guessing.
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
                    When work fits that shape, OpenAdapt runs it across every
                    interface it touches under one governed loop: browser,
                    Windows, macOS, Linux, RDP, and Citrix. See how it compares
                    with RPA, computer-use agents, and browser recorders on the{' '}
                    <Link href="/compare" className="text-accent underline">
                        comparison page
                    </Link>
                    .
                </p>
            </div>
        </section>
    )
}
