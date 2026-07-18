import Link from 'next/link'
import { useEffect, useMemo } from 'react'

import {
    buildBookingUrlWithPrefill,
    getBookingConfig,
} from 'utils/booking'
import { trackBookingClick, trackBookingConfirmed } from 'utils/conversion'

/**
 * Best-effort "booked call" detection: the Cal.com iframe posts messages to
 * the parent page when a booking completes. Formats vary across embed
 * versions, so match on origin + the event name appearing anywhere in the
 * payload, and treat this as a soft signal (the booking itself is the
 * source of truth in Cal.com).
 */
function isCalBookingSuccess(event) {
    try {
        if (!event?.origin || !event.origin.includes('cal.com')) return false
        const raw =
            typeof event.data === 'string'
                ? event.data
                : JSON.stringify(event.data)
        return typeof raw === 'string' && raw.includes('bookingSuccessful')
    } catch (err) {
        return false
    }
}

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

    // E1 qualified-lead conversion: a completed Cal.com booking.
    useEffect(() => {
        if (!bookingUrl || provider !== 'calcom') return undefined
        const handleMessage = (event) => {
            if (isCalBookingSuccess(event)) {
                trackBookingConfirmed({ location: 'booking_embed' })
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [bookingUrl, provider])

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

    if (provider !== 'calcom') {
        return (
            <div className="rounded-xl border border-amber-700/40 bg-amber-100 px-4 py-5 text-amber-900">
                <p className="text-sm">
                    The booking destination is invalid. Use the contact form
                    while we restore the canonical Cal.com scheduler.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <a
                        href={embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ink"
                        onClick={() =>
                            trackBookingClick({
                                location: 'booking_embed_fallback',
                            })
                        }
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
                    onClick={() =>
                        trackBookingClick({
                            location: 'booking_embed_direct_link',
                        })
                    }
                >
                    this direct booking link
                </a>
                .
            </p>
        </div>
    )
}
