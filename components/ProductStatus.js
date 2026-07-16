import Link from 'next/link'

const FLOW_URL = 'https://github.com/OpenAdaptAI/openadapt-flow'
const LIMITS_URL = `${FLOW_URL}/blob/main/docs/LIMITS.md`
const HOSTED_URL = 'https://docs.openadapt.ai/guides/hosted/'

const workflow = [
    {
        number: '01',
        title: 'Capture the workflow',
        detail: 'Record a repeated browser task once, including the evidence OpenAdapt needs to identify targets and verify outcomes.',
    },
    {
        number: '02',
        title: 'Compile and review',
        detail: 'Turn the demonstration into an inspectable program with parameters, target evidence, postconditions, and policy checks.',
    },
    {
        number: '03',
        title: 'Run deterministically',
        detail: 'Replay healthy workflows without model calls. Each run produces structured history, evidence, and a clear result.',
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
