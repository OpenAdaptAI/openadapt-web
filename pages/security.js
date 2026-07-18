import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

const REPO_URL = 'https://github.com/OpenAdaptAI/openadapt-flow'
const ADVISORY_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/security/advisories/new'
const PRIVACY_BOUNDARY_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/PRIVACY.md'

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Security and trust',
    url: 'https://openadapt.ai/security',
    description:
        'OpenAdapt security controls, local-first execution, governed artifact boundaries, assurance status, and vulnerability reporting.',
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

// Status labels describe public evidence, not an external certification.
const posture = [
    {
        status: 'yes',
        title: 'Local browser execution is available',
        body: 'Recordings, compiled bundles, and replays remain local by default. Treat every compiled bundle as sensitive: it can contain screenshots, typed values, and literal identity evidence. Remote upload accepts only the manifest-bound sanitized derivative admitted by destination policy.',
    },
    {
        status: 'yes',
        title: 'No AI calls on a normal run',
        body: 'Healthy replay makes zero model calls. Deterministic structure, template, OCR, and geometry evidence runs before any optional model. If a remote model endpoint is configured, relevant screenshots or crops can cross that endpoint boundary; running the model on-premises is possible but must be deployed and verified by the operator.',
    },
    {
        status: 'yes',
        title: 'Audit trail on every run',
        body: 'Every replay writes a step-by-step report. The machine-readable report can contain sensitive parameters and identity evidence, and reports are not cryptographically signed or append-only by default. Treat them as sensitive operational artifacts, not an immutable audit ledger.',
    },
    {
        status: 'yes',
        title: 'Sanitized derivatives for artifact upload',
        body: 'A local sanitizer inventories and transforms a copy, rescans it, records coverage and unresolved findings, and hashes the result. Policy can require a person to review the derivative locally and approve that exact hash. Unknown or unresolved content is refused. The raw original remains sensitive and local.',
    },
    {
        status: 'yes',
        title: 'Challenge-bound hosted bundle admission',
        body: 'A runnable hosted bundle also needs an operator attestation over its exact approved recording and bundle hashes, compiler provenance, strict lint, policy certification, derived risk class, and successful matching replay report. Cloud verifies deployment allowlists and consumes a one-time challenge when the exact bundle is accepted.',
    },
    {
        status: 'yes',
        title: 'Open source and auditable',
        body: 'The engine is MIT-licensed. You can read the code, run it yourself, and verify these claims rather than take them on trust.',
    },
    {
        status: 'planned',
        title: 'SOC 2',
        body: 'OpenAdapt does not hold a SOC 2 attestation today. Architecture and source code are not substitutes for an independent report.',
    },
    {
        status: 'planned',
        title: 'BAA (Business Associate Agreement)',
        body: 'We do not run a standing BAA program today. If an enterprise pilot requires a BAA, talk to us and we will scope it as part of the engagement. We would rather tell you this up front than imply a program we have not stood up.',
    },
]

const statusLabel = {
    yes: 'In place',
    progress: 'In progress',
    planned: 'Not held',
}

const statusColor = {
    yes: 'var(--accent)',
    progress: 'var(--inset-warn)',
    planned: 'var(--inset-warn)',
}

