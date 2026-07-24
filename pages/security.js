import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

const REPO_URL = 'https://github.com/OpenAdaptAI/openadapt-flow'
const ADVISORY_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/security/advisories/new'
const SECURITY_POLICY_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/SECURITY.md'
const PRIVACY_BOUNDARY_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/PRIVACY.md'
const LIMITS_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/blob/main/docs/LIMITS.md'
const RELEASES_URL =
    'https://github.com/OpenAdaptAI/openadapt-desktop/blob/main/RELEASES.md'
// Security reports go through GitHub private advisories or hello@openadapt.ai.
// There is no security@openadapt.ai mailbox today — do not advertise one.
const CONTACT_EMAIL = 'hello@openadapt.ai'

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Trust center',
    url: 'https://openadapt.ai/security',
    description:
        'OpenAdapt trust center: architecture and data-flow boundaries, encryption, retention, subprocessors, access control, release integrity, vulnerability disclosure, incident response, and compliance status — each with its honest current state.',
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

// Every status label below describes public, verifiable evidence in our repos —
// not an external certification. "In place" means the control ships today;
// "Operator-controlled" means the control exists but you own its configuration;
// "Roadmap" means it is designed but not generally available; "Not held" means
// we do not have it and will not imply otherwise.

const summary = [
    {
        area: 'Architecture & data flow',
        anchor: 'architecture',
        status: 'yes',
        note: 'Local-first; PHI/PII boundary documented artifact-by-artifact.',
    },
    {
        area: 'Encryption & key boundaries',
        anchor: 'encryption',
        status: 'partial',
        note: 'Optional AES-256-GCM at rest; TLS in transit; HMAC-bound ingest.',
    },
    {
        area: 'Data retention & deletion',
        anchor: 'retention',
        status: 'operator',
        note: 'Local retention is operator-owned; hosted has no fixed schedule yet.',
    },
    {
        area: 'Subprocessors',
        anchor: 'subprocessors',
        status: 'yes',
        note: 'Named and current. No default model provider.',
    },
    {
        area: 'Identity, access & tenancy',
        anchor: 'access',
        status: 'partial',
        note: 'Org RBAC, row-level tenant isolation, and TOTP step-up protect platform administration; SSO / SAML / SCIM is not included.',
    },
    {
        area: 'Release integrity',
        anchor: 'release-integrity',
        status: 'partial',
        note: 'Build provenance today; code signing not yet — desktop is unsigned/ad-hoc.',
    },
    {
        area: 'Secure development',
        anchor: 'secure-development',
        status: 'yes',
        note: 'Open source, SHA-pinned CI, Dependabot, private advisories.',
    },
    {
        area: 'Vulnerability disclosure',
        anchor: 'disclosure',
        status: 'yes',
        note: 'Private advisory channel; 5-business-day acknowledgment target.',
    },
    {
        area: 'Incident response',
        anchor: 'incident-response',
        status: 'partial',
        note: 'Reporter-facing process defined; formal program is early.',
    },
    {
        area: 'DPA & BAA',
        anchor: 'legal',
        status: 'scoped',
        note: 'DPA (GDPR/CCPA/PIPEDA) available on request. In the self-hosted deployment PHI/PII stays in your environment, so a BAA is not the operative instrument for that shape; where procurement requires written terms we can sign a US HIPAA BAA, or for an Ontario clinic a PHIPA service-provider agreement, following review.',
    },
    {
        area: 'SOC 2',
        anchor: 'assurance',
        status: 'readiness',
        note: 'Type II readiness program underway; controls mapped to AICPA Trust Services Criteria. No report yet.',
    },
]

