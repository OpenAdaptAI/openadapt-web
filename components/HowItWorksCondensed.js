// Condensed three-step model for the homepage. The full five-stage walkthrough
// with per-application footage lives on the solution pages (it uses
// <HowItWorks showUseCases />); this compresses record + compile + replay +
// resolve + verify into the three ideas a first-time reader needs.

const steps = [
    {
        number: '1',
        name: 'Record & compile',
        description:
            'Demonstrate one bounded, repeated task. OpenAdapt compiles the trace into a reviewable, parameterized program. Not a prompt a model rereads each run.',
    },
    {
        number: '2',
        name: 'Replay deterministically',
        description:
            'Healthy runs execute the compiled steps locally with zero model calls. Repeat runs are fast and cost nothing per run.',
    },
    {
        number: '3',
        name: 'Resolve, repair, or halt',
        description:
            'When the interface drifts, deterministic evidence re-finds the target, an optional model proposes a governed repair, or verification halts and keeps a run report.',
    },
]

export default function HowItWorksCondensed() {
    return (
        <section
            id="how-it-works"
            className="border-b border-hairline bg-ground px-5 py-14 md:py-16"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">How it works</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    A demonstration becomes a reviewable program
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    Three steps, one governed loop. Healthy replay is
                    deterministic; model spend is reserved for compilation or
                    repair.
                </p>
                <ol className="mt-9 grid gap-4 md:grid-cols-3">
                    {steps.map((step) => (
                        <li
                            key={step.number}
                            className="flex h-full flex-col rounded-2xl border border-hairline bg-panel p-6"
                        >
                            <span className="font-mono text-xs font-medium text-accent">
                                {step.number}
                            </span>
                            <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                                {step.name}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
