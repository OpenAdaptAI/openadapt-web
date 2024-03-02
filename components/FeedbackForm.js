import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import styles from './FeedbackForm.module.css'

export default function FeedbackForm({ feedbackData }) {
    const router = useRouter()
    const success = router.pathname.endsWith('success')
    if (success) {
        return (
            <>
                <div className="flex items-center justify-center my-20">
                    <h1 className="font-extralight">
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-4" />
                        Get Ready
                    </h1>
                </div>
            </>
        )
    } else {
        return (
        <div className={styles.background}>
            <div className={styles.row}>
                <form
                    id="waitlist"
                    className="flex items-center justify-center h-screen"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    name="feedback"
                    method="POST"
                    action="/success"
                >
                    <div className="w-2/3 grid grid-flow-row auto-rows-max row-auto">
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
            </div>
        </div>
        )
    }
}
