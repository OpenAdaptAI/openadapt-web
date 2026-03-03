import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWrench, faStar } from '@fortawesome/free-solid-svg-icons'

import { getPackageData } from 'utils/pypiStats'
import styles from './DevToolsSection.module.css'

export default function DevToolsSection() {
    const [tools, setTools] = useState([])

    useEffect(() => {
        getPackageData()
            .then((data) => {
                const devtools = data.filter(
                    (pkg) => pkg.category === 'devtools'
                )
                const sorted = [...devtools].sort(
                    (a, b) => (b.stars || 0) - (a.stars || 0)
                )
                setTools(sorted)
            })
            .catch((err) => {
                console.error('Failed to load dev tools:', err)
            })
    }, [])

    if (tools.length === 0) return null

    return (
        <div className={styles.background}>
        <div className={styles.container}>
            <h3 className={styles.heading}>Developer Automation</h3>
            <p className={styles.subtitle}>
                Tools that automate development, testing, and communication
            </p>
            <div className={styles.grid}>
                {tools.map((pkg) => {
                    const name = pkg.name
                    const description = pkg.description || ''
                    const stars = pkg.stars || 0
                    const language = pkg.language || ''
                    const repoUrl =
                        pkg.html_url ||
                        `https://github.com/OpenAdaptAI/${name}`

                    return (
                        <div key={name} className={styles.card}>
                            <div className={styles.packageName}>
                                <FontAwesomeIcon
                                    icon={faWrench}
                                    style={{
                                        fontSize: '12px',
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
                        </div>
                    )
                })}
            </div>
        </div>
        </div>
    )
}
