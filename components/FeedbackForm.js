import styles from './FeedbackForm.module.css'

export default function FeedbackForm() {
    return (
        <form
            className={styles.form}
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            name="feedback"
            method="POST"
            action="/success"
        >
            <input type="hidden" name="form-name" value="feedback" />
            <p className={styles.hidden}>
                <label>
                    Don’t fill this out if you’re human:{' '}
                    <input name="bot-field" />
                </label>
            </p>
            
            <h1 className="my-10 font-light text-3xl">
                OpenAdapt.AI
            </h1>

            <h2 className="my-10 font-light">
                Fill out your email and we'll let you know when you can access 
                your spot for OpenAdapt Alpha
            </h2>

            <label htmlFor="email_form">Email Address:<span className={styles["required"]}>*</span></label>
            <input
                id="email_form"
                className={styles['form-field']}
                type="email_form"
                name="email_form"
                required
            />

            <label htmlFor="hear">How did you hear about us? [Optional] </label>
            <textarea
                id="hear"
                className={styles['form-field']}
                wrap="soft"
                name="hear"
            ></textarea>

            <label htmlFor="help">How can OpenAdapt help you? [Optional] </label>
            <textarea
                id="help"
                className={styles['form-field']}
                wrap="soft"
                name="help"
            ></textarea>


            <button className="btn btn-primary ml-2">Submit</button>

            <p className="text-sm mt-2 font-light opacity-70">
                    Register for updates (we promise not to spam)
            </p>
        </form>
    )
}
