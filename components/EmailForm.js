import styles from './EmailForm.module.css'

export default function FeedbackForm() {
  return (
      <form
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        name="email"
        method="POST"
        action="/success"
      >
        <input type="hidden" name="form-name" value="email" />
        <p className={styles.hidden}>
            <label>
            Don’t fill this out if you’re human: <input name="bot-field" />
            </label>
        </p>
  
		<input type="text" placeholder="Email" className="input input-bordered input-primary w-full max-w-xs" />
		<button className="btn btn-primary ml-2">Register</button>
      </form>
  )
}