const chip = {
    yes: { label: 'In place', color: 'var(--accent)' },
    partial: { label: 'Partial', color: 'var(--inset-warn)' },
    operator: { label: 'Operator-controlled', color: 'var(--inset-warn)' },
    roadmap: { label: 'Roadmap', color: 'var(--inset-warn)' },
    scoped: { label: 'Scoped per engagement', color: 'var(--inset-warn)' },
    readiness: { label: 'Readiness program', color: 'var(--inset-warn)' },
    none: { label: 'Not held', color: 'var(--inset-warn)' },
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

// A truthful map of where data lives and what can leave the operator boundary.
// Lifted from openadapt-flow docs/PRIVACY.md (the PHI touchpoint map) and
// docs/LIMITS.md. Each destination names its control honestly.
const flowZones = [
    {
        title: 'Operator boundary (local, default)',
        tone: 'ground',
        lead: 'Everything below stays on the operator machine unless an explicit, configured action moves a derivative out.',
        items: [
            [
                'Raw recording',
                'Full screenshots, literal typed values, and structured identity DOM text. Not scrubbed — it is the compile input. Control: filesystem permissions + your retention policy.',
            ],
            [
                'Compiled bundle',
                'Anchor OCR/context text, identity band (name/DOB/MRN), templates, and identifier crops. Not scrubbed — the identity evidence is what powers the wrong-patient check. Control: filesystem + retention.',
            ],
            [
                'Run report (report.json)',
                'Parameters, per-step intent, and recorded-vs-live identity text. The audit trail. Not scrubbed by design. The shareable REPORT.md derivative is scrubbed.',
            ],
            [
                'Persisted step / heal frames',
                'Redacted through Presidio image scrubbing when image scrubbing is enabled, and implied whenever scrubbing is pinned on.',
            ],
        ],
    },
    {
        title: 'Optional on-prem model appliance',
        tone: 'warn',
        lead: 'Only when an operator explicitly enables model-assisted repair. The appliance binds to loopback by default and warns loudly if exposed without a token or TLS.',
        items: [
            [
                'Identity crops & screenshots',
                'Sent to the appliance to answer "same record or different?" These are PHI/PII in flight and are deliberately NOT scrubbed — the crop is the identifier. Control is a data-flow boundary: on-prem-only destination + no retention (no disk or log writes), not scrubbing.',
            ],
        ],
    },
    {
        title: 'OpenAdapt hosted control plane (optional)',
        tone: 'panel',
        lead: 'Used only for the hosted service. PHI/PII-bearing runtime frames do not cross this boundary; only the artifacts below do.',
        items: [
            [
                'Sanitized artifact ingest',
                'Accepts the reviewed, scrubbed derivative frozen to its exact approved archive hash — never the raw local source. Unsupported types refuse the whole derivative.',
            ],
            [
                'Break report',
                'A schema-minimal, PHI/PII-scrubbed halt descriptor. No intents, reasons, errors, screenshots, DOM, or field values. Fails closed to local-only if the PHI/PII boundary rejects it.',
            ],
            [
                'Account & run metadata',
                'Account, organization, subscription, run status, usage, and audit records needed to operate the service.',
            ],
        ],
    },
]

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
        question: 'Where are secrets and PHI/PII?',
        answer: 'Password and declared secret fields are injected at replay rather than written to the recording. Other screenshots, typed values, identity strings, compiled bundles, and machine-readable reports may contain PHI or PII and require customer-controlled storage and retention. Do not infer that compilation de-identifies a workflow.',
    },
    {
        question: 'What does break reporting send?',
        answer: 'report-break parses the local run report, scrubs it fail-closed, and sends a PHI/PII-minimized break descriptor. It does not upload the recording or compiled bundle. If the control plane rejects the descriptor at the PHI/PII boundary, the client retries with harder scrubbing and then falls back to local-only.',
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
        answer: 'Regulated workflows run in a declared customer-controlled boundary when their live screens necessarily expose PHI/PII. Sanitized authoring derivatives and minimized control-plane metadata may cross an approved boundary; PHI/PII-bearing runtime frames do not. Deployment scope records the substrate, operators, effect oracle, storage, update, retention, support, and legal controls.',
    },
]

