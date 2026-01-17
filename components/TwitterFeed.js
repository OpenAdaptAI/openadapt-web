import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons'
import styles from './TwitterFeed.module.css'

export default function TwitterFeed() {
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [scriptError, setScriptError] = useState(false)

    useEffect(() => {
        console.log('[TwitterFeed] Initializing Twitter widget...')

        // Check if script already exists
        const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')
        if (existingScript) {
            console.log('[TwitterFeed] Twitter widget script already exists')
            setScriptLoaded(true)
            // Try to render widgets if twttr is available
            if (window.twttr?.widgets) {
                console.log('[TwitterFeed] Calling twttr.widgets.load()')
                window.twttr.widgets.load()
            }
            return
        }

        // Load Twitter widgets script
        const script = document.createElement('script')
        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = true
        script.charset = 'utf-8'

        script.onload = () => {
            console.log('[TwitterFeed] Twitter widget script loaded successfully')
            setScriptLoaded(true)
            if (window.twttr?.widgets) {
                console.log('[TwitterFeed] twttr.widgets available, loading...')
                window.twttr.widgets.load()
            }
        }

        script.onerror = (error) => {
            console.error('[TwitterFeed] Failed to load Twitter widget script:', error)
            setScriptError(true)
        }

        document.body.appendChild(script)

        return () => {
            // Cleanup script on unmount only if we created it
            if (script.parentNode) {
                console.log('[TwitterFeed] Cleaning up Twitter widget script')
                document.body.removeChild(script)
            }
        }
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={faXTwitter} className={styles.headerIcon} />
                <h3 className={styles.title}>Latest from X (Twitter)</h3>
            </div>
            <div className={styles.twitterContent}>
                {scriptError && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                        Unable to load X/Twitter feed. Try viewing directly on X.
                    </div>
                )}
                {!scriptLoaded && !scriptError && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                        Loading X/Twitter feed...
                    </div>
                )}
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
