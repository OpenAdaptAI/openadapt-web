import { useEffect, useState } from 'react'

import BookingEmbed from '@components/BookingEmbed'

import { UTM_KEYS, captureUtmParams } from 'utils/utm'

// Distinct Netlify form name so dental founding-cohort leads are separable
// from the general contact and email lists. Must match the static
// registration in public/form.html.
export const DENTAL_FORM_NAME = 'dental-founding-cohort'

const INITIAL_FORM = {
    name: '',
    email: '',
    practice: '',
    pms: '',
    message: '',
    botField: '',
}

export default function DentalLeadForm({ sectionId = 'book' }) {
    const [form, setForm] = useState(INITIAL_FORM)
    const [utm, setUtm] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState('')

    // Capture ?utm_* from the landing URL (persisted for the session) so the
    // submission records which campaign produced the lead.
    useEffect(() => {
        setUtm(captureUtmParams())
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'submit_form', {
                    event_category: 'Form',
                    event_label: DENTAL_FORM_NAME,
                    value: 1,
                })
            }

            const formData = new URLSearchParams()
            formData.set('form-name', DENTAL_FORM_NAME)
            formData.set('name', form.name)
            formData.set('email', form.email)
            formData.set('practice', form.practice)
            formData.set('pms', form.pms)
            formData.set('message', form.message)
            formData.set('bot-field', form.botField)
            formData.set(
                'landing_path',
                typeof window !== 'undefined'
                    ? window.location.pathname
                    : '/dental'
            )
            for (const key of UTM_KEYS) {
                formData.set(key, utm[key] || '')
            }

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

            setIsSubmitted(true)
        } catch (submitError) {
            console.error(submitError)
            setError('Submission failed. Please email hello@openadapt.ai directly.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section
            id={sectionId}
            className="mx-auto max-w-5xl px-4 py-12"
            style={{ scrollMarginTop: '80px' }}
        >
            <div className="rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                <p className="eyebrow mb-2">Founding cohort — 10 practices</p>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Book a 20-minute setup call
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-ink-2 md:text-base">
                    We&apos;ll look at your verification workflow together and
                    tell you plainly whether it fits. Prefer email first? Send
                    your details and we&apos;ll reply with how onboarding works
                    — no account, no obligation.
                </p>

                {!isSubmitted ? (
                    <form
                        className="mt-8 space-y-4"
                        onSubmit={handleSubmit}
                        data-netlify="true"
                        netlify-honeypot="bot-field"
                        name={DENTAL_FORM_NAME}
                    >
                        <input
                            type="hidden"
                            name="form-name"
                            value={DENTAL_FORM_NAME}
                        />
                        {UTM_KEYS.map((key) => (
                            <input
                                key={key}
                                type="hidden"
                                name={key}
                                value={utm[key] || ''}
                            />
                        ))}
                        <input type="hidden" name="landing_path" value="/dental" />
                        <p className="hidden">
                            <label>
                                Do not fill this out if you are human:{' '}
                                <input
                                    name="bot-field"
                                    value={form.botField}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            botField: event.target.value,
                                        }))
                                    }
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
                                    className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                                    placeholder="Your Name"
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
                                    className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                                    placeholder="name@yourpractice.com"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm">
                                Practice name *
                                <input
                                    type="text"
                                    name="practice"
                                    required
                                    value={form.practice}
                                    onChange={handleChange}
                                    className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                                    placeholder="Riverside Dental"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm">
                                Practice management software
                                <input
                                    type="text"
                                    name="pms"
                                    value={form.pms}
                                    onChange={handleChange}
                                    className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                                    placeholder="Dentrix, Eaglesoft, Open Dental…"
                                />
                            </label>
                        </div>

                        <label className="flex flex-col gap-2 text-sm">
                            Anything else?
                            <textarea
                                name="message"
                                rows={3}
                                value={form.message}
                                onChange={handleChange}
                                className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                                placeholder="Which payer portals do you check most? Roughly how many verifications per week?"
                            />
                        </label>

                        {error && (
                            <p className="rounded-lg border border-red-800/40 bg-red-100 px-3 py-2 text-sm text-red-900">
                                {error}
                            </p>
                        )}

                        <p className="text-sm text-ink-2">
                            You&apos;ll hear back from a founder within one
                            business day.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-ink disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? 'Sending...'
                                    : 'Email me the details'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSubmitted(true)}
                                className="btn-ghost-ink"
                            >
                                Skip form and book now
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-8 space-y-4">
                        <div className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-4">
                            <p className="text-sm text-accent">
                                Thanks — you&apos;ll hear from a founder within
                                one business day. Or skip the wait and book a
                                time directly below.
                            </p>
                        </div>
                        <BookingEmbed name={form.name} email={form.email} />
                    </div>
                )}
            </div>
        </section>
    )
}
