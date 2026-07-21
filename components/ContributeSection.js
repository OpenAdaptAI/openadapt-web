import Link from 'next/link'

// Contribute-for-credits landing SECTION.
//
// Placed in the open-source / adoption cluster (after the Adoption stats,
// before the updates form) because this is a commons / flywheel message, not a
// pricing gimmick: contributions strengthen the shared hardening corpus that
// lowers everyone's silent-wrong-effect rate. The full mechanism, expanded
// guarantees, and FAQ live on /contribute.
//
// Framing is binding (see the data-for-credits framing brief): lead with the
// guarantees, never "sell/monetize your data", no per-record price. The
// program is EARLY ACCESS (gated on legal terms), so the copy is "request
// access", never "upload now / available today", and never claims any data has
// been collected.

const GUARANTEES = [
    'Sanitized, de-identified derivatives only. Raw recordings never leave your machine.',
    'You approve every byte through hash-bound local review before anything is shared.',
    'Opt-in, off by default, and revocable going forward.',
    'De-identified derivatives are not PHI, so no BAA is required, and you attest to the standard.',
]

export default function ContributeSection() {
    return (
        <section
            id="contribute"
            className="border-t border-hairline bg-ground px-5 py-16 md:py-20"
            aria-labelledby="contribute-heading"
        >
            <div className="mx-auto max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                    <p className="eyebrow">Strengthen the commons</p>
                    <span className="rounded-full border border-hairline bg-panel px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2">
                        Early access
                    </span>
                </div>
                <h2
                    id="contribute-heading"
                    className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                >
                    Contribute data for credits
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-2 md:text-base">
                    Every sanitized contribution strengthens the shared
                    hardening corpus, the commons that lowers everyone&apos;s
                    silent-wrong-effect rate. In return, you earn run credits
                    that extend your usage allowance.
                </p>

                <ul className="mt-8 grid gap-4 md:grid-cols-2">
                    {GUARANTEES.map((item) => (
                        <li
                            key={item}
                            className="flex gap-2.5 rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2"
                        >
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

                <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href="/contribute" className="btn-ink">
                        Request access to the contributor program
                    </Link>
                    <span className="text-xs leading-relaxed text-ink-3">
                        Early access. Opt-in. Sanitized derivatives only.
                    </span>
                </div>
            </div>
        </section>
    )
}
