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
            <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 px-4 py-5 text-amber-100">
                <p className="text-sm">
                    Live booking is temporarily unavailable. Use the contact form
                    and we will send available time options directly.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        href="/contact"
                        className="rounded-lg bg-[#5a1eac] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7132d4]"
                    >
                        Go to Contact Form
                    </Link>
                    <a
                        href="mailto:sales@openadapt.ai?subject=OpenAdapt%20Booking%20Request"
                        className="rounded-lg border border-amber-200/40 px-4 py-2 text-sm text-amber-100 transition hover:border-amber-100/70 hover:bg-amber-200/10"
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
            <div className="rounded-xl border border-amber-300/30 bg-amber-500/10 px-4 py-5 text-amber-100">
                <p className="text-sm">
                    {providerLabel} does not support secure inline embedding on this page.
                    Open booking in a new tab instead.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <a
                        href={embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-[#5a1eac] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7132d4]"
                    >
                        Open Booking Link
                    </a>
                    <Link
                        href="/contact"
                        className="rounded-lg border border-amber-200/40 px-4 py-2 text-sm text-amber-100 transition hover:border-amber-100/70 hover:bg-amber-200/10"
                    >
                        Go to Contact Form
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                <iframe
                    title="Book a call with OpenAdapt"
                    src={embedUrl}
                    className="h-[760px] w-full rounded-lg bg-white"
                    loading="lazy"
                />
            </div>
            <p className="text-center text-xs text-white/60">
                If the inline scheduler does not load, use{' '}
                <a
                    href={embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 underline hover:text-blue-200"
                >
                    this direct booking link
                </a>
                .
            </p>
        </div>
    )
}
