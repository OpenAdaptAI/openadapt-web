// Buyer-level lifecycle used after the shared real-application showcase. The
// showcase owns footage and evidence; this keeps the architecture explanation
// to the three ideas a first-time reader needs.

const steps = [
    {
        number: '1',
        name: 'Show the task',
        description:
            'Record one bounded workflow in its real application. OpenAdapt retains the actions and the evidence around each step.',
    },
    {
        number: '2',
        name: 'Qualify the program',
        description:
            'Review the compiled steps, identities, expected results, failure cases, and target environment before you approve a version.',
    },
    {
        number: '3',
        name: 'Run and verify',
        description:
            'Replay the approved program. OpenAdapt checks the declared result, stops on uncertainty, and keeps each repair behind the same review gates.',
    },
]

export default function HowItWorksCondensed() {
    return (
        <section
            id="how-it-works"
            className="border-b border-hairline bg-ground px-5 py-20 md:py-28"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">How it works</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    One demonstrated task becomes one approved program
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    The recording starts the work. Qualification defines what
                    the program may do and what evidence counts as success.
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
