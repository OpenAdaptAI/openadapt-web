import Head from 'next/head'

import Footer from '@components/Footer'
import JsonArtifactViewer from '@components/JsonArtifactViewer'
import {
    getPublicJsonArtifact,
    isJsonPointer,
} from '../../lib/publicJsonArtifacts.mjs'

export async function getServerSideProps({ query, res }) {
    const source = typeof query.source === 'string' ? query.source : ''
    const pointer = typeof query.pointer === 'string' ? query.pointer : ''
    const artifact = getPublicJsonArtifact(source)
    if (!artifact || !isJsonPointer(pointer)) return { notFound: true }

    res.setHeader(
        'Cache-Control',
        'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
    )
    return { props: { artifact, initialPointer: pointer } }
}

export default function PublicJsonArtifactPage({ artifact, initialPointer }) {
    const canonical = `https://openadapt.ai/artifacts/json?source=${encodeURIComponent(
        artifact.source
    )}`

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>{`${artifact.title} | OpenAdapt evidence`}</title>
                <meta name="description" content={artifact.description} />
                <meta name="robots" content="noindex,follow" />
                <link rel="canonical" href={canonical} />
                <meta property="og:title" content={artifact.title} />
                <meta property="og:description" content={artifact.description} />
                <meta property="og:url" content={canonical} />
            </Head>
            <JsonArtifactViewer
                artifact={artifact}
                initialPointer={initialPointer}
            />
            <Footer />
        </div>
    )
}
