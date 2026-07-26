import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import { RVU_RECOVERY_CASE } from '../../data/customerCaseStudies'

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

function ValidationFact({ term, children }) {
    return (
        <div className="border-t border-hairline py-4 first:border-t-0 md:grid md:grid-cols-[minmax(0,13rem)_1fr] md:gap-6">
            <dt className="text-sm font-semibold text-ink">{term}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-2 md:mt-0">
                {children}
            </dd>
        </div>
    )
}

export default function RvuAuditHeartCareCaseStudy() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>
                    RVU Audit Automation for Dr. Victor Abrich | OpenAdapt
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
                        <p className="eyebrow">Customer case study · Healthcare</p>
                        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                            {customerCase.title}
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-2 md:text-xl">
                            {customerCase.result}
                        </p>
                        <div className="mt-7 rounded-xl border border-hairline bg-panel p-5 text-sm leading-relaxed text-ink-2">
                            <span className="font-semibold text-ink">
                                {customerCase.customer.name}
                            </span>
                            <br />
                            {customerCase.customer.role}
                            <br />
                            {customerCase.customer.organization}
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
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        <div className="mt-14 grid gap-8 rounded-2xl border-2 border-ink bg-panel p-7 md:grid-cols-[1.1fr_0.9fr] md:p-10">
                            <div>
                                <p className="eyebrow">The result</p>
                                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                                    More complete audits without spending physician hours collecting and reconciling data by hand
                                </h2>
                                <blockquote className="mt-6 border-l-2 border-accent pl-5 text-lg leading-relaxed text-ink-2">
                                    “{customerCase.quote}”
                                    <footer className="mt-3 text-sm font-semibold text-ink">
                                        Dr. Victor Abrich, MD
                                    </footer>
                                </blockquote>
                            </div>
                            <div>
                                <p className="eyebrow">Review-ready outputs</p>
                                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
                                    {customerCase.outputs.map((output) => (
                                        <li key={output} className="flex gap-3">
                                            <span aria-hidden="true" className="text-accent">
                                                ✓
                                            </span>
                                            <span>{output}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <section
                            className="mt-14 rounded-2xl border border-hairline bg-panel p-6 md:p-9"
                            aria-labelledby="rvu-validation-title"
                        >
                            <p className="eyebrow">Synthetic product validation</p>
                            <h2
                                id="rvu-validation-title"
                                className="mt-2 max-w-3xl font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                            >
                                {customerCase.validation.title}
                            </h2>
                            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-2">
                                {customerCase.validation.summary}
                            </p>

                            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {customerCase.validation.metrics.map((metric) => (
                                    <div
                                        key={metric.label}
                                        className="rounded-xl border border-hairline bg-ground p-5"
                                    >
                                        <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                                            {metric.value}
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                            {metric.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <dl className="mt-7 rounded-xl border border-hairline bg-ground px-5">
                                {customerCase.validation.facts.map((fact) => (
                                    <ValidationFact key={fact.term} term={fact.term}>
                                        {fact.detail}
                                    </ValidationFact>
                                ))}
                            </dl>
                            <p className="mt-5 text-sm leading-relaxed text-ink-3">
                                {customerCase.validation.note}
                            </p>
                            <p className="mt-3 break-all font-mono text-[11px] leading-relaxed text-ink-3/80">
                                Evidence reference: {customerCase.validation.evidenceReference}
                            </p>
                        </section>

                        <div className="mt-14 text-center">
                            <p className="eyebrow">Bring your workflow</p>
                            <h2 className="mx-auto mt-2 max-w-2xl font-display text-2xl font-semibold tracking-tight text-ink">
                                Qualify the UI-only work your APIs cannot reach
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-2">
                                Show us one repeated workflow, its target application, and the business result that proves it worked.
                            </p>
                            <Link
                                href="/qualify"
                                className="btn-ink mt-6 inline-block"
                            >
                                Qualify one workflow
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
