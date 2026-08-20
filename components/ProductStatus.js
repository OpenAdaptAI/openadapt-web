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
        detail: 'Use DOM, accessibility, visual, and interaction evidence to run approved web workflows.',
    },
    {
        title: 'Native desktop',
        detail: 'Operate Windows, macOS, and Linux applications through native accessibility plus retained visual evidence.',
    },
    {
        title: 'Remote applications',
        detail: 'Operate RDP, Citrix Workspace, and VDI through pixels, keyboard, and mouse, with the same identity and result checks.',
    },
]

export default function ProductStatus() {
    return (
        <section
            id="product-status"
            className="border-b border-hairline bg-panel px-5 py-20 md:py-28"
        >
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Browser, desktop, and remote</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Use one verified workflow across the interfaces you use
                </h2>
                <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    OpenAdapt keeps the workflow and its safety checks separate
                    from the controls used in each application. Each surface
                    uses the strongest evidence it provides.
                </p>
                <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-ink-2 md:text-base">
                    Browser runs in production today; desktop, RDP, and Citrix
                    run through customer-controlled qualification. Each surface
                    carries its own measured acceptance evidence, published per
                    surface in the{' '}
                    <a
                        href="https://docs.openadapt.ai/get-started/what-works-today/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline"
                    >
                        qualification evidence
                    </a>
                    .
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
