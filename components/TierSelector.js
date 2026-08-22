import { useState } from 'react'

import styles from './TierSelector.module.css'

/*
 * Pure client-side helper at the top of /pricing. Three questions map a
 * visitor to one recommended starting tier, with anchor links to the tier
 * cards below. Recommendations only restate claims already made by the tier
 * cards themselves: Cloud is scoped to browser workflows on non-regulated
 * data, and regulated data, desktop, RDP, and Citrix start with
 * qualification.
 */

const QUESTIONS = [
    {
        id: 'substrate',
        label: 'Where does the workflow run?',
        options: [
            { value: 'browser', label: 'In the browser' },
            { value: 'desktop-or-remote', label: 'Desktop or remote (RDP/Citrix)' },
        ],
    },
    {
        id: 'regulated',
        label: 'Is the data regulated?',
        options: [
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
        ],
    },
    {
        id: 'operator',
        label: 'Who operates it?',
        options: [
            { value: 'you', label: 'Your team' },
            { value: 'us', label: 'OpenAdapt' },
        ],
    },
]

const TIERS = {
    community: {
        href: '#community',
        name: 'OpenAdapt Community',
        why: 'Run the free MIT-licensed local runtime yourself and evaluate at no cost.',
    },
    cloud: {
        href: '#cloud-preview',
        name: 'OpenAdapt Cloud',
        why: 'Managed browser execution on non-regulated data, with history, evidence, and usage in one control plane.',
    },
    sprint: {
        href: '#pricing-enterprise',
        name: 'Workflow Qualification Sprint',
        why: 'Regulated data, desktop, RDP/Citrix surfaces, and enterprise scale start with a qualification.',
    },
}

const TIER_ORDER = ['community', 'cloud', 'sprint']

function recommend(answers) {
    const { substrate, regulated, operator } = answers
    if (regulated === 'yes') return 'sprint'
    if (substrate === 'desktop-or-remote') return 'sprint'
    if (operator === 'us') return 'cloud'
    if (operator === 'you') return 'community'
    return null
}

export default function TierSelector() {
    const [answers, setAnswers] = useState({})

    const answeredCount = QUESTIONS.filter(
        (question) => answers[question.id]
    ).length
    const selected = recommend(answers)
    const complete = answeredCount === QUESTIONS.length

    return (
        <div className="rounded-2xl border border-hairline bg-panel p-6 md:p-7">
            <p className="eyebrow">Not sure where to start?</p>
            <h2 className="mt-2 font-display text-lg font-semibold tracking-tight text-ink md:text-xl">
                Answer three questions.
            </h2>

            <div className="mt-5 grid gap-x-8 gap-y-1 md:grid-cols-3">
                {QUESTIONS.map((question) => (
                    <div key={question.id} className={styles.group}>
                        <p className="text-sm font-medium text-ink">
                            {question.label}
                        </p>
                        <div
                            className={styles.options}
                            role="group"
                            aria-label={question.label}
                        >
                            {question.options.map((option) => {
                                const isActive =
                                    answers[question.id] === option.value
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        aria-pressed={isActive}
                                        className={[
                                            styles.option,
                                            isActive
                                                ? styles.optionSelected
                                                : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        onClick={() =>
                                            setAnswers((current) => ({
                                                ...current,
                                                [question.id]: option.value,
                                            }))
                                        }
                                    >
                                        {option.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div aria-live="polite" className="mt-6 min-h-[2.5rem]">
                {!complete ? (
                    <p className="text-xs leading-relaxed text-ink-3">
                        {answeredCount > 0
                            ? `${answeredCount} of ${QUESTIONS.length} answered.`
                            : 'Answer all three to see a recommended starting tier.'}
                    </p>
                ) : (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-hairline bg-ground px-4 py-3">
                        <p className="text-sm leading-relaxed text-ink-2">
                            Recommended starting point:{' '}
                            <a
                                href={TIERS[selected].href}
                                className="font-semibold text-accent underline"
                            >
                                {TIERS[selected].name}
                            </a>
                            . {TIERS[selected].why}
                        </p>
                        <p className="text-xs text-ink-3">
                            Or compare all three:{' '}
                            {TIER_ORDER.map((tier, index) => (
                                <span key={tier}>
                                    {index > 0 && ' · '}
                                    <a
                                        href={TIERS[tier].href}
                                        className="underline hover:text-ink"
                                    >
                                        {TIERS[tier].name}
                                    </a>
                                </span>
                            ))}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
