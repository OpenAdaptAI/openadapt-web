import Image from 'next/image'

import styles from './QualificationJudgmentCapture.module.css'

const OUTCOMES = [
    {
        label: 'Rule candidate for review',
        body: 'Test the proposed rule against representative and fault cases before approval.',
    },
    {
        label: 'Permanent human decision node',
        body: 'Keep the choice with an authorized role whenever policy or discretion requires it.',
    },
    {
        label: 'More examples required',
        body: 'Collect contrasting cases when the available evidence does not justify a stable rule.',
    },
]

export default function QualificationJudgmentCapture() {
    return (
        <section className={styles.section} aria-labelledby="qualification-judgment-heading">
            <div className={styles.copy}>
                <p className="eyebrow">Qualification · Human judgment</p>
                <h2 id="qualification-judgment-heading">
                    Capture the policy behind the action.
                </h2>
                <p className={styles.intro}>
                    During qualification, your team can show how an institutional exception should be handled. OpenAdapt records the reviewed choice and the authority behind it. One answer never becomes policy by itself.
                </p>
                <div className={styles.outcomes} aria-label="Qualification judgment outcomes">
                    {OUTCOMES.map((outcome, index) => (
                        <article key={outcome.label}>
                            <span aria-hidden="true">0{index + 1}</span>
                            <div>
                                <h3>{outcome.label}</h3>
                                <p>{outcome.body}</p>
                            </div>
                        </article>
                    ))}
                </div>
                <a
                    className="btn-ghost-ink"
                    href="https://app.openadapt.ai/demo/qualification-judgment"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Try judgment capture <span aria-hidden="true">→</span>
                </a>
            </div>

            <figure className={styles.capture}>
                <a
                    href="https://app.openadapt.ai/demo/qualification-judgment"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open the interactive qualification judgment demo"
                >
                    <Image
                        src="/qualification-judgment/judgment-capture-human-node.png"
                        alt="Mobile qualification screen that retains an insurance exception as an authorized human decision node"
                        width={860}
                        height={3162}
                        sizes="(max-width: 760px) 88vw, 390px"
                    />
                </a>
                <figcaption>
                    Canonical synthetic capture from the interactive qualification authoring demo.
                </figcaption>
            </figure>
        </section>
    )
}
