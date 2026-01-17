import React from 'react'
import GitHubActivity from './GitHubActivity'
import RedditFeed from './RedditFeed'
import HackerNewsFeed from './HackerNewsFeed'
import TwitterFeed from './TwitterFeed'
import styles from './SocialSection.module.css'

export default function SocialSection() {
    return (
        <section className={styles.section} id="community">
            <div className={styles.container}>
                <div className={styles.headerContent}>
                    <h2 className={styles.title}>Join the Community</h2>
                    <p className={styles.subtitle}>
                        See what people are saying about OpenAdapt across the web
                    </p>
                </div>

                <div className={styles.socialGrid}>
                    <div className={styles.gridItem}>
                        <GitHubActivity />
                    </div>
                    <div className={styles.gridItem}>
                        <RedditFeed />
                    </div>
                    <div className={styles.gridItem}>
                        <HackerNewsFeed />
                    </div>
                </div>

                <div className={styles.twitterContainer}>
                    <TwitterFeed />
                </div>

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
