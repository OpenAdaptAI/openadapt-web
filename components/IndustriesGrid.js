import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from './IndustriesGrid.module.css'

/*
 * BuildForYouSection — light editorial CTA block. The old dark canvas mesh
 * and SMIL circuit animation were removed with the paper-terminal restyle.
 */
function BuildForYouSection() {
    return (
        <div className={styles.buildSection}>
            <div className={styles.buildContent}>
                <h2 className={styles.buildTitle}>Let us build for you</h2>
                <p className={styles.buildDesc}>
                    If OpenAdapt doesn&#39;t fully automate your workflow out of the box, we&#39;ll work with you to fix that.
                </p>
                <Link className="btn-ink" href="#book">
                    Start Intake
                </Link>
            </div>
        </div>
    )
}

export default function IndustriesGrid({
    feedbackData,
    setFeedbackData,
    sectionRef,
}) {
    const gridData = [
        {
            title: 'Healthcare clinics',
            href: '/solutions/healthcare',
            descriptions:
                'Referral and fax intake, EMR data entry and extraction; web EMRs today, desktop and VDI EMRs on the roadmap. PHI handling stays fully local.',
            logo: '/images/noun-healthcare.svg',
        },
        {
            title: 'Mortgage & lending ops',
            href: '/solutions/lending',
            descriptions:
                'Loan-file data extraction and entry; desktop LOS like Encompass on the roadmap. Borrower data stays in your environment.',
            logo: '/images/noun-finance.svg',
        },
        {
            title: 'Other regulated back-offices',
            href: '#book',
            descriptions:
                'Document-heavy, compliance-bound workflows. Tell us yours.',
            logo: '/images/noun-law.svg',
        },
    ]

    const industryMessages = {
        'Healthcare clinics':
            "I'm interested in automating referral intake and EMR data entry at our clinic.",
        'Mortgage & lending ops':
            "I'm interested in automating loan-file data entry and extraction in our LOS.",
        'Other regulated back-offices':
            "I'm interested in automating a document-heavy workflow in a regulated back-office.",
    }

    const getDataFromTitle = (title) => {
        return {
            email: '',
            message: industryMessages[title] || '',
        }
    }

    const handleGetStartedButtonClick = (title) => {
        let data = getDataFromTitle(title)
        setFeedbackData(data)
    }

    return (
        <div className={styles.background} id="industries">
            <div className="flex flex-col items-center justify-center pt-10">
                <a
                    href="https://theresanaiforthat.com/ai/openadapt-ai/?ref=featured&v=2868434"
                    target="_blank"
                    rel="nofollow"
                    className="opacity-70 hover:opacity-100 transition-opacity duration-200"
                >
                    <img width="240" height="52" src="https://media.theresanaiforthat.com/featured-on-taaft.png?width=600" alt="Featured on There's An AI For That"></img>
                </a>
            </div>
            <div className="mt-12">
                <p className="eyebrow text-center mb-2">Industries</p>
                <h2 className="font-display text-center text-xl font-semibold text-ink mb-3 tracking-tight">
                    Built for regulated back-offices
                </h2>
                <p className={styles.p}>
                    Record the workflow once and OpenAdapt compiles it into an
                    automation your team can review, run, and audit, entirely
                    on your own machines. No brittle selectors to hand-author.
                    No per-run model costs.
                    <br />
                    <a href="https://github.com/OpenAdaptAI/openadapt-privacy">
                        Built-in PII/PHI scrubbing
                    </a>{' '}
                    keeps your sensitive data safe.
                </p>
            </div>
            <div className={styles.row}>
                {gridData.map((grid, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.logo}>
                            <Image
                                className="text-center inline"
                                priority
                                src={grid.logo}
                                height={60}
                                width={60}
                                alt={grid.title}
                            />
                        </div>
                        <h2 className={styles.title}>
                            {grid.href ? (
                                <Link href={grid.href}>{grid.title}</Link>
                            ) : (
                                grid.title
                            )}
                        </h2>
                        <ul className={styles.descriptions}>
                            {grid.descriptions
                                .split('\n')
                                .map((description) => (
                                    <li key={grid.title}>{description}</li>
                                ))}
                        </ul>
                        <div className="flex flex-row items-center justify-center mt-3 mb-2">
                            <Link
                                className="btn-ink"
                                href="#book"
                                onClick={() =>
                                    handleGetStartedButtonClick(grid.title)
                                }
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <BuildForYouSection />
        </div>
    )
}
