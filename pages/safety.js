import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import SafetyGallery from '@components/SafetyGallery'
import { CASES, HEADLINE, LIMITS, LINKS } from 'data/safetyCases'

const dangerCases = CASES.filter((c) => c.kind === 'danger')
const controlCases = CASES.filter((c) => c.kind !== 'danger')

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'The wrong-patient defense, shown',
    url: 'https://openadapt.ai/safety',
    description:
        'Bounded test evidence for an OpenAdapt identity check: how configured steps halt on specific look-alike record-number cases, plus the limits this evidence does not cover.',
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

export default function SafetyPage() {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>
                    The wrong-patient defense, shown | OpenAdapt safety
                </title>
                <meta
                    name="description"
                    content="Bounded test evidence for an OpenAdapt identity check: specific look-alike record-number cases, observed refusal behavior, and the limits this evidence does not cover."
                />
                <link rel="canonical" href="https://openadapt.ai/safety" />
                <meta
                    property="og:title"
                    content="The wrong-patient defense, shown | OpenAdapt"
                />
                <meta
                    property="og:description"
                    content="Specific identity-check test cases, observed refusal behavior, and the limits this evidence does not cover."
                />
                <meta property="og:url" content="https://openadapt.ai/safety" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webPageSchema),
                    }}
                />
            </Head>

            {/* Hero: the stakes, in plain words */}
            <div className="mx-auto max-w-4xl px-4 py-14">
                <p className="eyebrow">Safety · the wrong-patient defense</p>
                <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    A consequential write needs verified identity, not just a
                    successful click.
                </h1>
                <p className="mt-5 max-w-3xl text-base text-ink-2 md:text-lg">
                    A workflow can appear successful while acting on the wrong
                    record. OpenAdapt can require identity evidence before a
                    configured step and halt when that evidence is ambiguous.
                    This page shows the bounded test cases behind that behavior.
                </p>
                <p className="mt-4 max-w-3xl text-base text-ink-2 md:text-lg">
                    Screen text can contain look-alike characters that OCR cannot
                    reliably distinguish, such as a letter O and a zero. The test
                    asks whether the identity check refuses those ambiguous cases
                    rather than treating them as a verified match.
                </p>
                <p className="mt-4 max-w-3xl text-base text-ink-2 md:text-lg">
                    The boundary matters: these results cover the tested identity
                    check and rendered cases. They do not establish end-to-end or
                    production EMR reliability.
                </p>
            </div>

            {/* Headline result banner */}
            <div className="mx-auto max-w-4xl px-4">
                <div className="rounded-2xl border-2 border-ink bg-panel p-6 md:p-7">
                    <p
                        className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl"
                        style={{ letterSpacing: '-0.01em' }}
                    >
                        {HEADLINE.dangerSafe} of {HEADLINE.dangerTotal}{' '}
                        look-alike cases refused ·{' '}
                        {HEADLINE.controlsCorrect} of {HEADLINE.controlsTotal}{' '}
                        clean cases handled correctly.
                    </p>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Every image below is a real screen render. Every OCR
                        string is what the repo&#39;s own OCR actually read.
                        Every verdict is the shipping identity check
                        (<code className="font-mono text-[0.92em]">
                            verify_target_identity
                        </code>
                        ) judging the recorded target against the live row. No
                        model, no network, nothing hand-drawn:{' '}
                        <strong className="text-ink">zero model calls</strong>.
                    </p>
                    <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <a
                            href={LINKS.gallery}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            How this evidence is generated →
                        </a>
                        <a
                            href={LINKS.openemrRun}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            See a full run on a real EMR →
                        </a>
                    </p>
                </div>
            </div>

            {/* The look-alike traps */}
            <div className="mx-auto max-w-4xl px-4 py-14">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                    Five look-alike traps
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    In each pair below, the recorded target and the live row on
                    screen are two <em>different</em> patients. Read what OCR
                    made of each row: for the first four, it is byte-for-byte
                    identical. The check must never verify these.
                </p>
                <div className="mt-8">
                    <SafetyGallery cases={dangerCases} />
                </div>
            </div>

            {/* The controls */}
            <div className="mx-auto max-w-4xl px-4 pb-14">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                    Two controls, so halting isn&#39;t a trick
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                    A check that refused everything would look safe and be
                    useless. These two prove it isn&#39;t doing that: the
                    correct patient with a clean record number verifies and
                    proceeds, and a plainly different patient is caught.
                </p>
                <div className="mt-8">
                    <SafetyGallery cases={controlCases} />
                </div>
            </div>

            {/* Honest limits */}
            <div className="mx-auto max-w-4xl px-4 pb-16">
                <div className="border-t-2 border-ink pt-10">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                        What this does <em>not</em> protect against
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-2 md:text-base">
                        This defense turns a wrong-patient click into a halt. It
                        does not make the rest of the run omniscient. These are
                        open problems, disclosed on purpose, straight from the
                        project&#39;s own{' '}
                        <a
                            href={LINKS.limits}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            limits doc
                        </a>{' '}
                        and{' '}
                        <a
                            href={LINKS.faultModel}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            fault-model study
                        </a>
                        .
                    </p>
                    <ul className="mt-6 space-y-4">
                        {LIMITS.map((l) => (
                            <li
                                key={l.title}
                                className="rounded-xl border border-hairline bg-panel p-5"
                                style={{
                                    borderLeft: '4px solid var(--inset-warn)',
                                }}
                            >
                                <strong className="block font-display text-base font-semibold text-ink">
                                    {l.title}
                                </strong>
                                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                                    {l.body}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 text-sm text-ink-3">
                        We publish how we test this and where it still falls
                        short:{' '}
                        <a
                            href={LINKS.validation}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            how we test it
                        </a>
                        {' · '}
                        <a
                            href={LINKS.identityRoc}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            the identity check&#39;s ROC
                        </a>
                        .
                    </p>
                </div>
            </div>

            {/* CTA */}
            <div className="mx-auto max-w-4xl px-4 pb-16">
                <div className="rounded-2xl border-2 border-ink bg-panel p-6 text-center md:p-8">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                        Bring the workflow you&#39;re most afraid to automate
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                        If the risk of a wrong-patient write is what&#39;s kept
                        you from automating intake or EMR entry, that&#39;s
                        exactly the conversation we want. Fifteen minutes, one
                        workflow.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Link href="/#book" className="btn-ink">
                            Book a demo
                        </Link>
                        <Link
                            href="/solutions/healthcare"
                            className="btn-ghost-ink"
                        >
                            OpenAdapt for healthcare
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
