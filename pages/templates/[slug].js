import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import { templates } from 'data/templates'

const PROOF_LABELS = {
    reference: 'Proven reference',
    field: 'Proven reference + field run',
    pattern: 'Pattern — compile it from your own recording',
}

const PROOF_EXPLANATIONS = {
    reference:
        'This workflow runs today, end to end, against the named open-source reference application in the openadapt-flow repository. The steps below are the real demonstrated steps and the verification is the real oracle.',
    field:
        'This workflow runs today against the named application, and has additionally been measured in a field run — with the field-test caveats stated below.',
    pattern:
        'This is a workflow shape, not a canned connector: you compile it from a recording of your own team in your own applications. The execution and verification mechanics it relies on are proven on the linked reference templates.',
}

export default function TemplatePage({ template, anchorTemplates }) {
    const t = template
    const url = `https://openadapt.ai/templates/${t.slug}`

    const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `${t.title} with OpenAdapt`,
        description: t.metaDescription,
        totalTime: 'PT15M',
        supply: [],
        tool: [
            {
                '@type': 'HowToTool',
                name: 'openadapt-flow (open-source CLI, MIT licensed)',
            },
        ],
        step: t.quickstart.map((q, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: q.cmd,
            text: q.what,
        })),
    }

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>{`${t.title} | OpenAdapt`}</title>
                <meta name="description" content={t.metaDescription} />
                <link rel="canonical" href={url} />
                <meta property="og:title" content={`${t.title} | OpenAdapt`} />
                <meta property="og:description" content={t.metaDescription} />
                <meta property="og:url" content={url} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
                />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="text-sm text-ink-3">
                    <Link href="/templates">← All workflow templates</Link>
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="eyebrow">Workflow template</span>
                    <span className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-ink-3">
                        {PROOF_LABELS[t.proof]}
                    </span>
                </div>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    {t.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    {t.summary}
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                    {PROOF_EXPLANATIONS[t.proof]}
                </p>

                {/* Runs on */}
                <div className="mt-8 rounded-2xl border border-hairline bg-panel p-6">
                    <h2 className="eyebrow">Runs on</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2 md:text-base">
                        {t.runsOn}
                    </p>
                    <p className="mt-3 text-sm">
                        <a href={t.source}>Source in openadapt-flow →</a>
                    </p>
                </div>

                {/* Steps */}
                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    The demonstrated steps
                </h2>
                <ol className="mt-4 space-y-3">
                    {t.steps.map((step, i) => (
                        <li
                            key={step}
                            className="flex gap-4 rounded-xl border border-hairline bg-panel p-4 text-sm leading-relaxed text-ink-2 md:text-base"
                        >
                            <span className="font-display font-semibold text-ink">
                                {i + 1}
                            </span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>
                {t.parameters?.length > 0 && (
                    <p className="mt-4 text-sm leading-relaxed text-ink-3">
                        <strong className="text-ink-2">Parameters:</strong>{' '}
                        {t.parameters.join(' · ')} — recorded values are the
                        defaults; every replay can override them.
                    </p>
                )}

                {/* Verification */}
                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    How the outcome is verified
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    {t.verification}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                    {t.verificationOracles.map((oracle) => (
                        <li
                            key={oracle}
                            className="rounded-full border border-hairline bg-panel px-3 py-1 text-xs text-ink-2"
                        >
                            {oracle}
                        </li>
                    ))}
                </ul>

                {/* Evidence */}
                {t.evidence && (
                    <div className="mt-8 rounded-2xl border border-hairline bg-panel p-6">
                        <h2 className="eyebrow">Evidence and scope</h2>
                        <p className="mt-2 text-sm leading-relaxed text-ink-2 md:text-base">
                            {t.evidence}
                        </p>
                    </div>
                )}

                {/* Anchors for pattern templates */}
                {anchorTemplates.length > 0 && (
                    <div className="mt-8">
                        <h2 className="eyebrow">Proven on</h2>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {anchorTemplates.map((a) => (
                                <Link
                                    key={a.slug}
                                    href={`/templates/${a.slug}`}
                                    className="rounded-xl border border-hairline bg-panel p-4 text-sm text-ink-2 no-underline transition-colors hover:border-ink"
                                >
                                    <span className="font-medium text-ink">
                                        {a.title}
                                    </span>
                                    <span className="mt-1 block text-xs text-ink-3">
                                        {PROOF_LABELS[a.proof]}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quickstart */}
                <h2 className="mt-12 font-display text-xl font-semibold tracking-tight text-ink">
                    Try it from the command line
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    The compiler and runtime are open source and MIT licensed.
                    Healthy runs are local and make no model calls.
                </p>
                <div className="mt-4 space-y-3">
                    {t.quickstart.map((q) => (
                        <div
                            key={q.cmd}
                            className="rounded-xl border border-hairline bg-panel p-4"
                        >
                            <pre className="overflow-x-auto text-sm text-ink">
                                <code>{q.cmd}</code>
                            </pre>
                            <p className="mt-2 text-xs leading-relaxed text-ink-3 md:text-sm">
                                {q.what}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-14 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Put this workflow into production
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        Bring your version of this workflow and the record that
                        proves its outcome. We&apos;ll map the deployment,
                        verification, shadow run, and supervised rollout.
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
                            Read docs
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export function getStaticPaths() {
    return {
        paths: templates.map((t) => ({ params: { slug: t.slug } })),
        fallback: false,
    }
}

export function getStaticProps({ params }) {
    const template = templates.find((t) => t.slug === params.slug)
    const anchorTemplates = (template.anchors || [])
        .map((slug) => templates.find((t) => t.slug === slug))
        .filter(Boolean)
        .map(({ slug, title, proof }) => ({ slug, title, proof }))
    return { props: { template, anchorTemplates } }
}
