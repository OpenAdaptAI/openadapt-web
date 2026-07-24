import Link from 'next/link'

const boundaries = [
    {
        title: 'Managed execution',
        detail: 'Use the OpenAdapt control plane and managed runners for approved browser and non-sensitive workloads.',
        href: '/pricing#cloud-preview',
        link: 'See Cloud pricing',
    },
    {
        title: 'Customer-controlled deployment',
        detail: 'Run sensitive data, native applications, RDP, Citrix, private networks, and restricted-egress workflows inside your boundary. External black-box remote execution does not require software inside the managed session.',
        href: '/security',
        link: 'Review the security boundary',
    },
]

const executionSurfaces = [
    {
        title: 'Browser',
        detail: 'Combine DOM, accessibility, visual, and interaction evidence for governed web execution.',
    },
    {
        title: 'Native desktop',
        detail: 'Operate Windows, macOS, and Linux applications through native accessibility plus retained visual evidence.',
    },
    {
        title: 'Remote applications',
        detail: 'Drive RDP, Citrix Workspace, and VDI externally through pixels, keyboard, and mouse while preserving identity, policy, verification, and audit.',
    },
]

export default function ProductStatus() {
    return (
        <section
            id="product-status"
            className="border-b border-hairline bg-panel px-5 py-20 md:py-28"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Cross-surface execution</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    One governance model across the interfaces you use
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    Portable workflow intent stays separate from each
                    environment-specific binding, so DOM selectors,
                    accessibility elements, and remote visual anchors are never
                    treated as interchangeable.
                </p>

                <div className="mt-8 rounded-2xl border border-hairline bg-ground p-5 md:p-7">
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {executionSurfaces.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl border border-hairline bg-panel p-5"
                            >
                                <h4 className="font-display font-semibold text-ink">
                                    {item.title}
                                </h4>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {item.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border border-hairline bg-ground p-5 md:p-7">
                    <p className="eyebrow">Choose the execution boundary</p>
                    <div className="mt-5 grid gap-6 md:grid-cols-2">
                        {boundaries.map((item) => (
                            <div key={item.title}>
                                <h3 className="font-display font-semibold text-ink">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {item.detail}
                                </p>
                                <Link
                                    href={item.href}
                                    className="mt-3 inline-block text-sm text-accent underline"
                                >
                                    {item.link}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
