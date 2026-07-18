import Link from 'next/link'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import BookingEmbed from '@components/BookingEmbed'
import Footer from '@components/Footer'
import { trackBookingClick } from 'utils/conversion'

export default function BookPage() {
    const router = useRouter()

    // Reaching the scheduler page is the E1 "booking click" conversion —
    // it covers every CTA that routes here without touching each CTA.
    useEffect(() => {
        trackBookingClick({ location: 'book_page' })
    }, [])
    const name = typeof router.query.name === 'string' ? router.query.name : ''
    const email = typeof router.query.email === 'string' ? router.query.email : ''

    return (
        <div className="min-h-screen bg-ground text-ink">
            <Head>
                <title>Book a Call | OpenAdapt.AI</title>
                <meta
                    name="description"
                    content="Book a 30-minute automation fit call with the OpenAdapt team. Share your highest-friction workflow and we'll map what can be automated."
                />
                <link rel="canonical" href="https://openadapt.ai/book" />
                <meta property="og:title" content="Book a Call | OpenAdapt.AI" />
                <meta property="og:description" content="Book a 30-minute automation fit call with OpenAdapt. We'll map what can be automated." />
                <meta property="og:url" content="https://openadapt.ai/book" />
            </Head>
            <div className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                    Book a 30-minute automation fit call
                </h1>
                <p className="mt-3 text-sm text-ink-2 md:text-base">
                    Share your highest-friction workflow and we will map what can
                    be automated first.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/contact"
                        className="btn-ghost-ink"
                    >
                        Need a longer intake form first?
                    </Link>
                    <Link
                        href="/"
                        className="btn-ghost-ink"
                    >
                        Back to home
                    </Link>
                </div>
                <div className="mt-8">
                    <BookingEmbed name={name} email={email} />
                </div>
            </div>
            <Footer />
        </div>
    )
}
