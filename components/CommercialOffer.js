import Link from 'next/link'

const {
    LAUNCH_MONTHLY_RUN_CAP,
    LAUNCH_PRICE_CADENCE,
    LAUNCH_PRICE_DISPLAY,
    monthlyRunCapLabel,
} = require('../lib/hostedOfferContract')

export default function CommercialOffer({ hostedOffer }) {
    const runCap = monthlyRunCapLabel(
        hostedOffer?.monthlyRunCap || LAUNCH_MONTHLY_RUN_CAP
    )

    return (
        <section id="commercial-offer" className="border-b border-hairline bg-ground px-5 py-20 md:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="eyebrow text-center">Commercial offer</p>
                <h2 className="mx-auto mt-2 max-w-3xl text-center font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Qualify the workflow before scaling the deployment
                </h2>
                <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-hairline bg-panel p-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
                    <div>
                        <p className="eyebrow">OpenAdapt Community</p>
                        <p className="mt-2 text-sm leading-relaxed text-ink-2">
                            Free and MIT licensed. Record, compile, qualify, and
                            run locally with no account or Cloud service.
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4 text-sm">
                        <a
                            href="https://docs.openadapt.ai/get-started/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost-ink inline-block"
                        >
                            Start locally
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/OpenAdapt"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View source
                        </a>
                    </div>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-[1.25fr_0.75fr]">
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
                            {hostedOffer?.amount || LAUNCH_PRICE_DISPLAY}
                            <span className="ml-1 text-sm font-normal text-ink-3">
                                {hostedOffer?.cadence || LAUNCH_PRICE_CADENCE}
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
