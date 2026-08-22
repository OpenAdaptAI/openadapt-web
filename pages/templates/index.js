import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import { templates } from 'data/templates'
import { loadTemplateEntries, buildTemplateGallery } from 'lib/generators/buildTemplates'

const PROOF_LABELS = {
    reference: 'Proven reference',
    field: 'Proven reference + field run',
    pattern: 'Pattern — compile it from your own recording',
}

const VERTICAL_LABELS = {
    healthcare: 'Healthcare',
    lending: 'Lending',
    insurance: 'Insurance',
    dental: 'Dental',
    operations: 'Back-office operations',
}

const SURFACE_LABELS = {
    browser: 'Browser',
    native: 'Native desktop',
    remote: 'Remote (RDP/Citrix)',
}

function formatRunStats(stats) {
    if (!stats) return null
    const parts = [`${stats.trials} trials`]
    if (stats.verifiedRuns !== undefined && stats.expectedHalts !== undefined) {
        parts.push(`${stats.verifiedRuns} VERIFIED / ${stats.expectedHalts} expected halts`)
    } else if (stats.verifiedRuns !== undefined) {
        parts.push(`${stats.verifiedRuns}/${stats.trials} VERIFIED`)
    }
    if (stats.modelCallsPerRun === 0 || stats.modelCallsPerRun === null) {
        parts.push('0 model calls')
    }
    const duration =
        stats.medianVerifiedRunDurationMs != null
            ? `${(Math.round(stats.medianVerifiedRunDurationMs / 10) / 100).toFixed(2)} s median verified run`
            : stats.medianRunDurationSeconds != null
              ? `${stats.medianRunDurationSeconds} s median run`
              : stats.meanRunDurationSeconds != null
                ? `${stats.meanRunDurationSeconds} s mean run`
                : null
    return { chips: parts, duration }
}

export default function TemplatesIndexPage({ galleryEntries }) {
    const routable = galleryEntries.filter((entry) => entry.href)

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'OpenAdapt workflow template gallery',
        description:
            'Runnable workflow templates: demonstrated GUI workflows compiled into deterministic, locally executable programs with verification against the system of record.',
        itemListElement: routable.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t.name,
            url: `https://openadapt.ai${t.href}`,
        })),
    }

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Workflow Template Gallery — Verified GUI Automation | OpenAdapt</title>
                <meta
                    name="description"
                    content="Runnable workflow templates for healthcare, lending, insurance, and back-office operations. Each template ships with its published evidence — trials, verified runs, expected halts, model calls — cited to its source. No template page for a workflow we haven't actually run."
                />
                <link rel="canonical" href="https://openadapt.ai/templates" />
                <meta property="og:title" content="Workflow Template Gallery | OpenAdapt" />
                <meta
                    property="og:description"
                    content="Real, runnable workflow templates: patient notes in OpenEMR, loan applications in Frappe Lending, claim intake in openIMIS, eligibility checks, verified report exports."
                />
                <meta property="og:url" content="https://openadapt.ai/templates" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
                />
            </Head>

            <div className="mx-auto max-w-5xl px-4 py-14">
                <p className="eyebrow">Workflow templates</p>
                <h1 className="font-display mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Workflows you can compile, replay, and verify — starting
                    today.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    Every template here corresponds to something that actually
                    runs. The proven references execute end to end against real
                    open-source applications in the{' '}
                    <a href="https://github.com/OpenAdaptAI/openadapt-flow">
                        openadapt-flow
                    </a>{' '}
                    repository, with success established by the system of
                    record — a database row, an independent API read, a file
                    that actually arrived — never by pixels or self-report. The
                    patterns are workflow shapes you compile from a recording
                    of your own team, anchored to those references.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                    Our honesty bar: no template for a workflow we haven&apos;t
                    actually run, no logos of applications we haven&apos;t
                    driven, and every published number cited to its source.
                    Cards marked &ldquo;evidence in progress&rdquo; make no
                    performance claim.
                </p>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    {galleryEntries.map((t) => {
                        if (!t.href) {
                            return (
                                <article
                                    key={t.slug}
                                    className="flex flex-col rounded-2xl border border-dashed border-hairline bg-panel p-6 opacity-90"
                                    data-testid="pending-evidence-card"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="eyebrow">
                                            {VERTICAL_LABELS[t.vertical] || t.vertical}
                                        </span>
                                        <span className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-ink-3">
                                            Evidence in progress
                                        </span>
                                        {t.surface && (
                                            <span className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-ink-3">
                                                {SURFACE_LABELS[t.surface]}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="font-display mt-3 text-lg font-semibold tracking-tight text-ink">
                                        {t.name}
                                    </h2>
                                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                        {t.summary}
                                    </p>
                                    <p className="mt-auto pt-4 text-xs leading-relaxed text-ink-3">
                                        {t.evidenceNote}
                                    </p>
                                </article>
                            )
                        }

                        const stats = formatRunStats(t.runStats)
                        return (
                            <Link
                                key={t.slug}
                                href={t.href}
                                className="group flex flex-col rounded-2xl border border-hairline bg-panel p-6 no-underline transition-colors hover:border-ink"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="eyebrow">
                                        {VERTICAL_LABELS[t.vertical]}
                                    </span>
                                    <span className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-ink-3">
                                        {PROOF_LABELS[t.proof]}
                                    </span>
                                    {t.surface && (
                                        <span className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-ink-3">
                                            {SURFACE_LABELS[t.surface]}
                                        </span>
                                    )}
                                </div>
                                <h2 className="font-display mt-3 text-lg font-semibold tracking-tight text-ink">
                                    {t.name}
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {t.summary}
                                </p>
                                {stats && (
                                    <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-3">
                                        {stats.chips.map((chip) => (
                                            <span key={chip}>{chip}</span>
                                        ))}
                                        {stats.duration && (
                                            <span>{stats.duration}</span>
                                        )}
                                    </p>
                                )}
                                <p className="mt-auto pt-4 text-sm font-medium text-ink group-hover:underline">
                                    View template →
                                </p>
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-14 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Have a workflow that isn&apos;t here?
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        If your team does it the same way every time in a
                        browser, a Windows application, or a remote desktop,
                        it is a candidate. Bring one repeated workflow and the
                        record that proves its outcome.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/qualify" className="btn-ink">
                            Evaluate a workflow
                        </Link>
                        <Link href="https://docs.openadapt.ai/get-started/" className="btn-ghost-ink">
                            Try locally
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export async function getStaticProps() {
    const entries = loadTemplateEntries('data/templates')
    const { galleryEntries } = buildTemplateGallery(templates, entries)
    return { props: { galleryEntries } }
}
