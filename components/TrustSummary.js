import Link from 'next/link'

const controls = [
    'Customer-controlled execution for sensitive and remote work',
    'Local processing for live screenshots, OCR, identities, and secrets',
    'Explicit network and model policy for every production profile',
    'Signed, sealed, versioned, and independently verifiable artifacts',
    'Evidence-backed VERIFIED or HALTED outcomes',
    'MIT-licensed local runtime with a commercial enterprise control plane',
]

export default function TrustSummary() {
    return (
        <section className="border-b border-hairline bg-panel px-5 py-20 md:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Trust by construction</p>
                <h2 className="mx-auto mt-2 max-w-3xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Keep control of the data, action, and evidence
                </h2>
                <ul className="mx-auto mt-8 grid max-w-4xl gap-4 text-sm leading-relaxed text-ink-2 md:grid-cols-2">
                    {controls.map((control) => (
                        <li key={control} className="flex gap-3 rounded-xl border border-hairline bg-ground p-4">
                            <span aria-hidden="true" className="font-mono text-accent">✓</span>
                            <span>{control}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-7 text-center">
                    <Link href="/security" className="text-sm text-accent underline">
                        Open the trust center
                    </Link>
                </p>
            </div>
        </section>
    )
}

