import Link from 'next/link'

export default function FinalQualificationCta() {
    return (
        <section className="bg-ground px-5 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
                <p className="eyebrow">Bring the real workflow</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Qualify one workflow
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-2 md:text-base">
                    Bring the actual application, environment, workflow, and
                    success condition. We will determine whether it should be
                    automated and what verified production requires.
                </p>
                <Link href="/qualify" className="btn-ink mt-7 inline-block">
                    Start the qualification
                </Link>
            </div>
        </section>
    )
}
