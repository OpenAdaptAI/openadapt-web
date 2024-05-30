import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { submitToNetlify } from '../utils/formSubmission'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import styles from './FeedbackForm.module.css'

export default function FeedbackForm({ feedbackData }) {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formHidden, setFormHidden] = useState(false)

    // Update local state when feedbackData changes
    useEffect(() => {
        if (feedbackData) {
            setEmail(feedbackData.email)
            setMessage(feedbackData.message)
        }
    }, [feedbackData])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(event.target)
        formData.append('form-name', 'feedback')

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString(),
        })
            .then((response) => {
                if (response.ok) {
                    setFormHidden(true) // Hide form and show success message on successful submission
                    console.log('Form successfully submitted')
                } else {
                    console.error('Form submission failed')
                }
                setIsSubmitting(false)
            })
            .catch((error) => {
                console.error('Form submission error:', error)
                setIsSubmitting(false)
            })
    }

    return (
        <div
            id="waitlist"
            className={`${styles.background} px-10`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            {formHidden ? (
                <div
                    className="fade-in"
                    style={{ opacity: 1, transition: 'opacity 1s ease-in' }}
                >
                    <h2 className="font-extralight text-white text-2xl">
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-4" />
                        Get Ready
                    </h2>
                </div>
            ) : (
                <form
                    id="feedback-form"
                    className="flex items-center justify-center"
                    onSubmit={handleSubmit}
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    name="feedback"
                >
                    <div className="grid grid-flow-row auto-rows-max row-auto">
                        <input
                            type="hidden"
                            name="form-name"
                            value="feedback"
                        />
                        <p className={styles.hidden}>
                            <label>
                                Don’t fill this out if you’re human:{' '}
                                <input name="bot-field" />
                            </label>
                        </p>
                        <h1 className="font-light text-3xl text-white my-0">
                            Join the Waitlist
                        </h1>
                        <h2 className="mt-10 mb-8 font-light text-white flex-auto">
                            We'll email you when you can access OpenAdapt Alpha.
                        </h2>
                        <label
                            className={styles['email_label']}
                            htmlFor="email_form"
                        >
                            Email Address:
                            <span className={styles['required']}>*</span>
                        </label>
                        <input
                            id="email_form"
                            className={styles['form-field']}
                            type="email"
                            name="email_form"
                            required
                        />
                        <label className={styles['input_label']} htmlFor="help">
                            How can OpenAdapt help you?
                        </label>
                        <textarea
                            id="help"
                            style={{ minHeight: '100px' }}
                            className={styles['form-field']}
                            wrap="soft"
                            name="help"
                            value={message} // Use controlled component
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                        <div
                            className="container mx-auto"
                            style={{ textAlign: 'center' }}
                        >
                            <button
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}
