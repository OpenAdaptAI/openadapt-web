import Head from 'next/head'
import Link from 'next/link'

import Footer from '@components/Footer'
import { getOpenAdaptRepositoryStats } from '../lib/openAdaptRepositoryStats'

// Canonical location of the technical paper source (LaTeX + figures) until a
// built PDF ships. A concurrent PR may add public/openadapt-paper.pdf or a
// richer /paper route; this placeholder forwards readers to the source and
// links the PDF path defensively so a landed PDF needs no further wiring.
const PAPER_SOURCE_URL =
    'https://github.com/OpenAdaptAI/openadapt-flow/tree/main/paper'
const PAPER_PDF_PATH = '/openadapt-paper.pdf'

const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'OpenAdapt technical paper',
    url: 'https://openadapt.ai/paper',
    description:
        'The OpenAdapt technical paper: how a demonstrated GUI workflow is compiled into a deterministic local program that re-resolves interface drift, verifies effects against an independent oracle, and halts under governance.',
    isPartOf: {
        '@type': 'WebSite',
        name: 'OpenAdapt.AI',
        url: 'https://openadapt.ai',
    },
    inLanguage: 'en',
}

export async function getStaticProps() {
    const githubStats = await getOpenAdaptRepositoryStats()
    return { props: { githubStats }, revalidate: 300 }
}

export default function PaperPage({ githubStats }) {
    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>OpenAdapt technical paper</title>
                <meta
                    name="description"
                    content="The OpenAdapt technical paper: compiling a demonstrated GUI workflow into a deterministic local program that re-resolves drift, verifies effects, and halts under governance."
                />
                <link rel="canonical" href="https://openadapt.ai/paper" />
                <meta property="og:title" content="OpenAdapt technical paper" />
                <meta property="og:url" content="https://openadapt.ai/paper" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webPageSchema),
                    }}
                />
            </Head>

            <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
                <p className="eyebrow">Technical paper</p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    How OpenAdapt compiles, verifies, and halts.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg">
                    The paper describes the governed workflow compiler: how a
                    bounded demonstration becomes a deterministic local program,
                    how the deterministic ladder re-resolves interface drift
                    without per-run model calls, how effects are checked against
                    an independent oracle, and how the loop halts for a person
                    when configured verification cannot be established.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <a className="btn-ink" href={PAPER_PDF_PATH}>
                        Read the paper (PDF)
                    </a>
                    <a
                        className="btn-ghost-ink"
                        href={PAPER_SOURCE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View the paper source
                    </a>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-ink-3">
                    The typeset PDF is being finalized. Until it lands, the
                    complete LaTeX source, figures, and evidence live in the{' '}
                    <a
                        href={PAPER_SOURCE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline"
                    >
                        openadapt-flow paper directory
                    </a>
                    . For measured benchmark results, see the{' '}
                    <Link href="/compare" className="text-accent underline">
                        comparison page
                    </Link>
                    .
                </p>
            </section>

            <Footer repositoryStats={githubStats} />
        </div>
    )
}
