import Link from 'next/link'

import ReferenceDemoShowcase from './ReferenceDemoShowcase'

export default function DentalHaltMoment() {
    return (
        <>
            <section className="mx-auto max-w-5xl px-4 pb-4 pt-12">
                <p className="eyebrow">The governed run</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    It verifies or asks for help. It never guesses.
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt checks configured case identity and page evidence
                    before consequential steps. If the evidence does not match,
                    the run stops and sends the case to your front desk&apos;s
                    ready-to-finish queue with the available evidence attached.
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    After a run, OpenAdapt confirms that the declared local result
                    artifacts, such as the case PDF and results-log entry, were
                    created for the scoped case. That verifies delivery, not the
                    payer&apos;s underlying accuracy, and this founding service
                    does not write benefits back into your practice-management
                    system.
                </p>
                <div className="mt-5 max-w-3xl rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2">
                    <strong className="text-ink">Staff first, founder-backed.</strong>{' '}
                    Your team handles MFA and CAPTCHA prompts and finishes routine
                    exceptions locally. A phone-only result becomes an evidence-rich
                    ready-to-call task for staff; this service does not place the
                    call. OpenAdapt provides same-business-day assistance only for
                    practices that consented to assisted access and portals that
                    cleared the access review.
                </div>
            </section>

            <ReferenceDemoShowcase
                initialIndustry="insurance"
                heading="See the governed loop in a public insurance application"
                intro="Compare a captured demonstration with its compiled replay, then inspect the exact evidence boundary for the result."
            />

            <p className="mx-auto max-w-5xl px-4 pb-12 text-sm">
                <Link href="/safety" className="font-medium">
                    See the wrong-record defense in detail →
                </Link>
            </p>
        </>
    )
}
