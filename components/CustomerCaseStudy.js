import Link from 'next/link'

import { ABRICH_RVU_AUDIT_CASE } from '../data/customerCaseStudies'

export default function CustomerCaseStudy() {
    const customerCase = ABRICH_RVU_AUDIT_CASE

    return (
        <section
            className="border-b border-hairline bg-ground px-5 py-16 md:py-24"
            data-testid="customer-case-study"
        >
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-8 rounded-2xl border border-hairline bg-panel p-6 shadow-[0_12px_40px_rgba(35,40,31,0.06)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
                    <div>
                        <p className="eyebrow">Customer result</p>
                        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                            {customerCase.title}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-ink-2">
                            {customerCase.summary}
                        </p>
                        <p className="mt-5 text-sm leading-relaxed text-ink-3">
                            <span className="font-semibold text-ink">
                                {customerCase.customer.name}
                            </span>
                            <br />
                            {customerCase.customer.role}
                            <br />
                            {customerCase.customer.organization}
                        </p>
                        <Link
                            href={`/customers/${customerCase.slug}`}
                            className="btn-ink mt-7 inline-block"
                        >
                            Read the case study
                        </Link>
                    </div>

                    <div className="grid content-start gap-3 sm:grid-cols-3 md:grid-cols-1">
                        {customerCase.results.map((result) => (
                            <div
                                key={result.label}
                                className="rounded-xl border border-hairline bg-ground p-5"
                            >
                                <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                                    {result.value}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                                    {result.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
