import Link from 'next/link'

const { monthlyRunCapLabel } = require('../lib/hostedOfferContract')

export default function CommercialOffer({ hostedOffer }) {
    const runCap = monthlyRunCapLabel(hostedOffer?.monthlyRunCap)

    return (
        <section id="commercial-offer" className="border-b border-hairline bg-ground px-5 py-20 md:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Commercial offer</p>
                <h2 className="mx-auto mt-2 max-w-3xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Qualify the workflow before scaling the deployment
                </h2>
                <div className="mt-9 grid gap-6 md:grid-cols-[1.25fr_0.75fr]">
                    <article className="rounded-2xl border-2 border-ink bg-panel p-6 md:p-8">
                        <p className="eyebrow">Workflow Qualification Sprint</p>
                        <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
                            From $15,000
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            In a ten-business-day target, we assess one named
                            workflow, application, environment, identity contract,
                            effect verifier, failure boundary, deployment path,
                            and ROI. You receive a qualified prototype and a signed
                            go/no-go report.
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-ink-3">
                            Complex native, RDP, and Citrix scopes are typically
                            $25,000–$40,000.
                        </p>
                        <Link href="/qualify" className="btn-ink mt-6 inline-block">
                            Qualify one workflow
                        </Link>
                    </article>
                    <article id="cloud-preview" className="rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                        <p className="eyebrow">OpenAdapt Cloud</p>
                        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                            {hostedOffer?.amount || 'Managed subscription'}
                            <span className="ml-1 text-sm font-normal text-ink-3">
                                {hostedOffer?.cadence || '/month'}
                            </span>
                        </h3>
                        {runCap && (
                            <p className="mt-2 text-sm font-semibold text-ink">{runCap}</p>
                        )}
                        <p className="mt-3 text-sm leading-relaxed text-ink-2">
                            A separate managed subscription for approved workflows,
                            run history, evidence, and governed updates. Enterprise
                            qualification, regulated deployment, and SLAs are scoped
                            separately.
                        </p>
                        <Link href="/pricing#cloud-preview" className="btn-ghost-ink mt-6 inline-block">
                            See Cloud and enterprise pricing
                        </Link>
                    </article>
                </div>
            </div>
        </section>
    )
}
