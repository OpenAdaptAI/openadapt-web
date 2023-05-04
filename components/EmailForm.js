import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import styles from './EmailForm.module.css'

export default function FeedbackForm() {
    const router = useRouter()
    console.log({ router })
    const success = router.pathname.endsWith('success')
    console.log({ success })

    if (success) {
        return (
            <div>
                <h2 className="font-extralight">
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-4" />
					Get Ready
                </h2>
            </div>
        )
    } else {
        return (
            <div>
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
                            Don’t fill this out if you’re human:{' '}
                            <input name="bot-field" />
                        </label>
                    </p>

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="input w-full max-w-xs text-neutral"
                        required
                    />
                    <button className="btn btn-primary ml-2 mt-2">Register</button>
                </form>
                <p className="text-sm mt-2 font-light opacity-70">
                    Register for updates (we promise not to spam)
                </p>
            </div>
        )
    }
}
