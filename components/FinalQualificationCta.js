import Link from 'next/link'

export default function FinalQualificationCta() {
    return (
        <section className="bg-ground px-5 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
                <p className="eyebrow">Workflow fit review</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    See if one workflow fits
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-2 md:text-base">
                    Tell us the application, environment, repeated task, and
                    how you confirm the result. We will assess the fit, main
                    risks, verifier, and deployment path.
                </p>
                <Link href="/qualify" className="btn-ink mt-7 inline-block">
                    Start the fit review
                </Link>
            </div>
        </section>
    )
}
