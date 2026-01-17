import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReddit } from '@fortawesome/free-brands-svg-icons'
import { faArrowUp, faComment } from '@fortawesome/free-solid-svg-icons'
import styles from './RedditFeed.module.css'

export default function RedditFeed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        console.log('[RedditFeed] Starting to fetch Reddit posts...')
        // Search Reddit for OpenAdapt mentions
        // Note: Using User-Agent header to prevent Reddit 403 errors
        fetch('https://www.reddit.com/search.json?q=openadapt&sort=new&limit=5', {
            headers: {
                'User-Agent': 'OpenAdapt-Web/1.0 (https://openadapt.ai)'
            }
        })
            .then(res => {
                console.log('[RedditFeed] Fetch response:', { ok: res.ok, status: res.status })
                if (!res.ok) throw new Error(`Failed to fetch Reddit posts: ${res.status} ${res.statusText}`)
                return res.json()
            })
            .then(data => {
                console.log('[RedditFeed] Raw data received:', {
                    totalChildren: data.data.children.length,
                    after: data.data.after
                })
                const filteredPosts = data.data.children
                    .map(child => child.data)
                    .filter(post => !post.stickied) // Filter out stickied posts
                console.log('[RedditFeed] Filtered posts:', {
                    count: filteredPosts.length,
                    titles: filteredPosts.map(p => p.title)
                })
                setPosts(filteredPosts)
                setLoading(false)
            })
            .catch(err => {
                console.error('[RedditFeed] Error fetching posts:', err)
                setError(err.message)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <FontAwesomeIcon icon={faReddit} className={styles.headerIcon} />
                    <h3 className={styles.title}>Reddit Discussions</h3>
                </div>
                <div className={styles.loading}>Loading discussions...</div>
            </div>
        )
    }

    if (error || posts.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <FontAwesomeIcon icon={faReddit} className={styles.headerIcon} />
                    <h3 className={styles.title}>Reddit Discussions</h3>
                </div>
                <div className={styles.empty}>
                    {error ? 'Unable to load discussions' : 'No recent discussions found'}
                </div>
                <a
                    href="https://www.reddit.com/search/?q=openadapt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewMore}
                >
                    Search Reddit for OpenAdapt
                </a>
            </div>
        )
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
