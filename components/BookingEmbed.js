import Link from 'next/link'
import { useMemo } from 'react'

import {
    buildBookingUrlWithPrefill,
    getBookingConfig,
} from 'utils/booking'

export default function BookingEmbed({ name = '', email = '' }) {
    const { bookingUrl, provider } = useMemo(() => {
        const config = getBookingConfig()
        return {
            bookingUrl: config.url,
            provider: config.provider,
        }
    }, [])
    const embedUrl = useMemo(
        () => buildBookingUrlWithPrefill(bookingUrl, { name, email }),
        [bookingUrl, name, email]
    )

    if (!bookingUrl) {
        return (
            <div className="rounded-xl border border-amber-700/40 bg-amber-100 px-4 py-5 text-amber-900">
                <p className="text-sm">
                    Live booking is temporarily unavailable. Use the contact form
                    and we will send available time options directly.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        href="/contact"
                        className="btn-ink"
                    >
                        Go to Contact Form
                    </Link>
                    <a
                        href="mailto:sales@openadapt.ai?subject=OpenAdapt%20Booking%20Request"
                        className="rounded-full border border-amber-800/50 px-4 py-2 text-sm text-amber-900 transition hover:bg-amber-200/50"
                    >
                        Email Sales
                    </a>
                </div>
            </div>
        )
    }

    if (provider !== 'calendly') {
        const providerLabel = provider === 'clockwise' ? 'Clockwise' : 'your booking provider'
        return (
            <div className="rounded-xl border border-amber-700/40 bg-amber-100 px-4 py-5 text-amber-900">
                <p className="text-sm">
                    {providerLabel} does not support secure inline embedding on this page.
                    Open booking in a new tab instead.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <a
                        href={embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ink"
                    >
                        Open Booking Link
                    </a>
                    <Link
                        href="/contact"
                        className="rounded-full border border-amber-800/50 px-4 py-2 text-sm text-amber-900 transition hover:bg-amber-200/50"
                    >
                        Go to Contact Form
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-hairline bg-panel p-2">
                <iframe
                    title="Book a call with OpenAdapt"
                    src={embedUrl}
                    className="h-[760px] w-full rounded-lg bg-white"
                    loading="lazy"
                />
            </div>
            <p className="text-center text-xs text-ink-3">
                If the inline scheduler does not load, use{' '}
                <a
                    href={embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-ink"
                >
                    this direct booking link
                </a>
                .
            </p>
        </div>
    )
}
