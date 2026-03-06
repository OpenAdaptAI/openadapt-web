import { useMemo, useState } from 'react'
import Link from 'next/link'

import Footer from '@components/Footer'

const INITIAL_FORM = {
    name: '',
    email: '',
    company: '',
    role: '',
    workflows: '',
    message: '',
    botField: '',
}

export default function ContactPage() {
    const [form, setForm] = useState(INITIAL_FORM)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState('')

    const bookingHref = useMemo(() => {
        const params = new URLSearchParams()
        if (form.name) {
            params.set('name', form.name)
        }
        if (form.email) {
            params.set('email', form.email)
        }

        const query = params.toString()
        return query ? `/book?${query}` : '/book'
    }, [form.email, form.name])

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
        <div className="min-h-screen bg-[#06061f] text-white">
            <div className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Contact OpenAdapt
                </h1>
                <p className="mt-3 text-sm text-white/75 md:text-base">
                    Tell us the workflow, current tools, and volume. We will
                    propose a pilot scope and ROI target.
                </p>

                {isSubmitted ? (
                    <div className="mt-8 space-y-4 rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-6">
                        <h2 className="text-xl font-semibold text-emerald-100">
                            Thanks, we received your details.
                        </h2>
                        <p className="text-sm text-emerald-50/90">
                            You can now pick a meeting time.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={bookingHref}
                                className="rounded-lg bg-[#5a1eac] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7132d4]"
                            >
                                Book a call
                            </Link>
                            <Link
                                href="/"
                                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:border-white/40 hover:bg-white/5"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form
                        className="mt-8 space-y-4 rounded-xl border border-white/10 bg-white/5 p-6"
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
                                    className="rounded-lg border border-white/15 bg-[#0a0a2d] px-3 py-2 text-white placeholder-white/40 focus:border-[#60a5fa] focus:outline-none"
                                    placeholder="Ashley Lucero"
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
                                    className="rounded-lg border border-white/15 bg-[#0a0a2d] px-3 py-2 text-white placeholder-white/40 focus:border-[#60a5fa] focus:outline-none"
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
                                    className="rounded-lg border border-white/15 bg-[#0a0a2d] px-3 py-2 text-white placeholder-white/40 focus:border-[#60a5fa] focus:outline-none"
                                    placeholder="Ashdon Realty"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm">
                                Role
                                <input
                                    type="text"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="rounded-lg border border-white/15 bg-[#0a0a2d] px-3 py-2 text-white placeholder-white/40 focus:border-[#60a5fa] focus:outline-none"
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
                                className="rounded-lg border border-white/15 bg-[#0a0a2d] px-3 py-2 text-white placeholder-white/40 focus:border-[#60a5fa] focus:outline-none"
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
                                className="rounded-lg border border-white/15 bg-[#0a0a2d] px-3 py-2 text-white placeholder-white/40 focus:border-[#60a5fa] focus:outline-none"
                                placeholder="What systems are involved? Approximate monthly volume?"
                            />
                        </label>

                        {error && (
                            <p className="rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg bg-[#5a1eac] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7132d4] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            <Link
                                href="/book"
                                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:border-white/40 hover:bg-white/5"
                            >
                                Skip to booking
                            </Link>
                        </div>
                    </form>
                )}
            </div>
            <Footer />
        </div>
    )
}

