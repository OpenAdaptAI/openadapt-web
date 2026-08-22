import { useState } from 'react'

import { trackEmailCapture } from 'utils/conversion'
import styles from './NewsletterCapture.module.css'

export default function NewsletterCapture({
    location = 'newsletter_footer',
}) {
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [failed, setFailed] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setFailed(false)

        const body = new URLSearchParams(
            new FormData(event.target)
        ).toString()

        // Netlify Forms AJAX submission; mirrors the other lead forms.
        try {
            const response = await fetch('/form.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
            })
            if (!response.ok) throw new Error('newsletter submission failed')
            setSubmitted(true)
            trackEmailCapture({ location })
        } catch (error) {
            setFailed(true)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={styles.wrap} data-testid={location}>
            {submitted ? (
                <p className={styles.success} role="status">
                    Thanks — you are on the list. Product updates only, no
                    spam.
                </p>
            ) : (
                <>
                    <p className={styles.leader}>
                        Get product updates by email.
                    </p>
                    <form
                        name="newsletter"
                        method="post"
                        data-netlify="true"
                        netlify-honeypot="bot-field"
                        onSubmit={handleSubmit}
                        className={styles.form}
                    >
                        <input
                            type="hidden"
                            name="form-name"
                            value="newsletter"
                        />
                        <p className={styles.hidden}>
                            <label>
                                Do not fill this out if you are human:{' '}
                                <input
                                    name="bot-field"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </label>
                        </p>
                        <input
                            className={styles.input}
                            type="email"
                            name="email"
                            placeholder="you@company.com"
                            aria-label="Email address"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className={styles.submit}
                            disabled={submitting}
                        >
                            {submitting ? 'Sending…' : 'Subscribe'}
                        </button>
                    </form>
                    {failed && (
                        <p className={styles.error} role="alert">
                            That did not go through. Please try again.
                        </p>
                    )}
                </>
            )}
        </div>
    )
}
