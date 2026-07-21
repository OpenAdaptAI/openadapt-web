import Head from 'next/head'
import Link from 'next/link'

import CompiledProgramSection from '@components/CompiledProgramSection'
import DriftOutcomes from '@components/DriftOutcomes'
import Footer from '@components/Footer'
import HowItWorksCondensed from '@components/HowItWorksCondensed'
import Reveal from '@components/Reveal'

// Concepts / method page. The homepage keeps one clear narrative arc, so the
// deeper "what a demonstration compiles into" and "what repair means, and where
// it stops" explanations live here, one click from the homepage's condensed
// three-step model. Nothing was deleted in the homepage cleanup: this page is
// where the compiled-program deep dive and the drift-outcome ladder now live.

const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How OpenAdapt compiles and governs a repeated GUI workflow',
    description:
        'Demonstrate a bounded, repeated task once. OpenAdapt compiles the trace into a deterministic, locally executable program, replays it with zero per-run model calls, and resolves, repairs, or halts under interface drift.',
    step: [
        {
            '@type': 'HowToStep',
            name: 'Record and compile',
            text: 'Demonstrate one bounded, repeated task. OpenAdapt compiles the trace into a reviewable, parameterized program.',
        },
        {
            '@type': 'HowToStep',
            name: 'Replay deterministically',
            text: 'Healthy runs execute the compiled steps locally with zero model calls.',
        },
        {
            '@type': 'HowToStep',
            name: 'Resolve, repair, or halt',
            text: 'When the interface drifts, deterministic evidence re-finds the target, an optional model proposes a governed repair, or verification halts and keeps a run report.',
        },
    ],
}

export default function HowItWorksPage() {
    return (
        <div className="bg-ground text-ink">
            <Head>
                <title>How it works | OpenAdapt</title>
                <meta
                    name="description"
                    content="How OpenAdapt turns one recorded demonstration into a deterministic, locally executable program, and how it resolves, repairs, or halts under interface drift."
                />
                <link
                    rel="canonical"
                    href="https://openadapt.ai/how-it-works"
                />
                <meta property="og:title" content="How it works | OpenAdapt" />
                <meta
                    property="og:description"
                    content="From a recorded demonstration to a reviewable program, deterministic replay, and governed repair under drift."
                />
                <meta
                    property="og:url"
                    content="https://openadapt.ai/how-it-works"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(howToSchema),
                    }}
                />
            </Head>

            <header className="border-b border-hairline bg-panel px-5 py-20 md:py-28">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="eyebrow">The method</p>
                    <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                        Compile once, govern every repair
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-2">
                        Record a bounded, repeated task once. OpenAdapt compiles
                        the trace into a deterministic local program, replays it
                        with zero per-run model cost, and resolves, repairs, or
                        halts under interface drift. Here is what each step
                        produces and where the loop deliberately stops.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link className="btn-ink" href="/#book">
                            Evaluate a workflow
                        </Link>
                        <Link className="btn-ghost-ink" href="/research">
                            Read the technical paper
                        </Link>
                    </div>
                </div>
            </header>

            <Reveal>
                <HowItWorksCondensed />
            </Reveal>
            <Reveal>
                <CompiledProgramSection />
            </Reveal>
            <Reveal>
                <DriftOutcomes />
            </Reveal>

            <section className="border-b border-hairline bg-panel px-5 py-20 md:py-28">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="eyebrow">See it running</p>
                    <h2 className="mx-auto mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                        Watch the same loop on a real reference workflow
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-2 md:text-base">
                        Each reference is a bounded, synthetic fixture with its
                        own honest evidence and caveats.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <Link className="btn-ink" href="/#references">
                            See reference workflows
                        </Link>
                        <Link className="btn-ghost-ink" href="/compare">
                            Compare with RPA and agents
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
