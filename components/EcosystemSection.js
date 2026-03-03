import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons'

import { getPackageData } from 'utils/pypiStats'
import styles from './EcosystemSection.module.css'

export default function EcosystemSection() {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getPackageData()
            .then((data) => {
                setPackages(data)
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
                    ? `A modular toolkit of ${packageCount} packages on PyPI`
                    : 'A modular toolkit of packages on PyPI'}
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
                        const repoUrl = `https://github.com/OpenAdaptAI/${name}`

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
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
