import Head from 'next/head'

import Footer from '@components/Footer'
import WorkflowQualificationForm from '@components/WorkflowQualificationForm'

export default function QualifyPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Qualify a Workflow | OpenAdapt</title>
                <meta
                    name="description"
                    content="Bring one repeated, consequential workflow. OpenAdapt will assess its UI-only last mile, verification path, deployment boundary, and qualification fit."
                />
                <link rel="canonical" href="https://openadapt.ai/qualify" />
                <meta property="og:title" content="Qualify a Workflow | OpenAdapt" />
                <meta
                    property="og:description"
                    content="Assess one exact workflow for governed execution across browser, desktop, RDP, or Citrix."
                />
                <meta property="og:url" content="https://openadapt.ai/qualify" />
            </Head>
            <section className="border-b border-hairline bg-ground px-5 py-16 md:py-24">
                <div className="mx-auto max-w-3xl">
                    <p className="eyebrow">Workflow qualification</p>
                    <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                        Bring one workflow. Leave with a go/no-go answer.
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg">
                        We qualify the exact application, environment, identities,
                        effects, failure cases, and deployment boundary—not a generic
                        automation strategy.
                    </p>
                    <div className="mt-8 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                        <WorkflowQualificationForm />
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

