import { useState } from 'react';
import { useRouter } from 'next/router';
import { submitToNetlify } from '../utils/formSubmission';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './EmailForm.module.css';

export default function EmailForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formHidden, setFormHidden] = useState(false); // Controls visibility of the form

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('form-name', 'email');
        formData.append('email', email);

        const success = await submitToNetlify('email', formData);

        setIsSubmitting(false);
        if (success) {
            setFormHidden(true); // Hide form and show success message on successful submission
        }
    };

    return (
        <div className={styles.background} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {formHidden ? (
                <div className="fade-in" style={{ opacity: 1, transition: 'opacity 1s ease-in' }}>
                    <h2 className="font-extralight text-white">
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-4" />
                        Get Ready
                    </h2>
                </div>
            ) : (
                <form
                    id="email-form"
                    className="flex items-center justify-center"
                    onSubmit={handleSubmit}
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    name="email"
                    style={{ width: '100%', transition: 'opacity 1s ease-out', opacity: isSubmitting ? 0 : 1 }}
                >
                    <input type="hidden" name="form-name" value="email" />
                    <div className="flex justify-center">
                        <input
                            id="emailInput"
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input w-8/12 max-w-xs text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary ml-2" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Register'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
