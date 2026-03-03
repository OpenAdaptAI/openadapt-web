import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faStar } from '@fortawesome/free-solid-svg-icons'

import { getPackageData } from 'utils/pypiStats'
import styles from './EcosystemSection.module.css'

function timeAgo(dateString) {
    if (!dateString) return ''
    const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months}mo ago`
    return `${Math.floor(months / 12)}y ago`
}

export default function EcosystemSection() {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getPackageData()
            .then((data) => {
                const sorted = [...data].sort(
                    (a, b) => (b.stars || 0) - (a.stars || 0)
                )
                setPackages(sorted)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Failed to load package data:', err)
                setError('Unable to load packages')
                setLoading(false)
            })
    }, [])

    const packageCount = packages.length

    return (
        <div className={styles.background} id="ecosystem">
            <h2 className={styles.heading}>The OpenAdapt Ecosystem</h2>
            <p className={styles.subtitle}>
                {packageCount > 0
                    ? `${packageCount} open-source repositories`
                    : 'Open-source repositories'}
            </p>

            {loading && (
                <p className={styles.loading}>Loading packages...</p>
            )}

            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && (
                <div className={styles.grid}>
                    {packages.map((pkg) => {
                        const name =
                            typeof pkg === 'string' ? pkg : pkg.name
                        const description =
                            typeof pkg === 'string'
                                ? ''
                                : pkg.description || ''
                        const stars = pkg.stars || 0
                        const language = pkg.language || ''
                        const pushedAt = pkg.pushed_at || ''
                        const repoUrl =
                            pkg.html_url ||
                            `https://github.com/OpenAdaptAI/${name}`

                        return (
                            <div key={name} className={styles.card}>
                                <div className={styles.packageName}>
                                    <FontAwesomeIcon
                                        icon={faBoxOpen}
                                        style={{
                                            fontSize: '13px',
                                            opacity: 0.7,
                                        }}
                                    />
                                    <a
                                        href={repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {name}
                                    </a>
                                </div>
                                {description && (
                                    <p className={styles.description}>
                                        {description}
                                    </p>
                                )}
                                <div className={styles.meta}>
                                    {stars > 0 && (
                                        <span className={styles.metaItem}>
                                            <FontAwesomeIcon
                                                icon={faStar}
                                                style={{ fontSize: '11px' }}
                                            />
                                            {stars.toLocaleString()}
                                        </span>
                                    )}
                                    {language && (
                                        <span className={styles.metaItem}>
                                            {language}
                                        </span>
                                    )}
                                    {pushedAt && (
                                        <span className={styles.metaItem}>
                                            {timeAgo(pushedAt)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
