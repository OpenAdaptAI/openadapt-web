import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import PartnerInquiryForm from '@components/PartnerInquiryForm'

// Partner program v1. Status-honest: this is a program you apply to, with
// individually reviewed applications, not a self-serve portal, a partner
// directory, or a certification marketplace. Each track states its commercial
// model and where the responsibility boundary sits for qualification,
// support, and workflow packs, so a prospective partner can self-select
// before applying through the dedicated partner-inquiry intake.

const description =
    'Partner with OpenAdapt: embed or white-label the governed runtime, operate verified workflows for your clients, or deliver and deploy qualified automations. Apply to the partner program.'

const TRACKS = [
    {
        id: 'vertical_oem',
        title: 'Vertical software / OEM',
        who: 'Vertical SaaS and software vendors whose customers still re-key data into EMRs, practice management, loan origination, claims, and other systems of record.',
        model: 'Embed or white-label. Ship governed, verified execution as a feature of your product, under your brand where appropriate, on commercial OEM terms.',
        boundaries: [
            'Qualification: each workflow and target application is qualified jointly before consequential use; OpenAdapt provides the qualification tooling and evidence format.',
            'Support: you own first-line support inside your product; OpenAdapt provides engine-level escalation.',
            'Packs: you own the vertical workflow packs for your market; OpenAdapt owns the runtime and verification contracts underneath them.',
        ],
    },
    {
        id: 'rcm_bpo',
        title: 'RCM and BPO operators',
        who: 'Revenue-cycle, claims, and back-office operations teams that run high-volume repeated work for their own clients.',
        model: 'Managed operations. You operate compiled, verified workflows for your clients on customer-controlled or operator-controlled runtimes, and keep the client relationship.',
        boundaries: [
            'Qualification: each client workflow is qualified against its exact application and environment before production; you provide the environment access, OpenAdapt provides the method and evidence.',
            'Support: you own client-facing operations and first-line support; OpenAdapt supports the runtime and verification behavior.',
            'Packs: workflow definitions built for your clients stay yours; the underlying runtime stays MIT-licensed and inspectable.',
        ],
    },
    {
        id: 'integration_services',
        title: 'Integration and services partners',
        who: 'Automation consultancies and system integrators who scope, build, and hand over workflow automations for clients.',
        model: 'Services delivery. You run discovery, implementation, and rollout engagements on top of the open runtime and the qualification method.',
        boundaries: [
            'Qualification: you run qualification sprints with your clients using the published method; OpenAdapt reviews evidence for consequential go-lives.',
            'Support: you own the engagement and first-line support; OpenAdapt provides second-line engine support.',
            'Packs: you can build and reuse implementation accelerators; runtime and verification contract changes land upstream, not in forks.',
        ],
    },
    {
        id: 'msp_deployment',
        title: 'MSP and deployment partners',
        who: 'Managed service providers who own customer infrastructure, including locked-down, private-network, and virtual desktop estates.',
        model: 'Managed deployment. You deploy and operate the runtime inside customer boundaries, including customer-controlled and self-hosted footprints.',
        boundaries: [
            'Qualification: environment readiness (identity, network, remote client, and update policy) is yours; workflow qualification follows the shared method.',
            'Support: you own environment monitoring and updates rollout; OpenAdapt owns runtime releases and security advisories.',
            'Packs: deployment runbooks and hardening baselines are shared working material within the program.',
        ],
    },
]

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Partner Program | OpenAdapt</title>
                <meta name="description" content={description} />
                <link rel="canonical" href="https://openadapt.ai/partners" />
                <meta
                    property="og:title"
                    content="Partner Program | OpenAdapt"
                />
                <meta property="og:description" content={description} />
                <meta
                    property="og:url"
                    content="https://openadapt.ai/partners"
                />
            </Head>

            <main className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">Partner program</p>
                <h1 className="font-display mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                    Bring verified execution to the customers you already
                    serve.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-2 md:text-lg">
                    OpenAdapt compiles demonstrated GUI workflows into
                    deterministic, governed programs and verifies the business
                    effect out of band. Partners embed it in their products,
                    operate it for their clients, or deliver and deploy it
                    inside customer boundaries. The runtime is MIT-licensed;
                    the partnership adds commercial terms, qualification
                    method, and support boundaries.
                </p>

                <section className="mt-12" aria-labelledby="tracks-heading">
                    <h2
                        id="tracks-heading"
                        className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                    >
                        Four partner tracks
                    </h2>
                    <div className="mt-6 space-y-6">
                        {TRACKS.map((track) => (
                            <article
                                key={track.id}
                                className="rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                            >
                                <h3 className="font-display text-xl font-semibold text-ink">
                                    {track.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {track.who}
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-ink">
                                    <span className="font-semibold">
                                        Model:{' '}
                                    </span>
                                    {track.model}
                                </p>
                                <h4 className="mt-4 font-display text-sm font-semibold uppercase tracking-wide text-ink-3">
                                    Responsibility boundaries
                                </h4>
                                <ul className="mt-2 space-y-2">
                                    {track.boundaries.map((boundary) => (
                                        <li
                                            key={boundary}
                                            className="text-sm leading-relaxed text-ink-2"
                                        >
                                            {boundary}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </section>

                <section
                    className="mt-12 rounded-2xl border border-hairline bg-panel p-6 md:p-8"
                    aria-labelledby="program-status-heading"
                >
                    <p className="eyebrow">Program status</p>
                    <h2
                        id="program-status-heading"
                        className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink"
                    >
                        An application-based program, not a self-serve portal.
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        We review every application individually and start each
                        partnership from one concrete customer workflow, not a
                        logo exchange. There is no self-serve partner portal,
                        directory listing, or certification marketplace today.
                        Commercial terms (OEM, operations, and services) are
                        agreed per partner. Consequential workflows go live
                        only after qualification on the exact application and
                        environment, per the published{' '}
                        <a
                            href="https://docs.openadapt.ai/get-started/what-works-today/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent"
                        >
                            qualification evidence
                        </a>
                        .
                    </p>
                </section>

                <section
                    id="apply"
                    className="mt-12 scroll-mt-8"
                    aria-labelledby="apply-heading"
                >
                    <h2
                        id="apply-heading"
                        className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                    >
                        Apply to the partner program
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Tell us which track fits and what you would build or
                        operate. If a specific end-customer workflow is already
                        in view, the fastest path is to also{' '}
                        <Link href="/qualify" className="text-accent">
                            qualify that workflow
                        </Link>
                        .
                    </p>
                    <div className="mt-6">
                        <PartnerInquiryForm />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
