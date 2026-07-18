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
                Most automation fails loudly or — worse — succeeds wrongly:
                it reads the wrong patient&apos;s screen and writes the wrong
                benefits into your day sheet. OpenAdapt is built around the
                opposite contract. Before a consequential step, it checks the
                evidence on the live screen against the patient record it was
                asked to verify. If the two don&apos;t match — a look-alike
                name, a changed portal layout, an unexpected popup — the run
                stops and asks your front desk, instead of silently writing a
                wrong answer.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                The result is checked against the system of record, not just
                what happens to be on the screen. A completed run means the
                verification actually landed where it belongs; anything
                ambiguous becomes a question for a human, with the evidence
                attached.
            </p>

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
