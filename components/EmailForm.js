import { useState } from 'react'
import { useRouter } from 'next/router'
import { submitToNetlify } from '../utils/formSubmission' // Make sure this util follows Netlify's requirements
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

        const formData = new FormData(event.target)
        formData.append('form-name', 'email') // Ensure this matches the name attribute of your form

        // Using fetch to submit form data to Netlify according to their AJAX submission guide
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString(),
        })
            .then((response) => {
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

    return (
        <div
            className={styles.background}
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1em',
            }}
        >
            {formHidden ? (
                <div
                    className="fade-in"
                    style={{ opacity: 1, transition: 'opacity 1s ease-in' }}
                >
                    <h4 className="font-extralight text-white">
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-4" />
                        Get Ready
                    </h4>
                </div>
            ) : (
                <>
                    <form
                        id="email-form"
                        className="flex items-center justify-center"
                        onSubmit={handleSubmit}
                        data-netlify="true"
                        data-netlify-honeypot="bot-field"
                        name="email" // Ensure this matches with Netlify form settings
                        style={{
                            width: '100%',
                            transition: 'opacity 1s ease-out',
                            opacity: isSubmitting ? 0 : 1,
                        }}
                    >
                        <input type="hidden" name="form-name" value="email" />
                        <div className="flex justify-center">
                            <input
                                id="emailInput"
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="input w-8/12 max-w-xs text-white"
                                style={{
                                    color: 'black',
                                    backgroundColor:
                                        'white' /* Ensure text is visible */,
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-primary ml-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Register'}
                            </button>
                        </div>
                    </form>
                    <p className="text-sm mt-2 font-light opacity-70">
                        Register for updates (we promise not to spam)
                    </p>
                </>
            )}
        </div>
    )
}
