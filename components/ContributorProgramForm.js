import { useState } from 'react'
import Link from 'next/link'

import { trackEmailCapture } from 'utils/conversion'

// Dedicated intake for the contribute-for-credits program.
//
// Posts to the durable Netlify Forms lead path (`/form.html`) under its own
// form name, `contributor-program`, so contributor leads land in their own
// Netlify submissions bucket instead of the generic `contact` queue. The
// hidden form definition lives in public/form.html; Netlify's build-time bots
// read it from there. Registering interest shares only these contact fields;
// it never enables any upload or shares any workflow data.

const INITIAL_FORM = {
    name: '',
    email: '',
    company: '',
    role: '',
    workflows: '',
    message: '',
    botField: '',
}

export default function ContributorProgramForm() {
    const [form, setForm] = useState(INITIAL_FORM)
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
            const formData = new URLSearchParams()
            formData.set('form-name', 'contributor-program')
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
                throw new Error(
                    `Form submission failed with status ${response.status}`
                )
            }

            // E1 qualified-lead conversion: contributor-program interest
            // captured. Carries first-touch utm_* attribution; never any form
            // contents.
            trackEmailCapture({ location: 'contributor_program_form' })
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
                    name="contributor-program"
                >
                    <input
                        type="hidden"
                        name="form-name"
                        value="contributor-program"
                    />
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
                            Organization
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
                        Workflows you would consider contributing
                        <input
                            type="text"
                            name="workflows"
                            value={form.workflows}
                            onChange={handleChange}
                            className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                            placeholder="Claims intake, eligibility checks, order entry"
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-sm">
                        Anything else
                        <textarea
                            name="message"
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            className="rounded-lg border border-ink/30 bg-panel px-3 py-2 text-ink placeholder-ink-3/60 focus:border-accent focus:outline-none"
                            placeholder="Systems involved, data sensitivity, questions about the terms"
                        />
                    </label>

                    {error && (
                        <p className="rounded-lg border border-red-800/40 bg-red-100 px-3 py-2 text-sm text-red-900">
                            {error}
                        </p>
                    )}

                    <p className="text-xs leading-relaxed text-ink-3">
                        Registering interest shares only the contact details
                        above. It does not enable any upload, share any
                        workflow data, or accept any terms.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-ink disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? 'Submitting...'
                                : 'Request access'}
                        </button>
                        <Link href="/" className="btn-ghost-ink">
                            Back to home
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-4">
                    <p className="text-sm text-accent">
                        Thanks. You are on the early-access list for the
                        contributor program. We will reach out when the
                        versioned terms are finalized and access opens.
                    </p>
                </div>
            )}
        </div>
    )
}
