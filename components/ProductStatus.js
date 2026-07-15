const FLOW_URL = 'https://github.com/OpenAdaptAI/openadapt-flow'
const LIMITS_URL = `${FLOW_URL}/blob/main/docs/LIMITS.md`
const RDP_URL = `${FLOW_URL}/blob/main/docs/backends/RDP.md`
const CITRIX_URL = `${FLOW_URL}/blob/main/docs/desktop/CITRIX_PIXEL.md`

const capabilities = [
    {
        capability: 'Browser recording and replay',
        status: 'Beta',
        detail: 'Shipped end to end and exercised against a real third-party web app.',
        href: FLOW_URL,
    },
    {
        capability: 'Linting and certification',
        status: 'Available · opt-in',
        detail: 'CLI policies report or refuse configured coverage gaps; an uncertified bundle can still run.',
        href: LIMITS_URL,
    },
    {
        capability: 'Identity verification',
        status: 'Available · partial coverage',
        detail: 'Enforced on armed steps only. Unarmed clicks have no identity check.',
        href: LIMITS_URL,
    },
    {
        capability: 'System-of-record effects',
        status: 'Available · configuration required',
        detail: 'Requires manually declared effects and a deployment-specific verifier; screen checks alone cannot prove a write.',
        href: LIMITS_URL,
    },
    {
        capability: 'Human teaching and resume',
        status: 'Experimental CLI',
        detail: 'Teach, authenticated approval, checkpoint, and resume paths exist; the hosted operator experience is launching on the browser path.',
        href: FLOW_URL,
    },
    {
        capability: 'Windows UIA',
        status: 'Experimental',
        detail: 'Locally demonstrated on a Windows-on-ARM VM, not a validated production integration.',
        href: FLOW_URL,
    },
    {
        capability: 'macOS native workflows',
        status: 'Experimental',
        detail: 'Capture and accessibility building blocks exist; no supported end-to-end native product path is claimed.',
        href: LIMITS_URL,
    },
    {
        capability: 'RDP',
        status: 'Research spike',
        detail: 'Protocol adapter and mocked tests exist; live target and application validation remain pending.',
        href: RDP_URL,
    },
    {
        capability: 'Citrix',
        status: 'Research spike',
        detail: 'Pixel-only remote-display analog, not a validated Citrix integration.',
        href: CITRIX_URL,
    },
    {
        capability: 'Desktop authoring UI',
        status: 'In development',
        detail: 'Not the current self-serve production path; use the CLI/browser workflow for evaluation.',
        href: 'https://github.com/OpenAdaptAI/openadapt-desktop',
    },
    {
        capability: 'Managed hosted execution',
        status: 'Launching · browser',
        detail: 'Configured Stripe checkout, account onboarding, attested bundle ingest, browser runner, structural reports, replacement activation, entitlements, and metering form the launch path. Authoring and repair validation remain local. This status does not include desktop or Citrix execution.',
    },
    {
        capability: 'Artifact sanitization and review',
        status: 'Launch gate',
        detail: 'Upload accepts the approved, sanitized derivative identified by its manifest hash. Unknown or unresolved content is refused. Recordings with changed execution content require local parameterization and bundle validation; runtime observations can still reintroduce PHI and require a declared trusted boundary.',
        href: FLOW_URL,
    },
    {
        capability: 'Cross-engine hosted validation',
        status: 'Launch gate',
        detail: 'Runnable bundle upload requires exact recording/bundle provenance, strict lint, policy certification, derived risk class, successful matching replay, and a one-time challenge. This is operator self-attestation, not independent certification.',
        href: 'https://docs.openadapt.ai/guides/hosted/',
    },
    {
        capability: 'On-prem enterprise deployment',
        status: 'Available by scope',
        detail: 'Customer-controlled deployment is the path for workflows whose runtime necessarily exposes regulated data. Substrate, effect verifier, update, support, and compliance responsibilities are documented per deployment.',
    },
]

export default function ProductStatus() {
    return (
        <section
            id="product-status"
            className="border-b border-hairline bg-panel px-5 py-14 md:py-16"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Product maturity</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    What works today, without reading between the lines
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    Code presence does not imply production readiness. This
                    matrix separates the browser launch path from experimental
                    backends and states the evidence boundary for each control.
                </p>

                <div className="mt-8 overflow-hidden rounded-2xl border border-hairline bg-ground">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                            <thead className="bg-panel font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                                <tr>
                                    <th className="border-b border-hairline px-5 py-3 font-medium">
                                        Capability
                                    </th>
                                    <th className="border-b border-hairline px-5 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="border-b border-hairline px-5 py-3 font-medium">
                                        Evidence boundary
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {capabilities.map((item) => (
                                    <tr key={item.capability} className="align-top">
                                        <th className="border-b border-hairline px-5 py-4 font-display font-semibold text-ink last:border-b-0">
                                            {item.capability}
                                        </th>
                                        <td className="border-b border-hairline px-5 py-4 font-mono text-xs text-accent last:border-b-0">
                                            {item.status}
                                        </td>
                                        <td className="border-b border-hairline px-5 py-4 leading-relaxed text-ink-2 last:border-b-0">
                                            {item.detail}{' '}
                                            {item.href && (
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="whitespace-nowrap text-accent underline"
                                                >
                                                    Evidence
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="mt-4 text-center text-xs leading-relaxed text-ink-3">
                    Status reflects public evidence in{' '}
                    <a
                        href={FLOW_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline"
                    >
                        openadapt-flow
                    </a>{' '}
                    and its published limits. It is a product-readiness statement,
                    not a security certification.
                </p>
            </div>
        </section>
    )
}
