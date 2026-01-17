import React, { useState, useCallback } from 'react'
import RedditFeed from './RedditFeed'
import HackerNewsFeed from './HackerNewsFeed'
import TwitterFeed from './TwitterFeed'
import styles from './SocialSection.module.css'

export default function SocialSection() {
    const [feedVisibility, setFeedVisibility] = useState({
        reddit: true,
        hackernews: true,
        twitter: true
    })

    const handleRedditVisibility = useCallback((isVisible) => {
        setFeedVisibility(prev => ({ ...prev, reddit: isVisible }))
    }, [])

    const handleHackerNewsVisibility = useCallback((isVisible) => {
        setFeedVisibility(prev => ({ ...prev, hackernews: isVisible }))
    }, [])

    const handleTwitterVisibility = useCallback((isVisible) => {
        setFeedVisibility(prev => ({ ...prev, twitter: isVisible }))
    }, [])

    // Count visible feeds to determine if we should show the section at all
    const visibleFeedsCount = Object.values(feedVisibility).filter(Boolean).length
    const hasVisibleFeeds = visibleFeedsCount > 0

    return (
        <section className={styles.section} id="community">
            <div className={styles.container}>
                <div className={styles.headerContent}>
                    <h2 className={styles.title}>Join the Community</h2>
                    <p className={styles.subtitle}>
                        See what people are saying about OpenAdapt across the web
                    </p>
                </div>

                {hasVisibleFeeds && (
                    <div className={styles.socialGrid}>
                        {feedVisibility.reddit && (
                            <div className={styles.gridItem}>
                                <RedditFeed onVisibilityChange={handleRedditVisibility} />
                            </div>
                        )}
                        {feedVisibility.hackernews && (
                            <div className={styles.gridItem}>
                                <HackerNewsFeed onVisibilityChange={handleHackerNewsVisibility} />
                            </div>
                        )}
                    </div>
                )}

                {feedVisibility.twitter && (
                    <div className={styles.twitterContainer}>
                        <TwitterFeed onVisibilityChange={handleTwitterVisibility} />
                    </div>
                )}

                <div className={styles.callToAction}>
                    <p className={styles.ctaText}>
                        Join the conversation and help shape the future of AI automation
                    </p>
                    <div className={styles.ctaButtons}>
                        <a
                            href="https://discord.gg/yF527cQbDG"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.ctaButton}
                        >
                            Join Discord
                        </a>
                        <a
                            href="https://github.com/OpenAdaptAI/OpenAdapt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.ctaButton} ${styles.ctaButtonSecondary}`}
                        >
                            Star on GitHub
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
