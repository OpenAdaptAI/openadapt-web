import Link from 'next/link'

const paths = [
    {
        audience: 'Developer',
        title: 'Build and self-host',
        body: 'Install the MIT-licensed engine, record the bundled app, compile it, lint and certify the bundle, then replay it locally. No account or hosted service is required.',
        primary: { label: 'Run the quickstart', href: '#open-source' },
        secondary: {
            label: 'Read the engine source',
            href: 'https://github.com/OpenAdaptAI/openadapt-flow',
            external: true,
        },
    },
    {
        audience: 'Automation & operations',
        title: 'Launch hosted browser workflows',
        body: 'Subscribe, record a browser workflow, inspect the compiled program and reports, then operate deterministic runs from the hosted control plane.',
        primary: { label: 'Start hosted', href: '#pricing' },
        secondary: { label: 'Review the benchmark', href: '/compare' },
    },
    {
        audience: 'Regulated enterprise',
        title: 'Deploy inside a trusted boundary',
        body: 'Define identity coverage, effect verification, artifact sanitization, and the runtime data boundary for a consequential workflow before it enters production.',
        primary: { label: 'Review security posture', href: '/security' },
        secondary: { label: 'Plan a regulated deployment', href: '#book' },
    },
]

function ActionLink({ action, className }) {
    if (action.external) {
        return (
            <a
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
            >
                {action.label}
            </a>
        )
    }

    return (
        <Link href={action.href} className={className}>
            {action.label}
        </Link>
    )
}

export default function AudiencePaths() {
    return (
        <section className="border-b border-hairline bg-panel px-5 py-12 md:py-14">
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Choose your path</p>
                <h2 className="mx-auto mt-2 max-w-2xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    One engine, three launch paths
                </h2>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {paths.map((path) => (
                        <article
                            key={path.audience}
                            className="flex h-full flex-col rounded-2xl border border-hairline bg-ground p-6"
                        >
                            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                                {path.audience}
                            </p>
                            <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                                {path.title}
                            </h3>
                            <p className="mt-3 flex-grow text-sm leading-relaxed text-ink-2">
                                {path.body}
                            </p>
                            <div className="mt-6 flex flex-col items-start gap-2 text-sm">
                                <ActionLink
                                    action={path.primary}
                                    className="font-medium text-accent hover:underline"
                                />
                                <ActionLink
                                    action={path.secondary}
                                    className="text-ink-2 hover:text-accent hover:underline"
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
