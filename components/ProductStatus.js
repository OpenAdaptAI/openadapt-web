import Link from 'next/link'

const FLOW_URL = 'https://github.com/OpenAdaptAI/openadapt-flow'
const LIMITS_URL = `${FLOW_URL}/blob/main/docs/LIMITS.md`
const HOSTED_URL = 'https://docs.openadapt.ai/guides/hosted/'
const WINDOWS_UIA_EVIDENCE_URL = `${FLOW_URL}/blob/defafbae758a75c8e149d9693f2cffe1f2264b8c/benchmark/windows_uia/results.json`
const MACOS_TEXTEDIT_EVIDENCE_URL = `${FLOW_URL}/blob/ca1b522cad215875f7471782283f8f8bb8e6c998/benchmark/macos_native/textedit_counted_3plus1_b1b61a5_20260717.adjudication.json`
const RDP_EVIDENCE_URL = `${FLOW_URL}/blob/6610d24cebba27918b8ea507b2f05a094057ac85/benchmark/rdp/results_82a658a_20260718.sanitized.json`

const workflow = [
    {
        number: '01',
        title: 'Capture the workflow',
        detail: 'Demonstrate a bounded, repeated browser task, including the evidence OpenAdapt needs to identify targets and verify outcomes.',
    },
    {
        number: '02',
        title: 'Compile and policy-check',
        detail: 'Turn the demonstration into an inspectable program with parameters, target evidence, postconditions, and an explicit OpenAdapt certification policy.',
    },
    {
        number: '03',
        title: 'Run through the governed gate',
        detail: 'The fail-closed run gate rechecks the exact bundle and selected policy. Healthy replay makes no model calls and produces structured evidence.',
    },
    {
        number: '04',
        title: 'Resolve change under governance',
        detail: 'Re-resolve from retained evidence, propose a reviewable repair when needed, and stop when configured verification fails.',
    },
]

const boundaries = [
    {
        title: 'Local engine',
        detail: 'Build, inspect, and run browser workflows on your own machine with the MIT-licensed engine.',
        href: FLOW_URL,
        link: 'View the engine',
        external: true,
    },
    {
        title: 'Managed browser execution',
        detail: 'Operate approved browser workflows through the hosted control plane with run history, reports, usage, and governed updates.',
        href: '/#pricing',
        link: 'See hosted options',
    },
    {
        title: 'Customer-controlled deployment',
        detail: 'Keep runtime data inside a qualified customer boundary when the workflow involves regulated data, private systems, or deployment-specific effect checks.',
        href: '/security',
        link: 'Review the security boundary',
    },
]

const substrates = [
    {
        name: 'Browser / Playwright',
        availability: 'Public beta',
        evidence: 'Reference lifecycle accepted',
        scope: 'The reference record, compile, policy-check, replay, refusal, and report lifecycle runs in CI. Each target application still requires workflow qualification.',
    },
    {
        name: 'Windows UIA',
        availability: 'Partner qualification',
        evidence: 'Scoped acceptance passed',
        scope: 'The counted 20260717-candidate-56759c8-v2 in-tree WinForms matrix completed 3/3 trials; an independent SQLite oracle confirmed 3/3 effects; stale-target and ambiguous-target controls each refused 3/3; 0 silent incorrect successes, 0 over-halts, and 0 model calls. The report preserves earlier rejected diagnostic runs; those are not counted acceptance trials. This qualifies that exact workflow and VM snapshot, not arbitrary Windows applications or hosted desktop.',
        evidenceUrl: WINDOWS_UIA_EVIDENCE_URL,
        evidenceLink: 'Review exact Windows evidence',
    },
    {
        name: 'Native macOS',
        availability: 'Partner qualification',
        evidence: 'Scoped TextEdit evidence accepted',
        scope: 'On one macOS 15.7.3 arm64 host, candidate b1b61a5 completed 3/3 exact-byte TextEdit trials and refused a two-window ambiguity without changing either file; 0 silent incorrect successes and 0 over-halts. The immutable batch report remains failed because cleanup warnings counted as failure; its SHA-256-bound adjudication verified actual process and temporary-file cleanup and accepts only the effect and refusal evidence. This is not clean-machine, design-partner, production, or broad macOS evidence.',
        evidenceUrl: MACOS_TEXTEDIT_EVIDENCE_URL,
        evidenceLink: 'Review scoped macOS evidence',
    },
    {
        name: 'RDP',
        availability: 'Partner qualification',
        evidence: 'Scoped RDP evidence accepted',
        scope: 'On one Parallels Windows 11 VM at 1280×800 with Aardwolf 0.2.14, candidate 82a658a completed 3/3 trials that created a unique file through the Windows Run dialog over network RDP. Independent guest-tools readback confirmed the exact file contents. Trial latencies were 51.845s, 10.467s, and 7.477s; there were 0 failures, 0 silent incorrect successes, 0 over-halts, and 0 model calls. Cleanup deleted only the batch-owned snapshot, restored the exact eight-snapshot inventory, left the VM suspended, and returned the current pointer without resume to the unchanged original base. It is not in the hosted browser launch candidate. This qualifies only that task, VM snapshot, transport, and oracle—not arbitrary RDP applications, record-level identity, clean-machine or production support, hosted RDP, or Citrix ICA/HDX.',
        evidenceUrl: RDP_EVIDENCE_URL,
        evidenceLink: 'Review exact RDP evidence',
    },
    {
        name: 'Citrix',
        availability: 'Design partner needed',
        evidence: 'No ICA/HDX evidence',
        scope: 'The generic remote-window safety floor can begin qualification, but Citrix requires the customer’s actual ICA/HDX environment. RDP evidence is not treated as Citrix evidence.',
    },
]

