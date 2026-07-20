import Clip from './Clip'
import processStyles from './HowItWorks.module.css'
import panelStyles from './LendingWorkflowDemo.module.css'
import styles from './HomeReferenceWorkflow.module.css'
import { HOME_REFERENCES } from '../data/referenceWorkflows'

// Homepage process / "reference workflow" section. The selected vertical is
// LIFTED to pages/index.js so this section and the "More reference workflows"
// list share ONE selection: picking a vertical here updates the list, and
// picking one in the list updates this section.
//
// The animated footage keeps the #213/#214 behavior: each stage clip is an
// <img> pointed directly at the looping GIF (via <Clip>), and every stage is
// keyed by the selected vertical so switching restarts the footage from its
// first frame. Reduced-motion handling lives in the GIF assets and the shared
// Clip styling, exactly as on the solution pages — no bespoke play/pause
// control is reintroduced here.

function CompilePanel({ compile }) {
    return (
        <figure className={panelStyles.evidenceFigure}>
            <div className={panelStyles.panelHeader}>
                <span>workflow.json</span>
                <span className={panelStyles.status}>compiled</span>
            </div>
            <dl className={panelStyles.contract}>
                <div>
                    <dt>workflow</dt>
                    <dd>{compile.workflow}</dd>
                </div>
                <div>
                    <dt>parameters</dt>
                    <dd>{compile.parameters}</dd>
                </div>
                <div>
                    <dt>target</dt>
                    <dd>{compile.target}</dd>
                </div>
                <div>
                    <dt>effect</dt>
                    <dd>{compile.effect}</dd>
                </div>
                <div>
                    <dt>healthy run</dt>
                    <dd>{compile.healthy}</dd>
                </div>
            </dl>
            <figcaption className={panelStyles.caption}>
                Compile: inspectable task contract derived from the recorded
                synthetic workflow
            </figcaption>
        </figure>
    )
}

function VerificationPanel({ verify }) {
    return (
        <figure className={panelStyles.evidenceFigure}>
            <div className={panelStyles.panelHeader}>
                <span>{verify.heading}</span>
                <span
                    className={
                        verify.qualified
                            ? panelStyles.status
                            : styles.statusAttention
                    }
                >
                    {verify.qualified ? 'verified' : 'qualification required'}
                </span>
            </div>
            <ul className={panelStyles.checks}>
                {verify.checks.map(([label, value]) => (
                    <li key={label}>
                        <span
                            className={
                                verify.qualified
                                    ? panelStyles.checkmark
                                    : styles.pendingMark
                            }
                            aria-hidden="true"
                        >
                            {verify.qualified ? '✓' : '•'}
                        </span>
                        <span>
                            <strong>{label}</strong>
                            <small>{value}</small>
                        </span>
                    </li>
                ))}
            </ul>
            <div className={panelStyles.metrics}>
                {verify.metrics.map((metric) => (
                    <span key={metric}>{metric}</span>
                ))}
            </div>
            <figcaption className={panelStyles.caption}>
                {verify.caption}
            </figcaption>
        </figure>
    )
}

export default function HomeReferenceWorkflow({ vertical, onSelectVertical }) {
    const reference =
        HOME_REFERENCES.find((item) => item.key === vertical) ||
        HOME_REFERENCES[0]

    const steps = [
        {
            number: '1.0',
            name: 'Demonstrate',
            description:
                'Complete one bounded, synthetic instance while OpenAdapt captures the browser evidence and input events.',
            visual: (
                <Clip
                    key={`${reference.key}-record`}
                    clip={reference.record}
                />
            ),
        },
        {
            number: '2.0',
            name: 'Compile',
            description:
                'Turn the demonstration into a parameterized, inspectable workflow with a declared business effect.',
            visual: (
                <CompilePanel
                    key={`${reference.key}-compile`}
                    compile={reference.compile}
                />
            ),
        },
        {
            number: '3.0',
            name: 'Replay',
            description:
                'Execute the compiled steps locally without asking a model to reinterpret the task.',
            visual: (
                <Clip
                    key={`${reference.key}-replay`}
                    clip={reference.replay}
                />
            ),
        },
        {
            number: '4.0',
            name: reference.verify.qualified
                ? 'Verify the write'
                : 'Qualify the effect',
            description: reference.verify.qualified
                ? 'Check the saved record through a separately authenticated read-only session and a direct database delta audit.'
                : 'Gate execution on a deployment-specific effect oracle and configured identity policy before any correctness claim.',
            visual: (
                <VerificationPanel
                    key={`${reference.key}-verify`}
                    verify={reference.verify}
                />
            ),
        },
    ]

    return (
        <section
            data-testid="home-reference-workflow"
            data-reference={reference.key}
            className={processStyles.section}
        >
            <div className={processStyles.inner}>
                <p className={processStyles.eyebrow}>{reference.eyebrow}</p>
                <h2 className={processStyles.heading}>{reference.heading}</h2>
                <p className={processStyles.subheading}>
                    {reference.subheading}
                </p>

                <div className={processStyles.references}>
                    <div className={processStyles.selectorBlock}>
                        <p className={processStyles.referenceLabel}>
                            Reference workflow
                        </p>
                        <div
                            className={processStyles.tabs}
                            role="group"
                            aria-label="Reference workflow vertical"
                        >
                            {HOME_REFERENCES.map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    className={processStyles.tab}
                                    aria-pressed={item.key === reference.key}
                                    data-testid={`home-reference-tab-${item.key}`}
                                    onClick={() => onSelectVertical(item.key)}
                                >
                                    <span>{item.label}</span>
                                    <small>{item.application}</small>
                                </button>
                            ))}
                        </div>
                        <p className={styles.selectorNote}>
                            Each reference is a bounded, synthetic fixture with
                            its own honest evidence and caveats.
                        </p>
                    </div>
                </div>

                <ol className={processStyles.steps}>
                    {steps.map((step) => (
                        <li key={step.number} className={processStyles.step}>
                            <div className={processStyles.copy}>
                                <span className={processStyles.number}>
                                    {step.number}
                                </span>
                                <div className={processStyles.body}>
                                    <h3 className={processStyles.name}>
                                        {step.name}
                                    </h3>
                                    <p className={processStyles.description}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                            <div className={processStyles.clip}>
                                {step.visual}
                            </div>
                        </li>
                    ))}
                </ol>

                <div className={panelStyles.disclosure}>
                    <p>{reference.disclosure.text}</p>
                    <a href={reference.disclosure.linkHref}>
                        {reference.disclosure.linkLabel}
                    </a>
                </div>
            </div>
        </section>
    )
}
