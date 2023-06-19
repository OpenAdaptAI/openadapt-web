import styles from './FeedbackForm.module.css'

export default function FeedbackForm({ feedbackData }) {
    return (
        <form
            className="flex items-center justify-center h-screen"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            name="feedback"
            method="POST"
            action="/success"
        >
            <div className="w-1/2 grid grid-flow-row auto-rows-max row-auto">
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
                    Fill out your email and we'll let you know when you can access your spot for OpenAdapt Alpha.
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
                    className={styles['form-field']}
                    wrap="soft"
                    name="help"
                    defaultValue={feedbackData.message}
                ></textarea>


                <div className="container mx-auto" style={{ textAlign: "center"}}>
                    <button className="btn btn-primary">Submit</button>
                </div>

                <p className="text-sm mt-2 font-light opacity-70 flex justify-center">
                    Register for updates (we promise not to spam)
                </p>
            </div>
        </form>
    )
}
