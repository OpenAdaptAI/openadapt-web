import { useEffect, useState } from 'react'
import Link from 'next/link'

import BookingEmbed from '@components/BookingEmbed'

const INITIAL_FORM = {
    name: '',
    email: '',
    company: '',
    role: '',
    workflows: '',
    message: '',
    botField: '',
}

export default function ContactBookingSection({
    sectionId = 'book',
    showHomeLink = false,
    prefill = null,
}) {
    const [form, setForm] = useState(INITIAL_FORM)

    // Seed the message from an industry card's "Get Started" click so the
    // visitor's stated interest survives the jump to the intake form.
    useEffect(() => {
        if (prefill?.message) {
            setForm((prev) => ({ ...prev, message: prefill.message }))
        }
    }, [prefill])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'submit_form', {
                    event_category: 'Form',
                    event_label: 'contact',
                    value: 1,
                })
            }

            const formData = new URLSearchParams()
            formData.set('form-name', 'contact')
            formData.set('name', form.name)
            formData.set('email', form.email)
            formData.set('company', form.company)
            formData.set('role', form.role)
            formData.set('workflows', form.workflows)
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
                throw new Error(`Form submission failed with status ${response.status}`)
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
        <section id={sectionId} className="mx-auto max-w-5xl px-4 py-12">
            <div className="rounded-2xl border border-hairline bg-panel p-6 md:p-8">
                <p className="eyebrow mb-2">Workflow qualification</p>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                    Book a 30-minute automation fit call
                </h2>
                <p className="mt-3 text-sm text-ink-2 md:text-base">
                    Tell us the substrate, repetition, consequence of error,
                    data boundary, and current verification path. We&apos;ll tell
                    you whether it fits managed browser execution, a
                    customer-controlled deployment, or neither.
                </p>

                {!isSubmitted ? (
                    <form
                        className="mt-8 space-y-4"
                        onSubmit={handleSubmit}
                        data-netlify="true"
                        netlify-honeypot="bot-field"
                        name="contact"
                    >
                        <input type="hidden" name="form-name" value="contact" />
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
                                    placeholder="name@company.com"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm">
                                Company
                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                                    placeholder="Acme Inc"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm">
                                Role
                                <input
                                    type="text"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                                    placeholder="Operations Manager"
                                />
                            </label>
                        </div>

                        <label className="flex flex-col gap-2 text-sm">
                            Priority workflows
                            <input
                                type="text"
                                name="workflows"
                                value={form.workflows}
                                onChange={handleChange}
                                className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                                placeholder="Leasing, maintenance triage, delinquency"
                            />
                        </label>

                        <label className="flex flex-col gap-2 text-sm">
                            Details
                            <textarea
                                name="message"
                                rows={5}
                                value={form.message}
                                onChange={handleChange}
                                className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                                placeholder="What systems are involved? Approximate monthly volume?"
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
                                {isSubmitting ? 'Submitting...' : 'Submit and Continue'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSubmitted(true)}
                                className="btn-ghost-ink"
                            >
                                Skip form and book now
                            </button>
                            {showHomeLink && (
                                <Link
                                    href="/"
                                    className="btn-ghost-ink"
                                >
                                    Back to home
                                </Link>
                            )}
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
