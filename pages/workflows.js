import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import { track, EVENTS } from 'utils/analytics'
import { CATALOG, SUBSTRATE_MATURITY } from 'data/workflowCatalog'

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Workflow reference catalog',
    url: 'https://openadapt.ai/workflows',
    description:
        'A reference catalog of the workflows OpenAdapt has recorded, compiled, ' +
        'and replayed under an independent effect oracle. Every entry is a ' +
        'synthetic, pinned local fixture; none is customer-proven.',
    isPartOf: {
        '@type': 'WebSite',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
}

function Field({ label, children }) {
    return (
        <div className="min-w-0 border-t border-hairline pt-4">
            <dt className="font-display text-xs font-semibold uppercase tracking-wide text-ink-3">
                {label}
            </dt>
            <dd className="mt-2 break-words text-sm leading-relaxed text-ink-2">
                {children}
            </dd>
        </div>
    )
}

function CatalogEntry({ entry }) {
    return (
        <article
            id={entry.id}
            className="rounded-2xl border-2 border-ink bg-panel p-6 md:p-8"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="eyebrow">{entry.industry}</p>
                    <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-ink">
                        {entry.application}{' '}
                        <span className="font-mono text-base font-normal text-ink-3">
                            {entry.version}
                        </span>
                    </h2>
                    <p className="mt-1 text-sm text-ink-2">
                        {entry.applicationRole}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full border border-ink px-3 py-1 text-xs font-semibold text-ink">
                        {entry.substrateLabel} · {entry.maturity}
                    </span>
                    {entry.evidenceKind && (
                        <span
                            className="rounded-full px-3 py-1 text-xs font-semibold text-ink-2"
                            style={{
                                border: '1px solid var(--inset-warn)',
                            }}
                        >
                            {entry.evidenceKind}
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-5 rounded-xl border border-hairline bg-ground p-4">
                <p className="font-display text-lg font-semibold text-ink">
                    {entry.trialResults.headline}
                </p>
                <p className="mt-1 text-sm text-ink-2">
                    {entry.trialResults.detail}
                </p>
                <p className="mt-2 text-xs italic text-ink-3">
                    Scope: {entry.trialResults.scope}
                </p>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Task">{entry.task}</Field>
                <Field label="Recording / bundle">
                    {entry.recording}{' '}
                    <a
                        href={entry.recordingHref}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View benchmark →
                    </a>
                </Field>
                <Field label="Policy">{entry.policy}</Field>
                <Field label="Identity contract">
                    {entry.identityContract}
                </Field>
                <Field label="Effect oracle">{entry.effectOracle}</Field>
                <Field label="Known limits">
                    <ul className="list-disc space-y-1 pl-4">
                        {entry.knownLimits.map((limit) => (
                            <li key={limit}>{limit}</li>
                        ))}
                    </ul>
                </Field>
            </dl>

            {entry.secondaryEvidence && (
                <p className="mt-5 text-xs leading-relaxed text-ink-3">
                    {entry.secondaryEvidence}
                </p>
            )}

            <div className="mt-6 border-t border-hairline pt-4">
                <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-3">
                    Honest scope
                </p>
                <p className="mt-2 text-sm text-ink-2">{entry.scope}</p>
                <p className="mt-1 text-xs text-ink-3">{entry.license}</p>
            </div>

            <div className="mt-6">
                <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-3">
                    Reproduce it
                </p>
                <pre className="mt-2 overflow-x-auto rounded-xl border border-hairline bg-ground p-4 text-xs leading-relaxed text-ink-2">
                    <code>{entry.reproduction}</code>
                </pre>
                <p className="mt-3 text-sm">
                    <Link
                        href={entry.solutionHref}
                        onClick={() =>
                            track(EVENTS.WORKFLOW_CARD_CLICK, {
                                industry: entry.industry,
                                location: 'workflows_catalog',
                            })
                        }
                    >
                        See the {entry.industry.toLowerCase()} reference →
                    </Link>
                </p>
            </div>
        </article>
    )
}

export default function WorkflowsPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Workflow reference catalog | OpenAdapt</title>
                <meta
                    name="description"
                    content="A reference catalog of the workflows OpenAdapt has recorded, compiled, and replayed under an independent effect oracle. Every entry is a synthetic, pinned local fixture; none is customer-proven."
                />
                <link rel="canonical" href="https://openadapt.ai/workflows" />
                <meta
                    property="og:title"
                    content="Workflow reference catalog | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="Synthetic, pinned reference workflows with their identity contract, effect oracle, real trial results, and honest scope."
                />
                <meta
                    property="og:url"
                    content="https://openadapt.ai/workflows"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webPageSchema),
                    }}
                />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">Reference catalog</p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    The workflows we&#39;ve actually recorded, compiled, and
                    verified.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    This is a <strong className="text-ink">reference
                    catalog, not a marketplace</strong>. Each entry is a
                    synthetic, pinned local fixture we recorded once, compiled,
                    and replayed under an independent effect oracle. We publish
                    the exact application version, identity contract, oracle,
                    real trial results, and the limits each result does not
                    cover — so you can judge the evidence rather than reuse a
                    workflow we have not proven for your environment.
                </p>
                <p className="mt-4 max-w-3xl text-base text-ink-2 md:text-lg">
                    None of these is customer-proven, none is a complete
                    published benchmark, and reusing a demonstration you did not
                    record is exactly the premature step OpenAdapt is built to
                    refuse. To qualify one of these — or your own — for a real
                    deployment,{' '}
                    <Link href="/#book">evaluate a workflow with us</Link>.
                </p>

                {/* Execution substrates — one governed loop, every surface */}
                <div className="mt-8 rounded-xl border border-hairline bg-panel p-5">
                    <p className="font-display text-sm font-semibold text-ink">
                        Execution substrates
                    </p>
                    <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-ink-2 sm:grid-cols-2">
                        <li>
                            <strong className="text-ink">Browser</strong> —{' '}
                            {SUBSTRATE_MATURITY.browser} (every catalog entry
                            below runs here)
                        </li>
                        <li>
                            <strong className="text-ink">Windows UIA</strong> —{' '}
                            {SUBSTRATE_MATURITY.windows}
                        </li>
                        <li>
                            <strong className="text-ink">Native macOS</strong> —{' '}
                            {SUBSTRATE_MATURITY.macos}
                        </li>
                        <li>
                            <strong className="text-ink">Native Linux</strong> —{' '}
                            {SUBSTRATE_MATURITY.linux}
                        </li>
                        <li>
                            <strong className="text-ink">RDP</strong> —{' '}
                            {SUBSTRATE_MATURITY.rdp}
                        </li>
                        <li>
                            <strong className="text-ink">Citrix</strong> —{' '}
                            {SUBSTRATE_MATURITY.citrix}
                        </li>
                    </ul>
                    <p className="mt-3 text-xs leading-relaxed text-ink-3">
                        Labels reconcile to the canonical{' '}
                        <a
                            href="/status.json"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline"
                        >
                            status manifest
                        </a>
                        . Available means the backend ships in the released
                        compiler/runtime. The manifest records its exact bounded
                        evidence and whether execution is managed or
                        customer-controlled.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 pb-16">
                <div className="grid grid-cols-1 gap-8">
                    {CATALOG.map((entry) => (
                        <CatalogEntry key={entry.id} entry={entry} />
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 pb-16">
                <div className="rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Bring the workflow you want qualified next.
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        These references show the method: record once, compile,
                        and, where a system of record is available, verify the
                        effect against it. The next entry can be yours, on your
                        application, under your policy and identity contract.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/#book" className="btn-ink">
                            Evaluate a workflow
                        </Link>
                        <a
                            href="https://docs.openadapt.ai"
                            className="btn-ghost-ink"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read the docs
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
