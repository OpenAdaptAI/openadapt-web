import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import styles from './EmailForm.module.css'

export default function EmailForm() {
    const router = useRouter()
    const success = router.pathname.endsWith('success')

    if (success) {
        return (
            <>
                <h2 className="font-extralight">
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-4" />
                    Get Ready
                </h2>
            </>
        )
    } else {
        return (
            <>
                <form
                    id="register-form"
                    className="mt-6"
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

                    <div className="flex justify-center ">
                        <input
                            id="emailInput"
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input w-8/12 max-w-xs text-white"
                            required
                        />
                        <button className="btn btn-primary ml-2">Register</button>
                    </div>
                </form>
                <p className="text-sm mt-2 font-light opacity-70">
                    Register for updates (we promise not to spam)
                </p>
            </>
        )
    }
}
