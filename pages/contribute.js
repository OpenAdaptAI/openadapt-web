import Head from 'next/head'
import Link from 'next/link'

import ContactBookingSection from '@components/ContactBookingSection'
import Footer from '@components/Footer'

// Dedicated page for the contribute-for-credits program.
//
// EARLY ACCESS (gated on legal terms): copy is "request access", never "upload
// now / available today", and never claims any data has been collected. The
// framing is binding (see the data-for-credits framing brief): lead with the
// guarantees, frame it as strengthening the shared hardening corpus, and never
// say "sell/monetize your data" or attach a per-record price. When target-state
// confidence and legal factuality conflict, factuality wins.

const CONTRIBUTE_PREFILL = {
    message:
        'I would like to request access to the OpenAdapt contributor program (contribute sanitized derivatives for run credits).',
}

const GUARANTEES = [
    {
        title: 'Sanitized derivatives only',
        body: 'You contribute a sanitized, de-identified derivative. Raw recordings never leave your machine or tenant.',
    },
    {
        title: 'You approve every byte',
        body: 'Nothing is shared until you review the exact bytes locally and approve them through hash-bound review.',
    },
    {
        title: 'Opt-in and revocable',
        body: 'The program is opt-in and off by default. You can stop contributing going forward at any time.',
    },
    {
        title: 'De-identification standard',
        body: 'Contributions are sanitized to a de-identification standard, and you attest that a contribution meets it.',
    },
]

const STEPS = [
    {
        n: '1',
        title: 'Record and compile locally',
        body: 'You record and compile a workflow the way you already do. The original recording stays on your machine.',
    },
    {
        n: '2',
        title: 'Sanitize a derivative',
        body: 'A derivative is sanitized to a de-identification standard. You review it locally, not us.',
    },
    {
        n: '3',
        title: 'Approve the exact bytes',
        body: 'You approve the sanitized derivative through hash-bound local review. Only that approved copy is eligible to contribute.',
    },
    {
        n: '4',
        title: 'Contribute to the corpus',
        body: 'The approved, sanitized derivative passes manifest and runtime validation at ingest, then strengthens the shared hardening corpus.',
    },
    {
        n: '5',
        title: 'Earn run credits',
        body: 'Your contribution earns run credits that extend your usage allowance. Not cash, and no per-record price.',
    },
]