const boundaries = [
    {
        question: 'Which components see screenshots?',
        answer: 'The recorder captures frames; compilation extracts visual evidence; replay captures live frames for resolution and postconditions; run artifacts may preserve evidence. These paths execute locally on the shipped browser backend.',
    },
    {
        question: 'What can transmit them?',
        answer: 'Local healthy replay does not transmit screenshots. An explicitly configured remote model can receive relevant screenshots or crops. Hosted upload accepts the sanitized derivative bound to its reviewed manifest hash, not the local original. Runtime screenshots can reintroduce sensitive data and follow the destination policy of the declared trusted execution boundary.',
    },
    {
        question: 'Where are secrets and PHI?',
        answer: 'Password and declared secret fields are injected at replay rather than written to the recording. Other screenshots, typed values, identity strings, compiled bundles, and machine-readable reports may contain PHI or PII and require customer-controlled storage and retention. Do not infer that compilation de-identifies a workflow.',
    },
    {
        question: 'What does break reporting send?',
        answer: 'report-break parses the local run report, scrubs it fail-closed, and sends a PHI-minimized break descriptor. It does not upload the recording or compiled bundle. If the control plane rejects the descriptor at the PHI boundary, the client retries with harder scrubbing and then falls back to local-only.',
    },
    {
        question: 'What cryptographic guarantees exist?',
        answer: 'Bundles and durable checkpoints support optional AES-256-GCM encryption at rest. Hosted validation uses an ingest-token HMAC to detect mutation and bind evidence hashes to a one-time organization/token challenge and exact bundle upload. Individual run reports are not a signed, append-only audit ledger by default; no claim of tamper-proof audit history is made.',
    },
    {
        question: 'Is hosted validation an independent certification?',
        answer: 'No. validate-hosted is operator self-attestation: the ingest-token holder signs hashes over local lint, policy, provenance, and replay evidence. Cloud checks exact bindings, freshness, its policy and risk-class allowlists, the deployed compiler-version allowlist, and one-time challenge consumption, but it did not witness the local replay. Independent certification requires a separately controlled evaluator, evidence custody, and signing identity.',
    },
    {
        question: 'Does Cloud independently witness local sanitation review?',
        answer: 'No. Cloud accounts for every accepted archive byte and verifies the manifest, exact artifact hash, and submitting ingest token. It does not observe the loopback viewer or rerun OCR/NER. The recorded approval is operator attestation; reviewer identity, separation of duties, and evidence custody remain deployment controls.',
    },
    {
        question: 'Can managed execution reach private-network targets?',
        answer: 'No. Managed browser admission requires public DNS names. Literal IPs, special-use names, and wildcards are refused; the runner resolves each admitted name again and refuses private, loopback, link-local, reserved, or otherwise non-global answers before constructing the sandbox egress allowlist.',
    },
    {
        question: 'What is the regulated deployment product?',
        answer: 'Regulated workflows run in a declared customer-controlled boundary when their live screens necessarily expose PHI. Sanitized authoring derivatives and minimized control-plane metadata may cross an approved boundary; PHI-bearing runtime frames do not. Deployment scope records the substrate, operators, effect oracle, storage, update, retention, support, and legal controls.',
    },
]

const scrubStages = [
    ['Inventory', 'Enumerate every file and channel. Symlinks, archives, databases, media, metadata, and unknown types require an explicit handler or the operation stops.'],
    ['Transform a copy', 'Keep the sensitive original local. Redact or parameterize supported text, structured records, screenshots, and metadata in a separate derivative.'],
    ['Rescan and manifest', 'Scan the derivative again, record tool and policy versions, list unresolved findings, and compute a cryptographic hash over the exact result.'],
    ['Review and approve', 'When policy requires it, inspect the derivative locally, correct missed or excessive redactions, then approve its hash. Any later modification invalidates approval.'],
]

