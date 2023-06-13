import styles from './FeedbackForm.module.css'

export default function FeedbackForm({ feedbackData }) {
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
            
            <h1 className="my-10 font-light text-3xl text-white">
                OpenAdapt.AI
            </h1>

            <h2 className="my-10 font-light text-white">
                Fill out your email and we'll let you know when you can access 
                your spot for OpenAdapt Alpha
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
                htmlFor="hear">
                    How did you hear about us? [Optional] 
            </label>
            <textarea
                id="hear"
                className={styles['form-field']}
                wrap="soft"
                name="hear"
            ></textarea>

            <label 
                className={styles["input_label"]} 
                htmlFor="help">
                    How can OpenAdapt help you? [Optional] 
            </label>
            <textarea
                id="help"
                className={styles['form-field']}
                wrap="soft"
                name="help"
                defaultValue={feedbackData.message}
            ></textarea>


            <div className="container" style={{ textAlign: "center" }}>
                <button className="btn btn-primary ml-2">Submit</button>
            </div>


            <p className="text-sm mt-2 font-light opacity-70">
                    Register for updates (we promise not to spam)
            </p>
        </form>
    )
}
