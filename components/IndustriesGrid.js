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
                <h2 className={styles.buildTitle}>Put one workflow into production</h2>
                <p className={styles.buildDesc}>
                    Start with one repeated workflow, its verification oracle,
                    and its execution boundary. We&#39;ll take it through shadow
                    operation and supervised production writes in your environment.
                </p>
                <Link className="btn-ink" href="#book">
                    Plan the deployment
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
            title: 'Automation teams & BPO operators',
            href: '#book',
            descriptions:
                'High-volume repeated operations with structured inputs, established business logic, and a UI-only last-mile gap that can be checked against an independent effect source of truth.',
            logo: '/images/noun-finance.svg',
            example: {
                label: 'Insurance claims reference',
                href: '/solutions/insurance',
            },
        },
        {
            title: 'RCM & vertical-software vendors',
            href: '#book',
            descriptions:
                'Products with supported APIs for the core path and a bounded browser-only step at the edge, where volume and a separate system of record make verification practical.',
            logo: '/images/noun-healthcare.svg',
            example: {
                label: 'Healthcare workflow reference',
                href: '/solutions/healthcare',
            },
        },
        {
            title: 'Regulated enterprise operations',
            href: '#book',
            descriptions:
                'Governed teams that already know the inputs and rules, repeat the task at material volume, and can verify the external effect independently of the GUI run.',
            logo: '/images/noun-law.svg',
            example: {
                label: 'Lending operations reference',
                href: '/solutions/lending',
            },
        },
    ]

    const industryMessages = {
        'Automation teams & BPO operators':
            "I'm evaluating a high-volume workflow with a UI-only last-mile gap and an independent effect source of truth.",
        'RCM & vertical-software vendors':
            "I'm evaluating a bounded browser step that remains after using supported APIs.",
        'Regulated enterprise operations':
            "I'm evaluating a governed repeated workflow with structured inputs and an independent effect source of truth.",
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
                <p className="eyebrow text-center mb-2">Who it&apos;s for</p>
                <h2 className="font-display text-center text-xl font-semibold text-ink mb-3 tracking-tight">
                    Teams closing a UI-only last-mile gap
                </h2>
                <p className={styles.p}>
                    OpenAdapt is built for high-volume workflows with structured
                    inputs, established business logic, and a final write trapped
                    behind a user interface. Demonstrate that last mile once and
                    compile it into an inspectable program with explicit identity,
                    effect, policy, and deployment boundaries. Healthy replay makes
                    no model calls.
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
                        {grid.example ? (
                            <p className="mt-3 text-center text-xs text-ink-3">
                                Example:{' '}
                                <Link className="underline" href={grid.example.href}>
                                    {grid.example.label}
                                </Link>
                            </p>
                        ) : null}
                        <div className="flex flex-row items-center justify-center mt-3 mb-2">
                            <Link
                                className="btn-ink"
                                href="#book"
                                onClick={() =>
                                    handleGetStartedButtonClick(grid.title)
                                }
                            >
                                Evaluate fit
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <BuildForYouSection />
        </div>
    )
}