const reviewPolicies = [
    ['Automatic', 'Lowest friction for schema-minimized diagnostics with complete handler coverage.', 'A detector false negative can cross the boundary.'],
    ['Human required', 'Adds contextual review for screenshots, free text, and consequential artifacts.', 'Costs operator time and human approval is not proof of de-identification.'],
    ['Risk-based hybrid', 'Automatic for narrow diagnostics; review required for recordings and bundles unless an administrator approves a measured policy.', 'Requires explicit artifact classes, thresholds, and audit configuration.'],
]

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Security and trust | OpenAdapt</title>
                <meta
                    name="description"
                    content="Review OpenAdapt security controls, local-first execution, governed artifact boundaries, assurance status, and vulnerability reporting."
                />
                <link rel="canonical" href="https://openadapt.ai/security" />
                <meta
                    property="og:title"
                    content="Security and trust | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="Local-first execution, governed artifact boundaries, assurance status, and vulnerability reporting."
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
                    Controls, data boundaries, and assurance
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    OpenAdapt is built to run where your data already lives. Use
                    this page to map local, managed, and customer-controlled
                    execution to the controls and assurance commitments required
                    for your workflow.
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

                <div className="mt-12 border-t border-hairline pt-10">
                    <p className="eyebrow">Data boundary</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Questions a security review should answer first
                    </h2>
                    <dl className="mt-6 grid gap-4 md:grid-cols-2">
                        {boundaries.map((item) => (
                            <div
                                key={item.question}
                                className="rounded-xl border border-hairline bg-panel p-5"
                            >
                                <dt className="font-display text-base font-semibold text-ink">
                                    {item.question}
                                </dt>
                                <dd className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {item.answer}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-5 text-sm text-ink-2">
                        The engine documents its artifact-by-artifact boundary in{' '}
                        <a
                            href={PRIVACY_BOUNDARY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline"
                        >
                            the public privacy threat model
                        </a>
                        .
                    </p>
                </div>

                <div className="mt-12 border-t border-hairline pt-10">
                    <p className="eyebrow">PHI sanitation</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Scrubbing creates a reviewable derivative
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Scrubbing is not a boolean claim attached to a bundle. It
                        is a local transformation and approval protocol. The raw
                        source never becomes safe merely because a derivative
                        exists, and a sanitized recording does not prevent live
                        PHI from appearing during execution.
                    </p>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Sanitation and runnability are separate gates. Register
                        the approved recording derivative, compile it locally,
                        pass strict lint and policy certification, and produce a
                        successful matching replay report. Then sanitize, review,
                        and approve a bundle whose execution-bearing content is
                        unchanged. If recording sanitation changed execution
                        content, hosted ingest marks it{' '}
                        <code>needs_parameterization</code>; parameterize before
                        compilation.
                    </p>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {scrubStages.map(([title, body], index) => (
                            <article key={title} className="rounded-xl border border-hairline bg-panel p-5">
                                <p className="font-mono text-xs text-accent">{index + 1}</p>
                                <h3 className="mt-2 font-display text-base font-semibold text-ink">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
                            </article>
                        ))}
                    </div>
                    <div className="mt-6 overflow-x-auto rounded-xl border border-hairline bg-panel">
                        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                            <thead className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                                <tr>
                                    <th className="border-b border-hairline px-4 py-3">Review policy</th>
                                    <th className="border-b border-hairline px-4 py-3">Best fit</th>
                                    <th className="border-b border-hairline px-4 py-3">Tradeoff</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviewPolicies.map(([policy, fit, tradeoff]) => (
                                    <tr key={policy} className="align-top">
                                        <th className="border-b border-hairline px-4 py-3 font-medium text-ink">{policy}</th>
                                        <td className="border-b border-hairline px-4 py-3 text-ink-2">{fit}</td>
                                        <td className="border-b border-hairline px-4 py-3 text-ink-2">{tradeoff}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-ink-3">
                        The launch default is the risk-based hybrid: minimized
                        diagnostics can be automatic; recordings and bundles
                        require review unless an administrator explicitly adopts
                        an automatic policy with complete type coverage.
                    </p>
                    <div className="mt-6 rounded-xl border-2 border-ink bg-panel p-5 md:p-6">
                        <p className="eyebrow">Hosted runtime gate</p>
                        <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                            Approval, validation, and certification are different
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            The cross-engine sequence is recording sanitize →
                            review → approve → push; local compile → strict lint
                            → certify → successful replay; bundle sanitize →
                            review → approve; then <code>validate-hosted</code> →
                            attested bundle push → configure → run. The validation
                            envelope binds exact artifact hashes, compiler and
                            parameter-schema provenance, the exact non-PHI HTTPS
                            entry URL, target boundary, and actual replay origin,
                            lint/certification
                            and report hashes, the derived <code>low</code> or{' '}
                            <code>consequential</code> risk class, and a fresh
                            one-time challenge. Cloud additionally requires exact
                            policy, risk-class, and deployed compiler-version
                            allowlist membership.
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-ink-3">
                            This is operator self-attestation, not third-party
                            certification. It proves that the token holder signed
                            a non-mutated evidence envelope; it does not prove an
                            independent party witnessed the replay or that the
                            workflow is universally safe.
                        </p>
                        <a
                            href="https://docs.openadapt.ai/guides/hosted/"
                            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                        >
                            Run the exact hosted validation sequence →
                        </a>
                    </div>
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
                            Evaluate a workflow
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
