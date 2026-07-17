const LIMITS_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/LIMITS.md'

const outcomes = [
    {
        status: 'Automatic',
        title: 'Deterministic re-resolution',
        body: 'Structure, templates, OCR, and geometry try to re-find the recorded target. No model is required. A changed anchor is saved as an auditable bundle diff.',
    },
    {
        status: 'Optional',
        title: 'AI-assisted proposal',
        body: 'If deterministic evidence is insufficient and a model is configured, it can propose a target or confirm limited visual state. The model can be wrong; identity, policy, and postcondition gates still decide whether execution continues.',
    },
    {
        status: 'Operator path',
        title: 'Human teaching and resume',
        body: 'A halt produces evidence for an operator. The CLI can teach a correction, and durable mode can checkpoint verified progress for authenticated approval and resume.',
    },
    {
        status: 'Unsupported drift',
        title: 'Refuse instead of improvise',
        body: 'If no configured path can establish the target or expected result, the workflow stops. OpenAdapt does not claim general adaptation to arbitrary application changes.',
    },
]

export default function DriftOutcomes() {
    return (
        <section className="border-b border-hairline bg-ground px-5 py-14 md:py-16">
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">UI drift</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    What &ldquo;repair&rdquo; means, and where it stops
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt is not an unconstrained agent. Drift ends in one of
                    four explicit outcomes, each visible in the run report.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {outcomes.map((outcome) => (
                        <article
                            key={outcome.title}
                            className="rounded-xl border border-hairline bg-panel p-5"
                        >
                            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-accent">
                                {outcome.status}
                            </p>
                            <h3 className="mt-2 font-display text-base font-semibold text-ink">
                                {outcome.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                {outcome.body}
                            </p>
                        </article>
                    ))}
                </div>
                <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-ink-3">
                    Availability and refusal depend on recorded evidence and
                    configuration. Identity checks cover armed steps only;
                    system-of-record verification requires declared effects and
                    a configured verifier.{' '}
                    <a
                        href={LIMITS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline"
                    >
                        Read the measured limits
                    </a>
                    .
                </p>
            </div>
        </section>
    )
}
