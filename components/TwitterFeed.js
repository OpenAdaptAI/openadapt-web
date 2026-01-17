import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons'
import styles from './TwitterFeed.module.css'

export default function TwitterFeed() {
    useEffect(() => {
        // Load Twitter widgets script
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = true
        script.charset = 'utf-8'
        document.body.appendChild(script)

        return () => {
            // Cleanup script on unmount
            document.body.removeChild(script)
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={faXTwitter} className={styles.headerIcon} />
                <h3 className={styles.title}>Latest from X (Twitter)</h3>
            </div>
            <div className={styles.twitterContent}>
                <a
                    className="twitter-timeline"
                    data-height="500"
                    data-theme="dark"
                    data-chrome="noheader nofooter noborders"
                    data-tweet-limit="3"
                    href="https://twitter.com/OpenAdaptAI?ref_src=twsrc%5Etfw"
                >
                    Posts by @OpenAdaptAI
                </a>
            </div>
            <a
                href="https://twitter.com/OpenAdaptAI"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewMore}
            >
                Follow @OpenAdaptAI on X
            </a>
        </div>
    )
}
