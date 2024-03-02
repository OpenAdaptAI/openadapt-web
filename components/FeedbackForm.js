import { useState } from 'react';
import { useRouter } from 'next/router';
import { submitToNetlify } from '../utils/formSubmission';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './FeedbackForm.module.css';

export default function FeedbackForm({ feedbackData }) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formHidden, setFormHidden] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('form-name', 'feedback');
        formData.append('email_form', email);
        formData.append('help', message);

        const success = await submitToNetlify('feedback', formData);

        setIsSubmitting(false);
        if (success) {
            setFormHidden(true);
            // Instead of setting formHidden back to false, keep it true to maintain the success message visibility
        }
    };

    return (
        <div className={styles.background} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {formHidden ? (
                <div className="fade-in" style={{ opacity: 1, transition: 'opacity 1s ease-in' }}>
                    <h1 className="font-extralight text-white">
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-4" />
                        Get Ready
                    </h1>
                </div>
            ) : (
                <form
                    id="waitlist"
                    className="flex items-center justify-center"
                    onSubmit={handleSubmit}
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    name="feedback"
                    style={{ width: '100%', transition: 'opacity 1s ease-out', opacity: isSubmitting ? 0 : 1 }}
                >
												<div className="grid grid-flow-row auto-rows-max row-auto">
														<input type="hidden" name="form-name" value="feedback" />
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
																className={styles["email_label"]}
																htmlFor="email_form">
																Email Address:
																<span className={styles["required"]}>
																		*
																</span>
														</label>
														<input
																id="email_form"
																className={styles['form-field']}
																type="email_form"
																name="email_form"
																required
														/>

														<label
																className={styles["input_label"]}
																htmlFor="help">
																How can OpenAdapt help you?
														</label>
														<textarea
																id="help"
																style={{ minHeight: '100px' }}
																className={styles['form-field']}
																wrap="soft"
																name="help"
																defaultValue={feedbackData.message}
														></textarea>


														<div className="container mx-auto" style={{ textAlign: "center"}}>
																<button className="btn btn-primary">Submit</button>
														</div>

												</div>
                </form>
            )}
        </div>
    );
}
