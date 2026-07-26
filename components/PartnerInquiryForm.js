import { useState } from 'react'
import Link from 'next/link'

import { trackEmailCapture } from 'utils/conversion'

// Dedicated intake for the partner program.
//
// Posts to the durable Netlify Forms lead path (`/form.html`) under its own
// form name, `partner-inquiry`, so partner leads land in their own Netlify
// submissions bucket instead of the generic `contact` queue. The hidden form
// definition lives in public/form.html; Netlify's build-time bots read it
// from there. The `track` selector mirrors the partner tracks on /partners.
// Lead data always travels in the POST body, never in a URL.

export const PARTNER_TRACKS = [
    { value: 'vertical_oem', label: 'Vertical software / OEM' },
    { value: 'rcm_bpo', label: 'RCM or BPO operator' },
    { value: 'integration_services', label: 'Integration / services' },
    { value: 'msp_deployment', label: 'MSP / deployment' },
]

const INITIAL_FORM = {
    name: '',
    email: '',
    company: '',
    role: '',
    track: '',
    systems: '',
    message: '',
    botField: '',
}

const fieldClass =
    'rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none'

export default function PartnerInquiryForm() {
    const [form, setForm] = useState(INITIAL_FORM)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            const formData = new URLSearchParams()
            formData.set('form-name', 'partner-inquiry')
            formData.set('name', form.name)
            formData.set('email', form.email)
            formData.set('company', form.company)
            formData.set('role', form.role)
            formData.set('track', form.track)
            formData.set('systems', form.systems)
            formData.set('message', form.message)
            formData.set('bot-field', form.botField)

            const response = await fetch('/form.html', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            })

            if (!response.ok) {
                throw new Error(
                    `Form submission failed with status ${response.status}`
                )
            }

            // Qualified-lead conversion: partner interest captured. Carries
            // first-touch utm_* attribution; never any form contents.
            trackEmailCapture({ location: 'partner_inquiry_form' })
            setIsSubmitted(true)
        } catch (submitError) {
            console.error(submitError)
            setError(
                'Submission failed. Please email hello@openadapt.ai directly.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="rounded-2xl border border-hairline bg-panel p-6 md:p-8">
            {!isSubmitted ? (
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    method="POST"
                    name="partner-inquiry"
                >
                    <input
                        type="hidden"
                        name="form-name"
                        value="partner-inquiry"
                    />
                    <p className="hidden">
                        <label>
                            Do not fill this out if you are human:{' '}
                            <input
                                name="bot-field"
                                value={form.botField}
                                onChange={handleChange}
                            />
                        </label>
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm">
                            Name *
                            <input
                                type="text"
                                name="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                className={fieldClass}
                                placeholder="Your Name"
                                autoComplete="name"
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-sm">
                            Work email *
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className={fieldClass}
                                placeholder="name@company.com"
                                autoComplete="email"
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-sm">
                            Company *
                            <input
                                type="text"
                                name="company"
                                required
                                value={form.company}
                                onChange={handleChange}
                                className={fieldClass}
                                placeholder="Acme Inc"
                                autoComplete="organization"
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-sm">
                            Role
                            <input
                                type="text"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className={fieldClass}
                                placeholder="VP Partnerships"
                                autoComplete="organization-title"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-2 text-sm">
                        Partner track *
                        <select
                            name="track"
                            required
                            value={form.track}
                            onChange={handleChange}
                            className={fieldClass}
                        >
                            <option value="">Select a track</option>
                            {PARTNER_TRACKS.map((track) => (
                                <option key={track.value} value={track.value}>
                                    {track.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        Systems of record or verticals you serve
                        <input
                            type="text"
                            name="systems"
                            value={form.systems}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="EMRs, practice management, loan origination, claims"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        What would you want to build or operate together?
                        <textarea
                            name="message"
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="Customer base, deployment constraints, timelines, questions"
                        />
                    </label>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg border border-red-800/40 bg-red-100 px-3 py-2 text-sm text-red-900"
                        >
                            {error}
                        </p>
                    )}

                    <p className="text-xs leading-relaxed text-ink-3">
                        Applying shares only the details above so we can
                        evaluate fit. See the{' '}
                        <Link href="/privacy-policy" className="text-accent">
                            Privacy Notice
                        </Link>{' '}
                        for how we handle contact details.
                    </p>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-ink disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Submitting...' : 'Apply to partner'}
                    </button>
                </form>
            ) : (
                <div className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-4">
                    <p className="text-sm text-accent">
                        Thanks. Your partner application is in review. We
                        evaluate applications individually and will reply by
                        email.
                    </p>
                </div>
            )}
        </div>
    )
}
