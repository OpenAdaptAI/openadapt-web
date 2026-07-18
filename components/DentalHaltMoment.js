import Link from 'next/link'

import Clip from './Clip'

import manifest from '../public/how-it-works/MANIFEST.json'

// ---------------------------------------------------------------------------
// ASSET SLOTS — dental payer-portal footage
//
// A parallel product build is capturing real dental eligibility-verification
// footage (record + replay-with-halt). When those assets land under
// public/dental-demo/, replace DENTAL_CLIPS with entries shaped like the
// MANIFEST steps below (gif/alt/caption/width/height) and update the footage
// note. Until then we show our existing REAL replay footage — OpenAdapt
// driving a live OpenEMR instance — and label it as exactly that. Never point
// these slots at mocked or fabricated footage.
// ---------------------------------------------------------------------------
const DENTAL_CLIPS = null

const FALLBACK_CLIPS = {
    record: {
        ...manifest.steps.record_openemr,
        caption:
            'Record — real footage · OpenAdapt driving a live OpenEMR instance',
    },
    replay: {
        ...manifest.steps.run_openemr,
        caption:
            'Run — real footage · the same engine that replays your verification workflow',
    },
}

export default function DentalHaltMoment() {
    const clips = DENTAL_CLIPS || FALLBACK_CLIPS
    const usingFallbackFootage = !DENTAL_CLIPS

    return (
        <section className="mx-auto max-w-5xl px-4 py-12">
            <p className="eyebrow">The halt moment</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                It halts and asks. It never guesses.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                OpenAdapt checks configured case-identity and page evidence
                before consequential steps. If the evidence does not match —
                a look-alike name, a changed portal layout, an unexpected popup
                — the run stops and sends the case to your front
                desk&apos;s ready-to-finish queue.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                After a run, OpenAdapt confirms that the declared local result
                artifacts — such as the case PDF and results-log entry — were
                created for the scoped case. That verifies delivery, not the
                payer&apos;s underlying accuracy, and this founding service
                does not write benefits back into your practice-management
                system. Anything ambiguous stays a human question with the
                available run evidence attached.
            </p>

            <div className="mt-5 max-w-3xl rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2">
                <strong className="text-ink">Staff first, founder-backed.</strong>{' '}
                Your team handles MFA and CAPTCHA prompts and finishes routine
                exceptions from the local queue. A phone-only result becomes
                an evidence-rich ready-to-call task for staff; this founding
                service does not place the call. If a portal exception still
                needs help, OpenAdapt provides same-business-day assistance
                only for practices that consented to assisted access and
                portals that cleared the access review.
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Clip clip={clips.record} />
                <Clip clip={clips.replay} />
            </div>

            {usingFallbackFootage && (
                <p className="mt-4 max-w-3xl text-xs leading-relaxed text-ink-3">
                    Footage note: these clips are real, unstaged screen
                    recordings of OpenAdapt recording and replaying a workflow
                    in a live OpenEMR instance — the same engine that runs
                    dental eligibility verification. Footage of a dental
                    payer-portal verification, including a visible halt, is
                    being captured with the founding cohort and will replace
                    these clips.
                </p>
            )}

            <p className="mt-4 text-sm">
                <Link href="/safety" className="font-medium">
                    See the wrong-record defense in detail →
                </Link>
            </p>
        </section>
    )
}