const encryption = [
    [
        'Bundle & checkpoint at rest',
        'Compiled bundles and durable checkpoints support optional AES-256-GCM authenticated encryption at rest. It is opt-in, not automatic: unencrypted artifacts on disk are protected by filesystem permissions and your retention policy until you enable it. Raw recordings and run reports are PHI/PII-at-rest and are not encrypted for you.',
    ],
    [
        'Secret fields (local)',
        'Browser password and declared secret fields are injected at replay time and are not written into recording events or the compiled bundle. Other typed values are recorded literally. On the desktop, the hosted auth token lives in the OS keychain (macOS Keychain, Windows Credential Manager, Linux Secret Service), not in a plaintext config file.',
    ],
    [
        'Hosted secrets vault',
        'The hosted service stores workflow secrets per organization, encrypted app-side with AES-256-GCM before they reach the database, so the store only ever holds ciphertext. Values are write-only (never returned to a browser) and are released to a runner once, through a single-use, short-lived token exchange at run time. The encryption key lives only in the control plane and supports zero-downtime rotation.',
    ],
    [
        'Bundle integrity',
        'A compiled bundle carries a schema-versioned manifest: a whole-bundle SHA-256 content digest, per-asset hashes, and provenance (source-recording and compiler-config hashes, compiler version, certification). It is sealed on save and re-verified on load. A content digest proves byte identity, not publisher identity, and is not a tamper-proof audit ledger.',
    ],
    [
        'In transit',
        'Hosted and provider traffic uses TLS. The Windows desktop control channel adds per-run self-signed certificates with SHA-256 fingerprint pinning and refuses a plaintext downgrade to a non-loopback host. The optional on-prem model appliance expects TLS terminated at a reverse proxy and a service token; it warns loudly at startup if bound off-loopback without one.',
    ],
    [
        'Hosted ingest integrity',
        'Artifact ingest is bound by an attestation the operator HMAC-signs with their ingest token, over exact evidence hashes and a single-use, time-bound, organization-scoped challenge, so a mutated or replayed upload is refused. This detects tampering; it is not a third-party certification of the workflow.',
    ],
]

const scrubStages = [
    [
        'Inventory',
        'Enumerate every file and channel. Symlinks, archives, databases, media, metadata, and unknown types require an explicit handler or the operation stops.',
    ],
    [
        'Transform a copy',
        'Keep the sensitive original local. Redact or parameterize supported text, structured records, screenshots, and metadata in a separate derivative.',
    ],
    [
        'Rescan and manifest',
        'Scan the derivative again, record tool and policy versions, list unresolved findings, and compute a cryptographic hash over the exact result.',
    ],
    [
        'Review and approve',
        'When policy requires it, inspect the derivative locally, correct missed or excessive redactions, then approve its hash. Any later modification invalidates approval.',
    ],
]

const reviewPolicies = [
    [
        'Automatic',
        'Lowest friction for schema-minimized diagnostics with complete handler coverage.',
        'A detector false negative can cross the boundary.',
    ],
    [
        'Human required',
        'Adds contextual review for screenshots, free text, and consequential artifacts.',
        'Costs operator time and human approval is not proof of de-identification.',
    ],
    [
        'Risk-based hybrid',
        'Automatic for narrow diagnostics; review required for recordings and bundles unless an administrator approves a measured policy.',
        'Requires explicit artifact classes, thresholds, and audit configuration.',
    ],
]

const subprocessors = [
    [
        'Netlify',
        'Website hosting and form submissions',
        'Marketing site, contact/update forms',
    ],
    [
        'Supabase',
        'Hosted authentication, database, and private object storage',
        'Hosted service accounts and artifacts',
    ],
    [
        'Modal',
        'Managed browser recording and run compute; optional hosted compilation only when explicitly enabled',
        'Hosted service runtime',
    ],
    [
        'Stripe',
        'Checkout, billing, and subscription state',
        'Hosted service billing',
    ],
    [
        'PostHog',
        'Launch-funnel analytics when a key is configured (autocapture, persistence, and session recording disabled)',
        'Marketing site only',
    ],
    ['Cal.com', 'Meeting booking', 'Marketing site booking flow'],
    [
        'GitHub',
        'Source links, repository widgets, and public repository data',
        'Marketing site + open source',
    ],
]

const releaseIntegrity = [
    {
        title: 'Build provenance & attestations',
        status: 'yes',
        body: 'The PyPI engine publishes wheel and sdist with PEP 740 publish attestations. Native desktop installers ship a SHA256SUMS manifest with SLSA provenance-v1 build attestations you can verify with sha256sum -c and gh attestation verify. Provenance answers "was this built from our source by our CI"; it is not the same as code signing.',
    },
    {
        title: 'Code signing',
        status: 'partial',
        body: 'Desktop installers are currently UNSIGNED (Windows, Linux) or ad-hoc signed (macOS), and their filenames say so. Apple Developer ID + notarization and Windows Authenticode are not yet configured; the signing workflow fails closed on partial credentials. Until signing lands, verify downloads with the published checksums and attestations.',
    },
    {
        title: 'Software bill of materials (SBOM)',
        status: 'roadmap',
        body: 'We do not currently publish a machine-readable SBOM as a release asset. Dependencies are visible in the open-source lockfiles, and dependency updates flow through Dependabot. A published SBOM is a roadmap item.',
    },
]

