import { useState } from 'react'
import Image from 'next/image'
import styles from './ViewerShowcase.module.css'

export default function ViewerShowcase() {
    const showcaseItems = [
        {
            title: "Capture Viewer",
            description: "Record and playback human demonstrations with detailed event tracking, playback controls, and step-by-step analysis.",
            image: "/images/screenshots/capture/turn-off-nightshift_full.png",
            alt: "OpenAdapt Capture Viewer showing turn-off-nightshift recording with playback controls",
            features: ["Event timeline", "Screenshot playback", "Action details"]
        },
        {
            title: "Segmentation Viewer",
            description: "Browse and analyze segmented episodes from recordings. View key frames, search episodes, and filter by recording.",
            image: "/images/screenshots/segmentation/02_episodes_loaded.png",
            alt: "OpenAdapt Segmentation Viewer with episode library showing thumbnails",
            features: ["Episode library", "Key frame gallery", "Search & filter"]
        },
        {
            title: "Benchmark Viewer",
            description: "Visualize benchmark results with task-by-task performance metrics, domain breakdowns, and detailed replay.",
            image: "/images/screenshots/benchmark/summary.png",
            alt: "OpenAdapt Benchmark Viewer showing performance metrics and domain statistics",
            features: ["Performance metrics", "Task details", "Domain analysis"],
            fallback: true  // Indicate this might not exist yet
        }
    ]

    const [imageErrors, setImageErrors] = useState({})

    const handleImageError = (index) => {
        setImageErrors(prev => ({ ...prev, [index]: true }))
    }

    return (
        <div className={styles.showcase} id="viewers">
            <div className={styles.container}>
                <h2 className={styles.heading}>
                    Powerful Visualization Tools
                </h2>
                <p className={styles.subheading}>
                    OpenAdapt includes professional visualization tools for analyzing
                    recordings, browsing episodes, and evaluating model performance.
                    All viewers run locally in your browser with no external dependencies.
                </p>

                <div className={styles.grid}>
                    {showcaseItems.map((item, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                {!imageErrors[index] && !item.fallback ? (
                                    <Image
                                        src={item.image}
                                        alt={item.alt}
                                        width={1400}
                                        height={900}
                                        className={styles.screenshot}
                                        quality={90}
                                        onError={() => handleImageError(index)}
                                        priority={index === 0}  // Prioritize first image
                                    />
                                ) : (
                                    <div className={styles.placeholder}>
                                        <div className={styles.placeholderIcon}>
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                                <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p className={styles.placeholderText}>
                                            {item.fallback ? 'Coming Soon' : 'Screenshot'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className={styles.content}>
                                <h3 className={styles.title}>{item.title}</h3>
                                <p className={styles.description}>{item.description}</p>

                                <ul className={styles.features}>
                                    {item.features.map((feature, i) => (
                                        <li key={i} className={styles.feature}>
                                            <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.cta}>
                    <p className={styles.ctaText}>
                        All viewers are open source and included with OpenAdapt
                    </p>
                    <a
                        href="https://github.com/OpenAdaptAI/openadapt-viewer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.ctaButton}
                    >
                        View Source Code
                    </a>
                </div>
            </div>
        </div>
    )
}
