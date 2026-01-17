import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReddit } from '@fortawesome/free-brands-svg-icons'
import { faArrowUp, faComment } from '@fortawesome/free-solid-svg-icons'
import styles from './RedditFeed.module.css'

export default function RedditFeed({ onVisibilityChange }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        console.log('[RedditFeed] Starting to fetch Reddit posts...')

        // Set timeout to hide feed if loading takes too long (30 seconds)
        const timeout = setTimeout(() => {
            if (loading) {
                console.log('[RedditFeed] Loading timeout - hiding feed')
                setLoading(false)
                setError('timeout')
                if (onVisibilityChange) onVisibilityChange(false)
            }
        }, 30000)

        // Fetch Reddit posts from our API route to avoid CORS issues
        // The API route handles server-side fetching with proper User-Agent headers
        fetch('/api/social-feeds')
            .then(res => {
                clearTimeout(timeout)
                console.log('[RedditFeed] Fetch response:', { ok: res.ok, status: res.status })
                if (!res.ok) throw new Error(`Failed to fetch social feeds: ${res.status} ${res.statusText}`)
                return res.json()
            })
            .then(data => {
                console.log('[RedditFeed] API data received:', {
                    redditPostCount: data.reddit?.length || 0,
                    cached_at: data.cached_at
                })
                // Extract Reddit posts from the aggregated API response
                const redditPosts = data.reddit || []
                console.log('[RedditFeed] Reddit posts:', {
                    count: redditPosts.length,
                    titles: redditPosts.map(p => p.title)
                })
                setPosts(redditPosts)
                setLoading(false)

                // Notify parent of visibility status
                if (onVisibilityChange) {
                    onVisibilityChange(redditPosts.length > 0)
                }
            })
            .catch(err => {
                clearTimeout(timeout)
                console.error('[RedditFeed] Error fetching posts:', err)
                setError(err.message)
                setLoading(false)

                // Notify parent to hide this feed
                if (onVisibilityChange) onVisibilityChange(false)
            })

        return () => clearTimeout(timeout)
    }, [onVisibilityChange])

    // Auto-hide if loading, error, or no posts
    if (loading || error || posts.length === 0) {
        return null
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={faReddit} className={styles.headerIcon} />
                <h3 className={styles.title}>Reddit Discussions</h3>
            </div>
            <div className={styles.posts}>
                {posts.map(post => (
                    <a
                        href={`https://reddit.com${post.permalink}`}
                        key={post.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.post}
                    >
                        <div className={styles.postHeader}>
                            <span className={styles.subreddit}>r/{post.subreddit}</span>
                            <div className={styles.stats}>
                                <span className={styles.statItem}>
                                    <FontAwesomeIcon icon={faArrowUp} className={styles.statIcon} />
                                    {post.score}
                                </span>
                                <span className={styles.statItem}>
                                    <FontAwesomeIcon icon={faComment} className={styles.statIcon} />
                                    {post.num_comments}
                                </span>
                            </div>
                        </div>
                        <div className={styles.postTitle}>{post.title}</div>
                        <div className={styles.postMeta}>
                            Posted by u/{post.author}
                        </div>
                    </a>
                ))}
            </div>
            <a
                href="https://www.reddit.com/search/?q=openadapt"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewMore}
            >
                View More on Reddit
            </a>
        </div>
    )
}
