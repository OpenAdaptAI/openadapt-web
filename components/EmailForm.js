import { useState } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import styles from './EmailForm.module.css'

export default function EmailForm() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formHidden, setFormHidden] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)

        window.gtag('event', 'submit_form', {
            event_category: 'Form',
            event_label: 'email',
            value: 1,
        })

        const formData = new FormData(event.target)
        /*
        formData.append('form-name', 'email') // Ensure this matches the name attribute of your form
        */

        // Using fetch to submit form data to Netlify according to their AJAX submission guide
        fetch('/form.html', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString(),
        })
            .then((response) => {
                console.log({response})
                setIsSubmitting(false)
                if (response.ok) {
                    setFormHidden(true) // Hide form and show success message on successful submission
                    console.log('Form successfully submitted')
                    // Handle further actions here, e.g., showing a success message
                } else {
                    // Handle submission error
                    console.error('Form submission failed')
                }
            })
            .catch((error) => {
                setIsSubmitting(false)
                console.error('Form submission error:', error)
            })
    }

    const formClassName = 'flex items-center justify-center w-full transition-opacity duration-300'
        + (isSubmitting ? ' opacity-0' : ' opacity-100')

    return (
        <div className={`${styles.background} flex flex-col justify-center items-center`}>
            {formHidden ? (
                <div className="fade-in">
                    <h4 className="font-light text-white/90 text-sm">
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                        Thanks for registering!
                    </h4>
                </div>
            ) : (
                <>
                    <form
                        id="email-form"
                        className={formClassName}
                        onSubmit={handleSubmit}
                        data-netlify="true"
                        netlify-honeypot="bot-field"
                        name="email"
                    >
                        <input type="hidden" name="form-name" value="email" />
                        <p className={styles.hidden}>
                            <label>
                                Do not fill this out if you are human:{' '}
                                <input name="bot-field" />
                            </label>
                        </p>
                        <div className="flex justify-center gap-2">
                            <input
                                id="emailInput"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/90 text-sm placeholder-white/50 focus:border-[#560df8]/50 focus:outline-none focus:ring-1 focus:ring-[#560df8]/30 transition-all duration-200 w-56 max-w-xs"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-[#5a1eac] hover:bg-[#7132d4] text-white text-sm font-medium transition-all duration-200 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Register'}
                            </button>
                        </div>
                    </form>
                    <p className="text-xs mt-2 font-light text-white/60">
                        Register for updates (we promise not to spam)
                    </p>
                </>
            )}
        </div>
    )
}
