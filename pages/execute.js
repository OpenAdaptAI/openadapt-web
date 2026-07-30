import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'

const description =
    'OpenAdapt Execute gives software and service providers verified execution in the systems their products cannot integrate with.'

const STEPS = [
    {
        number: '01',
        title: 'Qualify one transaction',
        body: 'We bind the intended inputs, identity checks, effect proof, target environment, and exception path to one workflow version.',
    },
    {
        number: '02',
        title: 'Send an authorized request',
        body: 'Your product sends a structured transaction to the private partner API. OpenAdapt dispatches it to the approved customer-controlled runner.',
    },
    {
        number: '03',
        title: 'Receive a durable result',
        body: 'The execution returns a verified receipt when the required proof passes, or a typed exception when an authorized person or reconciliation is needed.',
    },
]

const OUTCOMES = [
    {
        label: 'verified',
        body: 'The runner completed the authorized work and proved the configured business effect.',
    },
    {
        label: 'reconciliation_required',
        body: 'The action may have reached the target, but the proof is incomplete. OpenAdapt does not repeat a consequential write blindly.',
    },
    {
        label: 'halted_before_effect',
        body: 'The runner refused before a business effect when identity, target, authorization, or policy evidence did not match.',
    },
    {
        label: 'rejected_policy',
        body: 'The authorization or policy contract rejected the request before execution could proceed.',
    },
    {
        label: 'failed_platform',
        body: 'The execution platform failed before it could establish a verified business result.',
    },
]

export default function ExecutePage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>OpenAdapt Execute | Verified execution for your product</title>
                <meta name="description" content={description} />
                <link rel="canonical" href="https://openadapt.ai/execute" />
                <meta property="og:title" content="OpenAdapt Execute" />
                <meta property="og:description" content={description} />
                <meta property="og:url" content="https://openadapt.ai/execute" />
            </Head>

            <main>
                <section className="border-b border-hairline px-5 py-16 md:py-24">
                    <div className="mx-auto max-w-5xl">
                        <p className="eyebrow">OpenAdapt Execute</p>
                        <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
                            Verified execution for the systems your product cannot integrate with.
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-2 md:text-xl">
                            Your product already knows the transaction. OpenAdapt completes it through the customer&apos;s browser, desktop, RDP, or Citrix session, then returns a verified receipt or a typed exception.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link href="/qualify" className="btn-ink text-center">
                                Qualify one transaction
                            </Link>
                            <Link href="/partners#apply" className="btn-ghost-ink text-center">
                                Discuss an OEM integration
                            </Link>
                        </div>
                        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-3">
                            OpenAdapt Execute is a private partner API and an OEM integration. We provision it with a qualified workflow and a commercial agreement.
                        </p>
                    </div>
                </section>

                <section className="border-b border-hairline bg-panel px-5 py-16 md:py-20">
                    <div className="mx-auto max-w-5xl">
                        <p className="eyebrow">The execution boundary</p>
                        <div className="mt-3 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
                            <div>
                                <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
                                    Keep business logic in your product. Put the last mile under a governed contract.
                                </h2>
                                <p className="mt-4 text-base leading-relaxed text-ink-2">
                                    Vertical software, service providers, and operations teams often prepare the right structured data but cannot write it into each customer system. OpenAdapt carries the authorized transaction across that final boundary without turning your product into a general-purpose computer agent.
                                </p>
                            </div>
                            <dl className="space-y-4 rounded-2xl border border-hairline bg-ground p-6 text-sm leading-relaxed">
                                <div>
                                    <dt className="font-semibold text-ink">Your product</dt>
                                    <dd className="mt-1 text-ink-2">Chooses the transaction and supplies authorized, structured input.</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-ink">Customer-controlled runner</dt>
                                    <dd className="mt-1 text-ink-2">Observes and acts inside the approved browser, desktop, remote session, or private network boundary.</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-ink">OpenAdapt</dt>
                                    <dd className="mt-1 text-ink-2">Binds the workflow, authorization, identity, effect proof, evidence, and exception path.</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>

                <section className="border-b border-hairline px-5 py-16 md:py-20">
                    <div className="mx-auto max-w-5xl">
                        <p className="eyebrow">From request to receipt</p>
                        <div className="mt-7 grid gap-5 md:grid-cols-3">
                            {STEPS.map((step) => (
                                <article key={step.number} className="rounded-2xl border border-hairline bg-panel p-6">
                                    <p className="font-mono text-xs font-medium tracking-[0.14em] text-accent">{step.number}</p>
                                    <h2 className="mt-5 font-display text-xl font-semibold text-ink">{step.title}</h2>
                                    <p className="mt-3 text-sm leading-relaxed text-ink-2">{step.body}</p>
                                </article>
                            ))}
                        </div>
                        <pre className="mt-8 overflow-x-auto rounded-2xl border border-hairline bg-ink p-5 text-sm leading-relaxed text-ground"><code>{`POST /v1/executions\n→ 202 { schema_version: "openadapt.execute-accepted/v1",\n        execution_id, state: "queued" }\n\nwebhook → { schema_version: "openadapt.execute-webhook/v1",\n            event_type: "execution.terminal", receipt: { outcome: "verified" } }`}</code></pre>
                        <p className="mt-3 text-sm leading-relaxed text-ink-3">
                            Execution is asynchronous. A run can wait for an authorized decision, survive a restart, or require reconciliation without losing its transaction identity.
                        </p>
                    </div>
                </section>

                <section className="border-b border-hairline bg-panel px-5 py-16 md:py-20">
                    <div className="mx-auto max-w-5xl">
                        <p className="eyebrow">Clear outcomes</p>
                        <h2 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink">
                            A receipt names what the runner proved and what needs attention.
                        </h2>
                        <div className="mt-7 grid gap-4 md:grid-cols-2">
                            {OUTCOMES.map((outcome) => (
                                <article key={outcome.label} className="rounded-2xl border border-hairline bg-ground p-5">
                                    <h3 className="font-mono text-xs font-semibold tracking-[0.12em] text-accent">{outcome.label}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-ink-2">{outcome.body}</p>
                                </article>
                            ))}
                        </div>
                        <aside className="mt-5 rounded-2xl border border-hairline bg-ground p-5">
                            <p className="font-mono text-xs font-semibold tracking-[0.12em] text-accent">decision_required · lifecycle state</p>
                            <p className="mt-3 text-sm leading-relaxed text-ink-2">
                                This is not a terminal result. The signed decision webhook sends one focused request to an authorized phone or computer. After an answer, the runner rechecks the live application before it acts or issues a terminal receipt.
                            </p>
                        </aside>
                    </div>
                </section>

                <section className="px-5 py-16 md:py-20">
                    <div className="mx-auto max-w-5xl rounded-2xl border border-hairline bg-panel p-7 md:p-10">
                        <p className="eyebrow">Start with one deployment</p>
                        <h2 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink">
                            Bring one transaction, one target environment, and one measurable business effect.
                        </h2>
                        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-2">
                            We qualify the first workflow with your team. That creates the reusable execution contract, customer-runner plan, mobile operator decision path, and evidence needed to scale it through your product.
                        </p>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <Link href="/qualify" className="btn-ink text-center">Qualify one transaction</Link>
                            <Link href="/partners#apply" className="btn-ghost-ink text-center">Talk to partnerships</Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