export default function ProductStatus() {
    return (
        <section
            id="product-status"
            className="border-b border-hairline bg-panel px-5 py-14 md:py-16"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">From demonstration to operation</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    One governed workflow, end to end
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt supports repeated browser workflows from recording
                    through compiled replay, verification, repair, and reporting.
                    Choose where execution runs without changing the workflow model.
                </p>

                <ol className="mt-9 grid gap-4 md:grid-cols-2">
                    {workflow.map((item) => (
                        <li
                            key={item.number}
                            className="rounded-2xl border border-hairline bg-ground p-5 md:p-6"
                        >
                            <div className="flex items-start gap-4">
                                <span className="font-mono text-xs font-medium text-accent">
                                    {item.number}
                                </span>
                                <div>
                                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                        {item.detail}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="mt-8 overflow-hidden rounded-2xl border border-hairline bg-ground">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                            <caption className="border-b border-hairline px-5 py-4 text-left">
                                <span className="font-display text-lg font-semibold text-ink">
                                    Execution substrate evidence
                                </span>
                                <span className="mt-1 block text-xs leading-relaxed text-ink-3">
                                    Availability describes access offered; evidence state records
                                    acceptance status. Neither is an SLA, compliance certification,
                                    or support promise for an arbitrary app.
                                </span>
                            </caption>
                            <thead className="bg-panel font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                                <tr>
                                    <th className="border-b border-hairline px-5 py-3 font-medium">
                                        Substrate
                                    </th>
                                    <th className="border-b border-hairline px-5 py-3 font-medium">
                                        Availability
                                    </th>
                                    <th className="border-b border-hairline px-5 py-3 font-medium">
                                        Evidence state
                                    </th>
                                    <th className="border-b border-hairline px-5 py-3 font-medium">
                                        Current scope
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {substrates.map((item) => (
                                    <tr key={item.name} className="align-top">
                                        <th className="border-b border-hairline px-5 py-4 font-display font-semibold text-ink">
                                            {item.name}
                                        </th>
                                        <td className="border-b border-hairline px-5 py-4 font-mono text-xs text-accent">
                                            {item.availability}
                                        </td>
                                        <td className="border-b border-hairline px-5 py-4 font-mono text-xs text-ink-3">
                                            {item.evidence}
                                        </td>
                                        <td className="border-b border-hairline px-5 py-4 leading-relaxed text-ink-2">
                                            {item.scope}
                                            {item.evidenceUrl ? (
                                                <a
                                                    href={item.evidenceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 block text-xs text-accent underline"
                                                >
                                                    {item.evidenceLink}
                                                </a>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border border-hairline bg-ground p-5 md:p-7">
                    <p className="eyebrow">Choose the execution boundary</p>
                    <div className="mt-5 grid gap-6 md:grid-cols-3">
                        {boundaries.map((item) => (
                            <div key={item.title}>
                                <h3 className="font-display font-semibold text-ink">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {item.detail}
                                </p>
                                {item.external ? (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-block text-sm text-accent underline"
                                    >
                                        {item.link}
                                    </a>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="mt-3 inline-block text-sm text-accent underline"
                                    >
                                        {item.link}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-ink-3">
                    Technical teams can review the{' '}
                    <a
                        href={LIMITS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline"
                    >
                        engine limits
                    </a>{' '}
                    and{' '}
                    <a
                        href={HOSTED_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline"
                    >
                        hosted architecture
                    </a>{' '}
                    before qualifying a production workflow.
                </p>
            </div>
        </section>
    )
}
