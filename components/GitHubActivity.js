import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faCodeBranch, faEye, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import styles from './GitHubActivity.module.css'

export default function GitHubActivity() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('https://api.github.com/repos/OpenAdaptAI/OpenAdapt')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch GitHub stats')
                return res.json()
            })
            .then(data => {
                setStats({
                    stars: data.stargazers_count,
                    forks: data.forks_count,
                    watchers: data.subscribers_count,
                    issues: data.open_issues_count
                })
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
                <div className={styles.loading}>Loading GitHub stats...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Unable to load GitHub stats</div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <a
                href="https://github.com/OpenAdaptAI/OpenAdapt"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
            >
                <h3 className={styles.title}>GitHub Activity</h3>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <FontAwesomeIcon icon={faStar} className={styles.icon} />
                        <div className={styles.statContent}>
                            <span className={styles.value}>{stats.stars.toLocaleString()}</span>
                            <span className={styles.label}>Stars</span>
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <FontAwesomeIcon icon={faCodeBranch} className={styles.icon} />
                        <div className={styles.statContent}>
                            <span className={styles.value}>{stats.forks.toLocaleString()}</span>
                            <span className={styles.label}>Forks</span>
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <FontAwesomeIcon icon={faEye} className={styles.icon} />
                        <div className={styles.statContent}>
                            <span className={styles.value}>{stats.watchers.toLocaleString()}</span>
                            <span className={styles.label}>Watchers</span>
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <FontAwesomeIcon icon={faCircleExclamation} className={styles.icon} />
                        <div className={styles.statContent}>
                            <span className={styles.value}>{stats.issues.toLocaleString()}</span>
                            <span className={styles.label}>Issues</span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}
