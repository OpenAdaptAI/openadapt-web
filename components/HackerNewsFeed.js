import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYCombinator } from '@fortawesome/free-brands-svg-icons'
import { faArrowUp, faComment } from '@fortawesome/free-solid-svg-icons'
import styles from './HackerNewsFeed.module.css'

export default function HackerNewsFeed() {
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Search Hacker News via Algolia API
        fetch('https://hn.algolia.com/api/v1/search?query=openadapt&tags=story')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch HN stories')
                return res.json()
            })
            .then(data => {
                // Filter out stories with no points and limit to 5
                const filteredStories = data.hits
                    .filter(story => story.points && story.points > 0)
                    .slice(0, 5)
                setStories(filteredStories)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <FontAwesomeIcon icon={faYCombinator} className={styles.headerIcon} />
                    <h3 className={styles.title}>Hacker News</h3>
                </div>
                <div className={styles.loading}>Loading stories...</div>
            </div>
        )
    }

    if (error || stories.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <FontAwesomeIcon icon={faYCombinator} className={styles.headerIcon} />
                    <h3 className={styles.title}>Hacker News</h3>
                </div>
                <div className={styles.empty}>
                    {error ? 'Unable to load stories' : 'No stories found yet'}
                </div>
                <a
                    href="https://hn.algolia.com/?query=openadapt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewMore}
                >
                    Search HN for OpenAdapt
                </a>
            </div>
        )
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
                        href={story.url || `https://news.ycombinator.com/item?id=${story.objectID}`}
                        key={story.objectID}
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
                                    {story.num_comments || 0}
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
