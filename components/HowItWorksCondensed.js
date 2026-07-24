// Condensed three-step model for the homepage. The full five-stage walkthrough
// with per-application footage lives on the solution pages (it uses
// <HowItWorks showUseCases />); this compresses record + compile + replay +
// resolve + verify into the three ideas a first-time reader needs.

const steps = [
    {
        number: '1',
        name: 'Demonstrate and qualify',
        description:
            'Show one bounded task. Review its program, risks, identities, effects, fault cases, and supported environment before certifying it.',
    },
    {
        number: '2',
        name: 'Deploy in your boundary',
        description:
            'Run approved browser workloads in managed execution or keep sensitive desktop, RDP, Citrix, private-network, and restricted-egress work customer-controlled.',
    },
    {
        number: '3',
        name: 'Execute, verify, and repair',
        description:
            'Healthy runs use no generative-model calls. OpenAdapt proves the declared effect, halts on uncertainty, and subjects every candidate repair to the workflow contract.',
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
                    From demonstration to verified operation
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    One lifecycle connects qualification, execution, evidence,
                    and governed change.
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
