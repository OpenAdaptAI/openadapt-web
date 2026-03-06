import Link from 'next/link'
import { useRouter } from 'next/router'

import BookingEmbed from '@components/BookingEmbed'
import Footer from '@components/Footer'

export default function BookPage() {
    const router = useRouter()
    const name = typeof router.query.name === 'string' ? router.query.name : ''
    const email = typeof router.query.email === 'string' ? router.query.email : ''

    return (
        <div className="min-h-screen bg-[#06061f] text-white">
            <div className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Book a 15-minute automation fit call
                </h1>
                <p className="mt-3 text-sm text-white/75 md:text-base">
                    Share your highest-friction workflow and we will map what can
                    be automated first.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/contact"
                        className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:border-white/40 hover:bg-white/5"
                    >
                        Need a longer intake form first?
                    </Link>
                    <Link
                        href="/"
                        className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:border-white/40 hover:bg-white/5"
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

