import { useMemo } from 'react'

import {
    buildBookingUrlWithPrefill,
    getConfiguredBookingUrl,
} from 'utils/booking'

export default function BookingEmbed({ name = '', email = '' }) {
    const bookingUrl = getConfiguredBookingUrl()
    const embedUrl = useMemo(
        () => buildBookingUrlWithPrefill(bookingUrl, { name, email }),
        [bookingUrl, name, email]
    )

    if (!bookingUrl) {
        return (
            <div className="rounded-xl border border-yellow-300/30 bg-yellow-500/10 px-4 py-4 text-yellow-100">
                <p className="text-sm">
                    Booking is not configured yet. Set `NEXT_PUBLIC_BOOKING_URL`
                    in `openadapt-web/.env.local` and redeploy.
                </p>
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

