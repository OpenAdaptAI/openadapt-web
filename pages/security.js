import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

const REPO_URL = 'https://github.com/OpenAdaptAI/OpenAdapt'
const ADVISORY_URL =
    'https://github.com/OpenAdaptAI/OpenAdapt/security/advisories/new'

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Security and trust',
    url: 'https://openadapt.ai/security',
    description:
        'How OpenAdapt handles your data: a deployment-choice spectrum (our cloud, your VPC, or self-hosted), model-free on the default replay path, fail-closed for regulated runs. What is and is not certified today, and how to report a vulnerability.',
    isPartOf: {
        '@type': 'WebSite',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    about: {
        '@type': 'SoftwareApplication',
        name: 'OpenAdapt',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
}

// status: 'yes' = in place today, 'progress' = underway, 'planned' = not yet.
const posture = [
    {
        status: 'yes',
        title: 'You choose where the data lives',
        body: 'OpenAdapt runs three ways: our cloud for non-regulated work, managed by us inside your own VPC (single-tenant BYOC), or fully self-hosted and air-gapped. The data-residency guarantee is scoped to the deployment you pick, not a single company-wide promise. For BYOC and self-hosted, PHI never enters our infrastructure.',
    },
    {
        status: 'yes',
        title: 'PHI never enters our infrastructure (BYOC and self-hosted)',
        body: 'On a self-hosted or in-your-VPC deployment, recordings, scripts, replays, and the model that heals them all run inside your perimeter. Our control plane sees only PHI-free run metadata: status, timestamps, and aggregate counts. It never sees screenshots, field values, patient identifiers, or run report bodies.',
    },
    {
        status: 'yes',
        title: 'No AI calls on a normal run',
        body: 'A normal replay makes no cloud AI calls, so nothing about the run leaves your machine. An AI model is only used when you first compile the recording, or when the screen changes and the script needs a repair. You can run that model on your own hardware inside your network, so your data never goes to a third party.',
    },
    {
        status: 'yes',
        title: 'Fail-closed regulated execution',
        body: 'In regulated mode, a run refuses to start unless the workflow is a certified, signed bundle, every write step declares the effect it must verify on screen, identity coverage is complete, and the configuration is pinned to a reviewed version. Missing any of these, it refuses to run rather than proceed unchecked.',
    },
    {
        status: 'yes',
        title: 'Effect verification and identity gate',
        body: 'Each step reads its own result back off the screen and confirms it is acting on the intended record before it moves on. This is an on-screen read-back, not an independent second source of truth, and we scope its coverage honestly: it confirms name and date of birth, and halts rather than write when only a look-alike identifier separates two records.',
    },
    {
        status: 'yes',
        title: 'Halt, teach, promote',
        body: 'When a step is ambiguous the run halts and flags a person. A reviewer teaches the fix once, and it is promoted into the compiled workflow through governed review, so the change is auditable rather than a silent edit.',
    },
    {
        status: 'yes',
        title: 'Audit trail on every run',
        body: 'Every replay writes a step-by-step run report: what ran, what it saw, and what it repaired. You can check each action against the task you recorded.',
    },
    {
        status: 'yes',
        title: 'PII/PHI scrubbing tooling',
        body: 'Scrubbing tooling is included for teams that need to sanitize captured data before anyone, human or model, sees it.',
    },
    {
        status: 'yes',
        title: 'Open source and auditable',
        body: 'The engine is MIT-licensed. You can read the code, run it yourself, and verify these claims rather than take them on trust.',
    },
    {
        status: 'yes',
        title: 'BAA (Business Associate Agreement)',
        body: 'We sign a BAA (US) or a PHIPA data-processing agreement (Canada) for regulated BYOC and on-prem engagements. Because the PHI-touching data plane runs inside your environment, PHI never enters our infrastructure. If your pilot needs one, we scope it as part of the engagement.',
    },
    {
        status: 'progress',
        title: 'SOC 2',
        body: 'We do not hold a SOC 2 attestation today. The architecture is built to meet SOC 2 requirements and formal attestation is in progress. We will not claim otherwise until a report exists.',
    },
]

const statusLabel = {
    yes: 'In place',
    progress: 'In progress',
    planned: 'Planned',
}

const statusColor = {
    yes: 'var(--accent)',
    progress: 'var(--inset-warn)',
    planned: 'var(--inset-warn)',
}

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Security and trust | OpenAdapt</title>
                <meta
                    name="description"
                    content="How OpenAdapt handles your data: a deployment-choice spectrum (our cloud, your VPC, or self-hosted), model-free on the default replay path, and fail-closed for regulated runs. An honest account of what is and is not certified today, and how to report a vulnerability."
                />
                <link rel="canonical" href="https://openadapt.ai/security" />
                <meta
                    property="og:title"
                    content="Security and trust | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="A deployment-choice spectrum, model-free on the default path, fail-closed for regulated runs. What is and is not certified yet, stated plainly, plus how to report a vulnerability."
                />
                <meta property="og:url" content="https://openadapt.ai/security" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webPageSchema),
                    }}
                />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">Security and trust</p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Where your data goes, and what we have and haven&#39;t
                    certified yet
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    OpenAdapt runs where you choose: our cloud for non-regulated
                    work, managed inside your own VPC, or fully self-hosted. Every
                    data-residency claim below is scoped to the deployment you
                    pick, never a blanket company-wide promise. This page states
                    our posture plainly: what is in place today, what is underway,
                    and what is still just planned. If a badge is not here, we do
                    not have it yet.
                </p>

                <div className="mt-10 space-y-4">
                    {posture.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-xl border border-hairline bg-panel p-5"
                            style={{
                                borderLeft: `4px solid ${statusColor[item.status]}`,
                            }}
                        >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <strong className="font-display text-base font-semibold text-ink">
                                    {item.title}
                                </strong>
                                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                                    {statusLabel[item.status]}
                                </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 border-t-2 border-ink pt-10">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                        Report a vulnerability
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        If you have found a security issue, please report it
                        privately so we can fix it before it is disclosed. The
                        fastest path is GitHub&#39;s private vulnerability
                        reporting on the repository. You can also email us with
                        &ldquo;Security&rdquo; in the subject line. Please do not
                        open a public issue for a suspected vulnerability.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <a
                            href={ADVISORY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-accent hover:underline"
                        >
                            Report privately on GitHub →
                        </a>
                        <a
                            href="mailto:hello@openadapt.ai?subject=Security"
                            className="text-accent hover:underline"
                        >
                            hello@openadapt.ai
                        </a>
                        <a
                            href={REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline"
                        >
                            Read the source
                        </a>
                    </div>
                </div>

                <div className="mt-12 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Reviewing OpenAdapt for a regulated deployment?
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        We are glad to walk your security team through the
                        architecture and answer the hard questions. Bring your
                        requirements and we will tell you what we can and
                        can&#39;t meet today.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/#book" className="btn-ink">
                            Book a demo
                        </Link>
                        <Link href="/compare" className="btn-ghost-ink">
                            How OpenAdapt compares
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
