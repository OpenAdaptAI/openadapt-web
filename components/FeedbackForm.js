import { useState } from 'react';
import { useRouter } from 'next/router';
import { submitToNetlify } from '../utils/formSubmission';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './FeedbackForm.module.css';

export default function FeedbackForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formHidden, setFormHidden] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.target);
        formData.append('form-name', 'feedback');

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
        .then(response => {
            if (response.ok) {
                setFormHidden(true); // Hide form and show success message on successful submission
                console.log("Form successfully submitted");
            } else {
                console.error("Form submission failed");
            }
            setIsSubmitting(false);
        })
        .catch((error) => {
            console.error("Form submission error:", error);
            setIsSubmitting(false);
        });
    };

    return (
        <div className={styles.background} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {formHidden ? (
                <div className="fade-in" style={{ opacity: 1, transition: 'opacity 1s ease-in', color: 'black' /* Adjust for visibility */ }}>
                    <h2 className="font-extralight text-white">
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
                    style={{ width: '100%', transition: 'opacity 1s ease-out', opacity: isSubmitting ? 0 : 1 }}
                >
                    <input type="hidden" name="form-name" value="feedback" />
                    {/* Form fields with adjusted styles for visibility */}
                    <div className="flex flex-col items-center justify-center">
                        <input
                            name="email"
                            type="email"
                            placeholder="Your Email"
                            className="input"
                            style={{ color: 'black', backgroundColor: 'white' }} // Ensure text is visible
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            className="textarea"
                            style={{ color: 'black', backgroundColor: 'white' }} // Ensure text is visible
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                        <button type="submit" className="btn" disabled={isSubmitting} style={{ color: 'white', backgroundColor: 'blue' }}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
