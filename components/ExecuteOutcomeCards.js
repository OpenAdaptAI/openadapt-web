import styles from './ExecuteOutcomeCards.module.css'

const outcomes = [
    {
        name: 'VERIFIED',
        detail: 'The configured identity, postcondition, and business-effect proof passed.',
        type: 'verified',
    },
    {
        name: 'HALTED_BEFORE_EFFECT',
        detail: 'The runner stopped when its authorization, target, identity, or policy evidence did not match.',
        type: 'halted',
    },
    {
        name: 'RECONCILIATION_REQUIRED',
        detail: 'A possible delivery needs an independent check. The runner does not repeat a consequential write blindly.',
        type: 'reconcile',
    },
]

function OutcomeIcon({ type }) {
    const paths = type === 'verified'
        ? <path d="M6 17l6 6L26 9" />
        : type === 'halted'
          ? <><path d="M16 5v13" /><path d="M16 24h.01" /><path d="M28 25H4L16 4z" /></>
          : <><path d="M25 12V7l3 3" /><path d="M27.5 10A12 12 0 1016 28" /><path d="M16 10v7l4 3" /></>

    return (
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            {paths}
        </svg>
    )
}

export default function ExecuteOutcomeCards() {
    return (
        <ul className={styles.cards} aria-label="Terminal execution outcomes">
            {outcomes.map((outcome) => (
                <li className={`${styles.card} ${styles[outcome.type]}`} key={outcome.name}>
                    <OutcomeIcon type={outcome.type} />
                    <div>
                        <h3>{outcome.name}</h3>
                        <p>{outcome.detail}</p>
                    </div>
                </li>
            ))}
        </ul>
    )
}
