import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

/*
 * Dental positioning page, modeled on /solutions/healthcare.
 *
 * This is the evergreen vertical page for the active dental outreach: it
 * names the exact front-desk workflows, the halt-instead-of-wrong-write
 * safety story, and the local data boundary, then routes to /qualify and
 * /book. The priced founding-cohort offer stays on /dental and is reached
 * through the dental template's contextual managed-offer link — this page
 * deliberately does not promote the capacity-bounded offer directly (see
 * tests/dentalOffer.test.js for that information-architecture decision).
 *
 * Every claim here restates copy already published on /dental,
 * /templates/dental-insurance-eligibility, /safety, or /compare. No
 * competitor names, no customer names, no pricing.
 */
export default function DentalSolutionsPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Dental Front-Desk Automation: Insurance Eligibility & Claims Status | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt automates the payer-portal work behind a dental front desk: insurance eligibility verification and claims status checks, replayed on your own computer, halting instead of writing a wrong record."
                />
                <link rel="canonical" href="https://openadapt.ai/solutions/dental" />
                <meta property="og:title" content="Dental Front-Desk Automation | OpenAdapt" />
                <meta property="og:description" content="Automate insurance eligibility verification and claims status checks in your PMS. Local execution, halt on mismatch, staff stay in control." />
                <meta property="og:url" content="https://openadapt.ai/solutions/dental" />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">
                    Dental practice execution
                </p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Automate the payer-portal work behind your front desk.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    Insurance eligibility verification and claims status checks
                    are the workflows a dental front desk repeats dozens of
                    times a day: sign in to the payer portal, look up the
                    patient, read coverage and benefits or the claim state,
                    and carry the answer into the practice management system.
                    OpenAdapt compiles that exact workflow from a recording of
                    your own team and replays it on your front-desk computer.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                    Those hours of phone and portal time each week are the
                    cost of work that never needed a person once it was shown
                    correctly. Your staff open and supervise the sessions;
                    OpenAdapt does the re-keying, and anything it cannot
                    verify lands in a queue for a person to finish.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                        href="/qualify"
                        className="btn-ink"
                    >
                        Qualify one workflow
                    </Link>
                    <Link
                        href="/book"
                        className="btn-ghost-ink"
                    >
                        Book a 30-minute call
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-12">
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                    The workflows, exactly
                </h2>
                <ul className="mt-4 space-y-3">
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        <span className="font-semibold text-ink">
                            Insurance eligibility verification.
                        </span>{' '}
                        Sign in to the payer portal, look up the patient by
                        member ID and date of birth, open the coverage and
                        benefits view, and record the eligibility result where
                        your workflow puts it — the PMS, a worksheet, or the
                        schedule. Credentials are secret parameters, never
                        written to the recording.
                    </li>
                    <li className="rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        <span className="font-semibold text-ink">
                            Claims status checks.
                        </span>{' '}
                        Look up a submitted claim in the payer portal, read
                        its current state, and carry the status into the PMS
                        record your billing follow-up already works from.
                    </li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">
                    <Link
                        href="/templates/dental-insurance-eligibility"
                        className="font-medium text-accent"
                    >
                        See the eligibility workflow step by step →
                    </Link>
                </p>

                <div
                    className="mt-10 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                    style={{ borderLeft: '4px solid var(--accent)' }}
                >
                    <p className="eyebrow">The wrong-patient defense</p>
                    <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                        It halts instead of writing a wrong record.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        Every compiled step carries identity checks derived
                        from the demonstration. The program verifies it is
                        looking at the right member before it reads or writes
                        anything, and when the portal or the PMS shows
                        something it never saw demonstrated, it halts and
                        puts the case in a ready-to-finish queue instead of
                        guessing. The public safety gallery shows the exact
                        look-alike record cases behind this defense.
                    </p>
                    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        <Link href="/safety" className="font-medium">
                            See the wrong-patient defense →
                        </Link>
                        <a
                            href="https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/LIMITS.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium"
                        >
                            Review the runtime safety model →
                        </a>
                    </p>
                </div>

                <div className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Patient data stays inside your boundary
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-2 md:text-base">
                        Original recordings stay local, and live observations
                        can contain PHI, so dental workflows run on a
                        practice-controlled machine — the same front-desk
                        computer your staff already use, inside portal
                        sessions your staff open and supervise. Healthy runs
                        make no model calls, so routine verifications also
                        send nothing to a model.
                    </p>
                    <p className="mt-3 text-sm">
                        <Link href="/compare" className="font-medium text-accent">
                            See the run economics on /compare →
                        </Link>
                    </p>
                </div>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Put one front-desk workflow into production
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring the payer portals you check most, your PMS and
                        its version, weekly volume, and the exceptions your
                        staff handle today. We&#39;ll map the deployment
                        boundary, shadow run, and supervised rollout.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/qualify" className="btn-ink">
                            Qualify one workflow
                        </Link>
                        <Link href="/book" className="btn-ghost-ink">
                            Book a 30-minute call
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
