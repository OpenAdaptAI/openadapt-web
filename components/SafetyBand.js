import Link from 'next/link'

const LIMITS_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/LIMITS.md'
const VALIDATION_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/validation/VALIDATION.md'

export default function SafetyBand() {
    return (
        <section
            style={{
                background: 'var(--panel)',
                borderTop: '1px solid var(--hairline)',
                borderBottom: '1px solid var(--hairline)',
            }}
        >
            <div className="mx-auto max-w-3xl px-6 py-12 text-center">
                <p className="eyebrow mb-2">Safety</p>
                <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-4">
                    Configured safeguards refuse instead of guessing.
                </h2>
                <p className="mx-auto max-w-2xl text-base md:text-lg text-ink-2">
                    OpenAdapt can require identity and effect evidence before a
                    consequential step, then halt for an operator when verification
                    is ambiguous. That protection applies only where the workflow
                    is configured to check it; a success screen alone is not proof
                    that a write reached the right system or record.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                    <a
                        href={LIMITS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Read what it doesn&apos;t do yet →
                    </a>
                    <a
                        href={VALIDATION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        See how we test it →
                    </a>
                </div>
            </div>
        </section>
    )
}
