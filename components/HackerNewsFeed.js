import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYCombinator } from '@fortawesome/free-brands-svg-icons'
import { faArrowUp, faComment } from '@fortawesome/free-solid-svg-icons'
import styles from './HackerNewsFeed.module.css'

export default function HackerNewsFeed({ onVisibilityChange }) {
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Set timeout to hide feed if loading takes too long (30 seconds)
        const timeout = setTimeout(() => {
            if (loading) {
                console.log('[HackerNewsFeed] Loading timeout - hiding feed')
                setLoading(false)
                setError('timeout')
                if (onVisibilityChange) onVisibilityChange(false)
            }
        }, 30000)

        // Fetch Hacker News stories from our API route for better caching and consistency
        fetch('/api/social-feeds')
            .then(res => {
                clearTimeout(timeout)
                if (!res.ok) throw new Error('Failed to fetch social feeds')
                return res.json()
            })
            .then(data => {
                // Extract Hacker News stories from the aggregated API response
                const hnStories = data.hn || []
                setStories(hnStories)
                setLoading(false)

                // Notify parent of visibility status
                if (onVisibilityChange) {
                    onVisibilityChange(hnStories.length > 0)
                }
            })
            .catch(err => {
                clearTimeout(timeout)
                setError(err.message)
                setLoading(false)

                // Notify parent to hide this feed
                if (onVisibilityChange) onVisibilityChange(false)
            })

        return () => clearTimeout(timeout)
    }, [onVisibilityChange])

    // Auto-hide if loading, error, or no stories
    if (loading || error || stories.length === 0) {
        return null
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={faYCombinator} className={styles.headerIcon} />
                <h3 className={styles.title}>Hacker News</h3>
            </div>
            <div className={styles.stories}>
                {stories.map(story => (
                    <a
                        href={story.url}
                        key={story.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.story}
                    >
                        <div className={styles.storyHeader}>
                            <span className={styles.stats}>
                                <span className={styles.statItem}>
                                    <FontAwesomeIcon icon={faArrowUp} className={styles.statIcon} />
                                    {story.points}
                                </span>
                                <span className={styles.statItem}>
                                    <FontAwesomeIcon icon={faComment} className={styles.statIcon} />
                                    {story.num_comments}
                                </span>
                            </span>
                        </div>
                        <div className={styles.storyTitle}>{story.title}</div>
                        <div className={styles.storyMeta}>
                            by {story.author} • {new Date(story.created_at).toLocaleDateString()}
                        </div>
                    </a>
                ))}
            </div>
            <a
                href="https://hn.algolia.com/?query=openadapt"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewMore}
            >
                View More on Hacker News
            </a>
        </div>
    )
}