const FAQ = [
    {
        q: 'Is my raw data ever uploaded?',
        a: 'No. Raw recordings never leave your machine. Only a sanitized, de-identified derivative that you have reviewed and approved is eligible to contribute.',
    },
    {
        q: 'Is this PHI?',
        a: 'No. You contribute de-identified derivatives only, sanitized to a de-identification standard. You attest that a contribution meets that standard and you approve the exact bytes before anything is shared.',
    },
    {
        q: 'Can I stop?',
        a: 'Yes. The program is opt-in, off by default, and revocable going forward.',
    },
    {
        q: 'What is the standard?',
        a: 'Contributions are sanitized to a de-identification standard, your organization attests the contribution meets it, and you approve the exact bytes through hash-bound local review.',
    },
    {
        q: 'What do I get?',
        a: 'Run credits that extend your monthly run cap. Credits are service credits, not cash, and there is no per-record price.',
    },
]

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Contribute data for credits',
    url: 'https://openadapt.ai/contribute',
    description:
        'Early-access contributor program: contribute sanitized, de-identified derivatives to the shared hardening corpus and earn run credits that extend your usage allowance. Raw recordings never leave your machine; you approve every byte; opt-in and revocable.',
    isPartOf: {
        '@type': 'WebSite',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    about: {
        '@type': 'SoftwareApplication',
        name: 'OpenAdapt',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
}

export default function ContributePage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Contribute data for credits | OpenAdapt</title>
                <meta
                    name="description"
                    content="Early access. Contribute sanitized, de-identified derivatives to the shared hardening corpus and earn run credits that extend your usage allowance. Raw recordings never leave your machine; you approve every byte; opt-in and revocable."
                />
                <link rel="canonical" href="https://openadapt.ai/contribute" />
                <meta
                    property="og:title"
                    content="Contribute data for credits | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="Early access. Contribute sanitized, de-identified derivatives to the shared hardening corpus and earn run credits. Raw recordings never leave your machine; you approve every byte; opt-in and revocable."
                />
                <meta
                    property="og:url"
                    content="https://openadapt.ai/contribute"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webPageSchema),
                    }}
                />
            </Head>

            {/* Hero: what it is, and the status */}
            <div className="mx-auto max-w-4xl px-4 py-14 md:py-16">
                <div className="flex flex-wrap items-center gap-3">
                    <p className="eyebrow">Contributor program</p>
                    <span className="rounded-full border border-hairline bg-panel px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-2">
                        Early access
                    </span>
                </div>
                <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Contribute data for credits
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-2 md:text-lg">
                    Every sanitized contribution strengthens the shared
                    hardening corpus, the commons that lowers everyone&apos;s
                    silent-wrong-effect rate. In return, you earn run credits
                    that extend your usage allowance. This program is in early
                    access while the terms are finalized, so you register
                    interest and we grant access; there is no upload flow today.
                </p>
                <p className="mt-4 text-sm font-medium text-ink">
                    Early access. Opt-in. Sanitized derivatives only.
                </p>
                <div className="mt-7">
                    <Link href="#request-access" className="btn-ink">
                        Request access
                    </Link>
                </div>
            </div>

            {/* Guarantees */}
            <div className="mx-auto max-w-4xl px-4 pb-14">
                <div className="border-t-2 border-ink pt-10">
                    <p className="eyebrow">The guarantees</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Built to protect the contributor first
                    </h2>
                    <ul className="mt-8 grid gap-4 md:grid-cols-2">
                        {GUARANTEES.map((g) => (
                            <li
                                key={g.title}
                                className="rounded-xl border border-hairline bg-panel p-5"
                            >
                                <strong className="block font-display text-base font-semibold text-ink">
                                    {g.title}
                                </strong>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {g.body}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* How it works */}
            <div className="mx-auto max-w-4xl px-4 pb-14">
                <div className="border-t-2 border-ink pt-10">
                    <p className="eyebrow">How it works</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        The same sanitize, approve, ingest path you already use
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        A contribution references an already-approved sanitized
                        derivative: the exact bytes that already passed local
                        review and hash-bound approval. There is no separate
                        upload of raw data, ever.
                    </p>
                    <ol className="mt-8 space-y-4">
                        {STEPS.map((s) => (
                            <li
                                key={s.n}
                                className="flex gap-4 rounded-xl border border-hairline bg-panel p-5"
                            >
                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-hairline bg-ground font-mono text-sm text-accent">
                                    {s.n}
                                </span>
                                <div>
                                    <strong className="block font-display text-base font-semibold text-ink">
                                        {s.title}
                                    </strong>
                                    <p className="mt-1 text-sm leading-relaxed text-ink-2">
                                        {s.body}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* What you get */}
            <div className="mx-auto max-w-4xl px-4 pb-14">
                <div className="border-t-2 border-ink pt-10">
                    <p className="eyebrow">What you get</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Run credits that extend your usage allowance
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Contributions earn run credits that extend your monthly
                        run cap, the same cap shown on the{' '}
                        <Link
                            href="/#pricing"
                            className="text-accent underline"
                        >
                            pricing page
                        </Link>
                        . Credits are service credits that fund usage. They are
                        not cash, there is no per-record price, and OpenAdapt
                        does not buy your data.
                    </p>
                </div>
            </div>

            {/* FAQ */}
            <div className="mx-auto max-w-4xl px-4 pb-14">
                <div className="border-t-2 border-ink pt-10">
                    <p className="eyebrow">FAQ</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                        Straight answers
                    </h2>
                    <dl className="mt-8 space-y-6">
                        {FAQ.map((item) => (
                            <div key={item.q}>
                                <dt className="font-display text-base font-semibold text-ink">
                                    {item.q}
                                </dt>
                                <dd className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-2">
                                    {item.a}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            {/* Request access CTA: reuses the existing contact intake form */}
            <div id="request-access" className="scroll-mt-20 pb-4">
                <div className="mx-auto max-w-4xl px-4 pt-10">
                    <div className="border-t-2 border-ink pt-10">
                        <p className="eyebrow">Request access</p>
                        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                            Register interest in the contributor program
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                            Tell us a little about your workflows and we will
                            reach out as early access opens. Registering does
                            not enable any upload or share any data.
                        </p>
                    </div>
                </div>
                <ContactBookingSection
                    sectionId="contributor-intake"
                    showHomeLink
                    prefill={CONTRIBUTE_PREFILL}
                />
            </div>

            <Footer />
        </div>
    )
}