const secureDev = [
    [
        'Open source, reviewable',
        'The compiler and runtime are MIT-licensed and public. Anyone can read the code, reproduce the behavior, and file findings.',
    ],
    [
        'Pinned, monitored supply chain',
        'GitHub Actions are pinned by commit SHA and dependency updates flow through Dependabot. A pinning gap is explicitly in scope for a security report.',
    ],
    [
        'Change control',
        'Changes land through pull requests with automated checks (build, contract, and truth tests on this site; engine test suites upstream) before release.',
    ],
    [
        'Privacy as a choke point',
        'PHI/PII scrubbing is wired through a single documented choke point with fail-closed and fail-loud modes, so a missing scrubber cannot silently leak.',
    ],
]

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Trust center | OpenAdapt</title>
                <meta
                    name="description"
                    content="OpenAdapt trust center: architecture and data-flow boundaries, encryption, retention, subprocessors, access control, release integrity, vulnerability disclosure, incident response, and compliance status — each with its honest current state."
                />
                <link rel="canonical" href="https://openadapt.ai/security" />
                <meta property="og:title" content="Trust center | OpenAdapt" />
                <meta
                    property="og:description"
                    content="Architecture and data boundaries, encryption, retention, subprocessors, access, release integrity, disclosure, incident response, and compliance status — each with its honest current state."
                />
                <meta
                    property="og:url"
                    content="https://openadapt.ai/security"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webPageSchema),
                    }}
                />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">Trust center</p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Security, data boundaries, and assurance
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    OpenAdapt is built to run where your data already lives.
                    This page is written for a security reviewer: every area
                    below states what actually exists today, what you control,
                    and what we do not have yet. Where a control is not in
                    place, we say so rather than imply it.
                </p>

                {/* At a glance */}
                <div
                    id="summary"
                    className="mt-10 overflow-x-auto rounded-xl border border-hairline bg-panel"
                >
                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                        <caption className="sr-only">
                            Trust center summary: each area with its current
                            status and a link to detail.
                        </caption>
                        <thead className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                            <tr>
                                <th className="border-b border-hairline px-4 py-3">
                                    Area
                                </th>
                                <th className="border-b border-hairline px-4 py-3">
                                    Status
                                </th>
                                <th className="border-b border-hairline px-4 py-3">
                                    In short
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((row) => (
                                <tr key={row.area} className="align-top">
                                    <th className="border-b border-hairline px-4 py-3 font-medium text-ink">
                                        <a
                                            href={`#${row.anchor}`}
                                            className="text-accent hover:underline"
                                        >
                                            {row.area}
                                        </a>
                                    </th>
                                    <td className="border-b border-hairline px-4 py-3">
                                        <span
                                            className="inline-block rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]"
                                            style={{
                                                color: chip[row.status].color,
                                                border: `1px solid ${chip[row.status].color}`,
                                            }}
                                        >
                                            {chip[row.status].label}
                                        </span>
                                    </td>
                                    <td className="border-b border-hairline px-4 py-3 text-ink-2">
                                        {row.note}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Architecture & data flow */}
                <div
                    id="architecture"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Architecture &amp; data flow</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Where data lives, and what can leave the boundary
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        OpenAdapt is local-first. Recording, compilation, and
                        healthy replay run entirely on the operator machine.
                        Data only leaves that boundary through the explicit,
                        configured paths shown below. This map mirrors the
                        engine&#39;s own artifact-by-artifact PHI/PII documentation.
                    </p>
                    <div className="mt-6 space-y-4">
                        {flowZones.map((zone) => (
                            <div
                                key={zone.title}
                                className="rounded-xl border border-hairline bg-panel p-5"
                                style={{
                                    borderLeft:
                                        zone.tone === 'warn'
                                            ? '4px solid var(--inset-warn)'
                                            : '4px solid var(--accent)',
                                }}
                            >
                                <h3 className="font-display text-base font-semibold text-ink">
                                    {zone.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {zone.lead}
                                </p>
                                <dl className="mt-4 space-y-3">
                                    {zone.items.map(([term, def]) => (
                                        <div key={term}>
                                            <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-3">
                                                {term}
                                            </dt>
                                            <dd className="mt-1 text-sm leading-relaxed text-ink-2">
                                                {def}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ))}
                    </div>
                    <p className="mt-5 text-sm text-ink-2">
                        Full detail:{' '}
                        <a
                            href={PRIVACY_BOUNDARY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline"
                        >
                            the PHI/PII threat model
                        </a>{' '}
                        and{' '}
                        <a
                            href={LIMITS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline"
                        >
                            the limits and guarantees doc
                        </a>
                        .
                    </p>
                </div>

                {/* Control posture */}
                <div
                    id="posture"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Control posture</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Controls that ship in the product today
                    </h2>
                    <div className="mt-6 space-y-4">
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
                </div>

                {/* Data boundary Q&A */}
                <div
                    id="data-boundary"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
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
                        The engine documents its artifact-by-artifact boundary
                        in{' '}
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

                {/* Encryption */}
                <div
                    id="encryption"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Encryption &amp; keys</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Encryption boundaries, stated plainly
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        We describe encryption by what is actually enforced, not
                        by a blanket &ldquo;encrypted everywhere&rdquo; claim.
                        Some of it is opt-in, and some sensitive artifacts are
                        not encrypted for you by default.
                    </p>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {encryption.map(([title, body]) => (
                            <div
                                key={title}
                                className="rounded-xl border border-hairline bg-panel p-5"
                            >
                                <h3 className="font-display text-base font-semibold text-ink">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PHI/PII sanitation */}
                <div
                    id="sanitation"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">PHI/PII sanitation</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Scrubbing creates a reviewable derivative
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Scrubbing is not a boolean claim attached to a bundle.
                        It is a local transformation and approval protocol. The
                        raw source never becomes safe merely because a
                        derivative exists, and a sanitized recording does not
                        prevent live PHI/PII from appearing during execution.
                    </p>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Sanitation and runnability are separate gates. Register
                        the approved recording derivative, compile it locally,
                        pass strict lint and policy certification, and produce a
                        successful matching replay report. Then sanitize,
                        review, and approve a bundle whose execution-bearing
                        content is unchanged. If recording sanitation changed
                        execution content, hosted ingest marks it{' '}
                        <code>needs_parameterization</code>; parameterize before
                        compilation.
                    </p>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {scrubStages.map(([title, body], index) => (
                            <article
                                key={title}
                                className="rounded-xl border border-hairline bg-panel p-5"
                            >
                                <p className="font-mono text-xs text-accent">
                                    {index + 1}
                                </p>
                                <h3 className="mt-2 font-display text-base font-semibold text-ink">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {body}
                                </p>
                            </article>
                        ))}
                    </div>
                    <div className="mt-6 overflow-x-auto rounded-xl border border-hairline bg-panel">
                        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                            <thead className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                                <tr>
                                    <th className="border-b border-hairline px-4 py-3">
                                        Review policy
                                    </th>
                                    <th className="border-b border-hairline px-4 py-3">
                                        Best fit
                                    </th>
                                    <th className="border-b border-hairline px-4 py-3">
                                        Tradeoff
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviewPolicies.map(
                                    ([policy, fit, tradeoff]) => (
                                        <tr key={policy} className="align-top">
                                            <th className="border-b border-hairline px-4 py-3 font-medium text-ink">
                                                {policy}
                                            </th>
                                            <td className="border-b border-hairline px-4 py-3 text-ink-2">
                                                {fit}
                                            </td>
                                            <td className="border-b border-hairline px-4 py-3 text-ink-2">
                                                {tradeoff}
                                            </td>
                                        </tr>
                                    )
                                )}
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
                            Approval, validation, and certification are
                            different
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            The cross-engine sequence is recording sanitize →
                            review → approve → push; local compile → strict lint
                            → certify → successful replay; bundle sanitize →
                            review → approve; then <code>validate-hosted</code>{' '}
                            → attested bundle push → configure → run. The
                            validation envelope binds exact artifact hashes,
                            compiler and parameter-schema provenance, the exact
                            non-PHI HTTPS entry URL, target boundary, and actual
                            replay origin, lint/certification and report hashes,
                            the derived <code>low</code> or{' '}
                            <code>consequential</code> risk class, and a fresh
                            one-time challenge. Cloud additionally requires
                            exact policy, risk-class, and deployed
                            compiler-version allowlist membership.
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-ink-3">
                            This is operator self-attestation, not third-party
                            certification. It proves that the token holder
                            signed a non-mutated evidence envelope; it does not
                            prove an independent party witnessed the replay or
                            that the workflow is universally safe.
                        </p>
                        <a
                            href="https://docs.openadapt.ai/guides/hosted/"
                            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                        >
                            Run the exact hosted validation sequence →
                        </a>
                    </div>
                </div>

                {/* Retention & deletion */}
                <div
                    id="retention"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Retention &amp; deletion</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Retention is operator-owned; hosted has no fixed
                        schedule yet
                    </h2>
                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        <p>
                            <strong className="text-ink">
                                Local artifacts.
                            </strong>{' '}
                            The engine does not automatically delete raw
                            recordings, bundles, machine reports, or
                            checkpoints. Retention and deletion of local data
                            are controlled by the operator through filesystem
                            and backup policy.
                        </p>
                        <p>
                            <strong className="text-ink">
                                Hosted service.
                            </strong>{' '}
                            The hosted service persists account and organization
                            data, managed recordings, approved artifacts,
                            bundles, reports, run and usage records, and billing
                            references in its configured stores. Short-lived
                            signed runner URLs limit object access but do not
                            delete the stored objects.
                        </p>
                        <p>
                            <strong className="text-ink">
                                No fixed schedule yet.
                            </strong>{' '}
                            The self-serve service currently publishes no fixed
                            retention, backup-deletion, or recovery period. Do
                            not send data that requires a specific schedule
                            until that schedule and deletion process are
                            documented in a qualified written deployment scope.
                            Providers can retain billing, security, or service
                            records under their own obligations.
                        </p>
                        <p>
                            Deletion requests for personal information can be
                            sent to{' '}
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="text-accent underline"
                            >
                                {CONTACT_EMAIL}
                            </a>
                            ; see the{' '}
                            <Link
                                href="/privacy-policy"
                                className="text-accent underline"
                            >
                                Privacy Notice
                            </Link>
                            .
                        </p>
                    </div>
                </div>

                {/* Subprocessors */}
                <div
                    id="subprocessors"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Subprocessors</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        The third parties in our current product paths
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        These providers can receive the network and service data
                        needed for the selected interaction and process it under
                        their own terms. A customer-controlled deployment can
                        use a different approved provider set documented in its
                        scope.
                    </p>
                    <div className="mt-6 overflow-x-auto rounded-xl border border-hairline bg-panel">
                        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                            <thead className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                                <tr>
                                    <th className="border-b border-hairline px-4 py-3">
                                        Provider
                                    </th>
                                    <th className="border-b border-hairline px-4 py-3">
                                        Purpose
                                    </th>
                                    <th className="border-b border-hairline px-4 py-3">
                                        Where used
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {subprocessors.map(([name, purpose, where]) => (
                                    <tr key={name} className="align-top">
                                        <th className="border-b border-hairline px-4 py-3 font-medium text-ink">
                                            {name}
                                        </th>
                                        <td className="border-b border-hairline px-4 py-3 text-ink-2">
                                            {purpose}
                                        </td>
                                        <td className="border-b border-hairline px-4 py-3 text-ink-2">
                                            {where}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ink-2">
                        <strong className="text-ink">
                            No default model provider.
                        </strong>{' '}
                        Healthy replay makes no model calls, so no AI provider
                        is a standing subprocessor. If an operator explicitly
                        enables model-assisted repair, they choose the endpoint
                        (a local or on-prem model, or a remote provider under
                        that provider&#39;s own terms).
                    </p>
                </div>

                {/* Identity, access & tenancy */}
                <div
                    id="access"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Identity, access &amp; tenancy</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Access control: honest current state
                    </h2>
                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        <p>
                            The hosted service authenticates users through
                            Supabase Auth and enforces{' '}
                            <strong className="text-ink">
                                per-organization role-based access control
                            </strong>{' '}
                            with owner, admin, and member roles. Every tenant
                            table is protected by Postgres row-level security
                            scoped to organization membership, so data is
                            isolated per organization rather than shared across
                            tenants.
                        </p>
                        <p>
                            Authenticator-app two-factor authentication is
                            available to every account and enforced for
                            platform administration. The platform-admin console
                            always requires both the server-side administrator
                            allowlist and a current two-factor session.
                            When a signed-in session needs this additional
                            assurance, Cloud asks for one current 6-digit code
                            and returns the user to the protected page after it
                            is accepted.
                        </p>
                        <p>
                            Enrollment also produces one-time recovery codes.
                            If an authenticator is lost, a recovery code removes
                            the inaccessible factors and returns the signed-in
                            user to Security &amp; 2FA to enroll a replacement.
                            Recovery never grants the protected session by
                            itself.
                        </p>
                        <p>
                            The signed-in account menu keeps identity and
                            organization context visible. It provides Security
                            &amp; 2FA, organization switching when an account
                            belongs to more than one workspace, and an explicit
                            sign-out action. The{' '}
                            <a
                                href="https://docs.openadapt.ai/guides/account-security/"
                                className="text-accent underline"
                            >
                                account-security guide
                            </a>{' '}
                            covers enrollment, step-up, recovery, and account or
                            workspace switching.
                        </p>
                        <p>
                            What is <strong className="text-ink">not</strong>{' '}
                            yet available:{' '}
                            <strong className="text-ink">
                                enterprise SSO / SAML
                            </strong>{' '}
                            and{' '}
                            <strong className="text-ink">
                                SCIM provisioning
                            </strong>
                            . Login is handled by Supabase Auth (email and OAuth
                            providers), not by an external enterprise identity
                            provider. We would rather say that than imply an
                            enterprise SSO program we have not shipped.
                        </p>
                        <p>
                            If you need enterprise identity integration now, a{' '}
                            <strong className="text-ink">
                                customer-controlled deployment
                            </strong>{' '}
                            lets you own the identity provider, access model,
                            and audit inside your boundary. The open-source
                            engine itself has no account system: installing it
                            does not create an account or send anything to the
                            hosted service.
                        </p>
                    </div>
                </div>

                {/* Release integrity */}
                <div
                    id="release-integrity"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Release integrity</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Signing, provenance, and SBOMs — what actually ships
                    </h2>
                    <div className="mt-6 space-y-4">
                        {releaseIntegrity.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl border border-hairline bg-panel p-5"
                                style={{
                                    borderLeft: `4px solid ${chip[item.status].color}`,
                                }}
                            >
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <strong className="font-display text-base font-semibold text-ink">
                                        {item.title}
                                    </strong>
                                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                                        {chip[item.status].label}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {item.body}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-5 text-sm text-ink-2">
                        The two-lane release policy and its planned convergence
                        after signing lands is documented in{' '}
                        <a
                            href={RELEASES_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline"
                        >
                            the desktop release policy
                        </a>
                        .
                    </p>
                </div>

                {/* Secure development */}
                <div
                    id="secure-development"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Secure development</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        How the software is built
                    </h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {secureDev.map(([title, body]) => (
                            <div
                                key={title}
                                className="rounded-xl border border-hairline bg-panel p-5"
                            >
                                <h3 className="font-display text-base font-semibold text-ink">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vulnerability disclosure */}
                <div
                    id="disclosure"
                    className="mt-14 scroll-mt-20 border-t-2 border-ink pt-10"
                >
                    <p className="eyebrow">Vulnerability disclosure</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Report a vulnerability
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        If you have found a security issue, please report it
                        privately so we can fix it before it is disclosed. The
                        fastest path is GitHub&#39;s private vulnerability
                        reporting on the repository. You can also email us with
                        &ldquo;Security&rdquo; in the subject line. Please do
                        not open a public issue for a suspected vulnerability.
                        We aim to acknowledge a report within{' '}
                        <strong className="text-ink">five business days</strong>
                        , confirm affected versions, prepare a fix, and credit
                        reporters who wish to be credited.
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
                            href={SECURITY_POLICY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline"
                        >
                            Read the security policy
                        </a>
                        <a
                            href={`mailto:${CONTACT_EMAIL}?subject=Security`}
                            className="text-accent hover:underline"
                        >
                            {CONTACT_EMAIL}
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

                {/* Incident response */}
                <div
                    id="incident-response"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Incident response</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Incident response: honest posture
                    </h2>
                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-2 md:text-base">
                        <p>
                            We have a defined intake and handling path for
                            reported vulnerabilities (above): private triage,
                            affected-version analysis, a forward-shipped fix,
                            and reporter credit. That is the part of incident
                            response that is real and operating today.
                        </p>
                        <p>
                            A{' '}
                            <strong className="text-ink">
                                formal, contractual incident-response program
                            </strong>{' '}
                            — customer breach notification timelines, on-call
                            rotation, and post-incident reporting — is early and
                            is scoped per engagement rather than offered as a
                            standing SLA. For the open-source engine running
                            inside your own boundary, incident response for the
                            surrounding environment (firewall, KMS, storage,
                            identity, backups) is your responsibility; the
                            engine supplies audit primitives, egress checks, and
                            run reports to support it.
                        </p>
                    </div>
                </div>

                {/* Legal readiness */}
                <div
                    id="legal"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Legal readiness</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        DPA and BAA
                    </h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div
                            className="rounded-xl border border-hairline bg-panel p-5"
                            style={{
                                borderLeft: '4px solid var(--inset-warn)',
                            }}
                        >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <strong className="font-display text-base font-semibold text-ink">
                                    Data Processing Agreement (DPA)
                                </strong>
                                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                                    Available on request
                                </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                A Data Processing Agreement covering GDPR, CCPA,
                                and PIPEDA is available on request for
                                hosted-service customers. Email{' '}
                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="underline decoration-hairline underline-offset-2 hover:text-ink"
                                >
                                    {CONTACT_EMAIL}
                                </a>{' '}
                                and we will provide our DPA as part of your
                                evaluation.
                            </p>
                        </div>
                        <div
                            className="rounded-xl border border-hairline bg-panel p-5"
                            style={{
                                borderLeft: '4px solid var(--inset-warn)',
                            }}
                        >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <strong className="font-display text-base font-semibold text-ink">
                                    Business Associate Agreement (BAA)
                                </strong>
                                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                                    On-prem; signable on review
                                </span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                For healthcare workflows, the default deployment
                                is self-hosted: OpenAdapt runs entirely inside
                                your environment and PHI stays in your network.
                                Because the software does not create, receive,
                                maintain, or transmit PHI on your behalf in that
                                shape, OpenAdapt is positioned as an on-premise
                                software vendor rather than a business associate,
                                and PHI does not enter our infrastructure. Your
                                compliance officer or counsel makes the
                                determination for your environment. Where your
                                procurement requires written terms, we can sign a
                                US HIPAA Business Associate Agreement, or for an
                                Ontario clinic a PHIPA service-provider agreement,
                                following review. Hosted processing of PHI inside
                                our infrastructure is governed by a signed BAA
                                and a deployment-specific HIPAA risk analysis
                                before regulated data is admitted. This describes
                                the deployment architecture and what we can sign,
                                not legal advice.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Assurance / SOC 2 */}
                <div
                    id="assurance"
                    className="mt-14 scroll-mt-20 border-t border-hairline pt-10"
                >
                    <p className="eyebrow">Assurance &amp; attestation</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        SOC 2 and independent attestation
                    </h2>
                    <div className="mt-6 rounded-xl border-2 border-ink bg-panel p-5 md:p-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <strong className="font-display text-base font-semibold text-ink">
                                SOC 2
                            </strong>
                            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                                Readiness program underway
                            </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            <strong className="font-semibold text-ink">
                                SOC 2 readiness program underway.
                            </strong>{' '}
                            Security controls are implemented and mapped to the
                            AICPA Trust Services Criteria; a SOC 2 Type II
                            attestation is being pursued. Status and timeline
                            available on request.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            OpenAdapt operates a formal information-security
                            program built around the AICPA SOC 2 Trust Services
                            Criteria (Security, Availability, and
                            Confidentiality). We maintain a documented policy
                            suite, a controls matrix mapped to the Common
                            Criteria (CC1&ndash;CC9) plus Availability (A1) and
                            Confidentiality (C1), and an evidence-based internal
                            gap assessment. Core technical controls are already
                            in production, including tenant isolation (row-level
                            security), encryption of secrets at rest
                            (AES-256-GCM) and data in transit (TLS),
                            least-privilege access, a hardened CI/CD supply
                            chain, and automated PII/PHI sanitization. We are
                            pursuing a SOC 2 Type II attestation; our roadmap,
                            current control status, and security documentation
                            are available under NDA on request.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            OpenAdapt does not yet hold a SOC 2 report. We do not
                            claim certification. When an audit is genuinely
                            underway, this page will name the report type, the
                            auditor, and the period — and not before.
                        </p>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-ink-3">
                        Open source lets you verify these controls yourself
                        rather than take them on trust — but self-verification
                        and an independent attestation are different things, and
                        we keep them clearly separate here.
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-14 rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
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
