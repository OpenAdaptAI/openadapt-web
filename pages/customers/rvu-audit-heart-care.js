import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import {
    RVU_RECOVERY_CASE,
    RVU_RECOVERY_FOOTNOTE,
} from '../../data/customerCaseStudies'

const customerCase = RVU_RECOVERY_CASE
const canonical = `https://openadapt.ai/customers/${customerCase.slug}`

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: customerCase.title,
    description: customerCase.result,
    url: canonical,
    about: {
        '@type': 'SoftwareApplication',
        name: 'OpenAdapt',
        url: 'https://openadapt.ai',
    },
    publisher: {
        '@type': 'Organization',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
}

function MethodField({ term, children }) {
    return (
        <div className="border-t border-hairline py-4 first:border-t-0 md:grid md:grid-cols-[minmax(0,15rem)_1fr] md:gap-6">
            <dt className="text-sm font-semibold text-ink">{term}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-2 md:mt-0">
                {children}
            </dd>
        </div>
    )
}

export default function RvuAuditHeartCareCaseStudy() {
    const m = customerCase.methodology

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>
                    RVU Audit Automation for a Cardiology Practice | OpenAdapt
                </title>
                <meta name="description" content={customerCase.result} />
                <link rel="canonical" href={canonical} />
                <meta
                    property="og:title"
                    content={`${customerCase.title} | OpenAdapt`}
                />
                <meta
                    property="og:description"
                    content={customerCase.result}
                />
                <meta property="og:url" content={canonical} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(articleSchema),
                    }}
                />
            </Head>

            <main>
                <section className="border-b border-hairline px-5 py-16 md:py-24">
                    <div className="mx-auto max-w-4xl">
                        <p className="eyebrow">
                            Customer case study · Healthcare
                        </p>
                        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                            {customerCase.title}
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-2 md:text-xl">
                            {customerCase.result}
                        </p>
                        <div className="mt-7 rounded-xl border border-hairline bg-panel p-5 text-sm leading-relaxed text-ink-2">
                            <span className="font-semibold text-ink">
                                {customerCase.customer.descriptor}
                            </span>
                            <br />
                            {customerCase.customer.role}
                            <br />
                            {customerCase.customer.engagement}
                        </div>
                    </div>
                </section>

                <section className="border-b border-hairline bg-panel px-5 py-14 md:py-20">
                    <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
                        {customerCase.results.map((result) => (
                            <div
                                key={result.label}
                                className="rounded-xl border border-hairline bg-ground p-6"
                            >
                                <p className="font-display text-3xl font-semibold tracking-tight text-ink">
                                    {result.value}
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {result.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-5 py-16 md:py-24">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid gap-10 md:grid-cols-2">
                            <div>
                                <p className="eyebrow">The challenge</p>
                                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                                    High-value work hidden inside a manual audit
                                </h2>
                                <p className="mt-4 text-base leading-relaxed text-ink-2">
                                    {customerCase.challenge}
                                </p>
                                <p className="mt-4 text-base leading-relaxed text-ink-2">
                                    The job required collecting evidence from
                                    the existing EMR, comparing it with monthly
                                    RVU spreadsheets, and preparing the findings
                                    for review and recovery.
                                </p>
                            </div>

                            <div>
                                <p className="eyebrow">The workflow</p>
                                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                                    Let automation handle the repetition
                                </h2>
                                <ol className="mt-4 space-y-3">
                                    {customerCase.workflow.map((step, index) => (
                                        <li
                                            key={step}
                                            className="flex gap-3 text-base leading-relaxed text-ink-2"
                                        >
                                            <span className="font-mono text-sm font-semibold text-accent">
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0'
                                                )}
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        <div className="mt-14 rounded-2xl border-2 border-ink bg-panel p-7 md:p-10">
                            <p className="eyebrow">The result</p>
                            <h2 className="mt-2 max-w-3xl font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                                More complete audits without spending physician
                                hours collecting and reconciling the data by hand
                            </h2>
                            <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-2 md:text-lg">
                                {customerCase.result}
                            </p>
                        </div>

                        {/* Section 19 methodology: how the result was measured */}
                        <div className="mt-14">
                            <p className="eyebrow">Methodology</p>
                            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                                How the result was measured
                            </h2>
                            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                                A fixed methodology, so the result reads as
                                evidence rather than a headline: what was
                                measured, over what period, how recovery is
                                defined, how it was attributed, and the full
                                governed-run counts.
                            </p>
                            <dl className="mt-6 rounded-2xl border border-hairline bg-panel p-5 md:p-7">
                                <MethodField term="Study and observation period">
                                    {m.observationWindow}
                                </MethodField>
                                <MethodField term="Records reviewed">
                                    {m.recordsReviewed}
                                </MethodField>
                                <MethodField term="Baseline methodology">
                                    {m.baseline}
                                </MethodField>
                                <MethodField term="Definition of “recovered”">
                                    {m.recoveredDefinition}
                                </MethodField>
                                <MethodField term="Attribution method">
                                    {m.attribution}
                                </MethodField>
                                <MethodField term="Manual effort, before and after">
                                    {m.manualEffort}
                                </MethodField>
                                <MethodField term="Application and surface">
                                    {m.applicationSurface}
                                </MethodField>
                                <MethodField term="Deployment mode">
                                    {m.deploymentMode}
                                </MethodField>
                                <MethodField term="OpenAdapt and pack versions">
                                    {m.versions}
                                </MethodField>
                                <MethodField term="Identity and effect contract">
                                    {m.identityEffectContract}
                                </MethodField>
                                <MethodField term="Verifier implementation">
                                    {m.verifier}
                                </MethodField>
                            </dl>
                        </div>

                        {/* Governed-run counts */}
                        <div className="mt-14">
                            <p className="eyebrow">Governed-run counts</p>
                            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                                Every run, accounted for
                            </h2>
                            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                                Monthly steady-state counts. Verified, halted,
                                and failed runs reconcile to the total. Verified
                                rate {customerCase.verifiedRate}, at{' '}
                                {customerCase.perRunCost} per record. The number
                                that matters most for a clinical write is the
                                last one.
                            </p>
                            <div className="mt-6 rounded-2xl border border-hairline bg-panel p-5 md:p-7">
                                {customerCase.counts.map((row) => (
                                    <div
                                        key={row.label}
                                        className="flex items-baseline justify-between gap-4 border-t border-hairline py-3 first:border-t-0"
                                    >
                                        <span className="text-sm text-ink-2">
                                            {row.label}
                                        </span>
                                        <span
                                            className={`font-display text-lg font-semibold tabular-nums ${
                                                row.tone === 'zero'
                                                    ? 'text-accent'
                                                    : row.tone === 'muted'
                                                      ? 'text-ink-3'
                                                      : 'text-ink'
                                            }`}
                                        >
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3 md:text-base">
                                A halt is a designed outcome, not a failure: it
                                means the verifier could not confirm the effect,
                                so a human reviews it instead of a wrong value
                                silently reaching the record.
                            </p>
                        </div>

                        {/* Affiliation vs institutional endorsement */}
                        <div className="mt-14 rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                            <p className="eyebrow">Scope of this evidence</p>
                            <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                                A partner engagement, not an institutional
                                endorsement
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-ink-2 md:text-base">
                                {customerCase.endorsementNote} The customer is
                                kept anonymized by request and by policy.
                            </p>
                        </div>

                        <div className="mt-14 text-center">
                            <p className="eyebrow">Bring your workflow</p>
                            <h2 className="mx-auto mt-2 max-w-2xl font-display text-2xl font-semibold tracking-tight text-ink">
                                Qualify the UI-only work your APIs cannot reach
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-2">
                                Show us one repeated workflow, its target
                                application, and the business result that proves
                                it worked.
                            </p>
                            <Link
                                href="/qualify"
                                className="btn-ink mt-6 inline-block"
                            >
                                Qualify one workflow
                            </Link>
                        </div>

                        {/* Subtle preliminary-figures footnote */}
                        <p className="mt-12 text-[11px] leading-relaxed text-ink-3/70">
                            &dagger; {RVU_RECOVERY_FOOTNOTE}
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
