import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faTerminal } from '@fortawesome/free-solid-svg-icons';
import styles from './InstallSection.module.css';
import { track, EVENTS } from 'utils/analytics';

const INSTALL_COMMAND = 'pip install openadapt';

function CopyButton({ text, className, onCopied }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            if (onCopied) onCopied();
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`${styles.copyButton} ${className || ''}`}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
            <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
    );
}

export default function InstallSection() {
    return (
        <div
            className={styles.installSection}
            data-testid="local-quickstart"
        >
            <div className={styles.header}>
                <FontAwesomeIcon icon={faTerminal} className={styles.terminalIcon} />
                <h3 className={styles.title}>Install the OpenAdapt workflow CLI</h3>
            </div>

            <p className={styles.subtitle}>
                One command installs the OpenAdapt launcher and governed
                workflow compiler. The same CLI records, compiles, and replays
                across browser, Windows, macOS, RDP, and Citrix &mdash; browser
                is the path proven end to end today. No account or hosted
                service is required.
            </p>

            <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                    <span className={styles.codeTitle}>Install</span>
                    <CopyButton
                        text={INSTALL_COMMAND}
                        onCopied={() =>
                            track(EVENTS.INSTALL_COMMAND_COPIED, {
                                package: 'openadapt',
                            })
                        }
                    />
                </div>
                <pre className={styles.codeBlock}>
                    <div className={styles.commandLine}>
                        <span className={styles.prompt}>$</span>
                        <code className={styles.command}>
                            {INSTALL_COMMAND}
                        </code>
                    </div>
                </pre>
                <div className={styles.codeFooter}>
                    <span className={styles.note}>
                        Installs the OpenAdapt launcher and compiler for Python
                        3.10+ on Windows, macOS, or Linux. Run the engine under{' '}
                        <code>openadapt flow</code>. For isolated command-line
                        installs, the docs also cover <code>uv tool</code>.{' '}
                        <a
                            href="https://docs.openadapt.ai/get-started/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.uvLink}
                        >
                            Read docs
                        </a>
                    </span>
                </div>
            </div>

            {/* Quick Start: the full loop */}
            <div className={styles.quickStart}>
                <h4 className={styles.quickStartTitle}>
                    The end-to-end workflow loop
                </h4>
                <p className={styles.note} style={{ marginBottom: '0.75rem' }}>
                    Try the whole loop right now against the bundled demo app,
                    which runs in the browser &mdash; the substrate proven end to
                    end today: record, compile, inspect, certify, replay,
                    and induce known test drift. No account or cloud service. Once it is
                    installed, your workflow data stays on your machine. One
                    heads-up on first run: the first <code>demo-record</code> or{' '}
                    <code>replay</code> downloads a bundled Chromium (~150&nbsp;MB)
                    once, so that step takes a few minutes, and on Linux you may
                    need <code>playwright install-deps</code> first.
                </p>
                <div className={styles.commandGrid}>
                    <div className={styles.commandItem}>
                        <code>pip install openadapt</code>
                        <span>Install OpenAdapt</span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>openadapt flow demo-record --out rec</code>
                        <span>Record yourself doing the task</span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>
                            openadapt flow compile rec --out bundle --name
                            my-task
                        </code>
                        <span>Turn the recording into a workflow</span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>openadapt flow lint bundle</code>
                        <span>Inspect identity, assertion, and risk coverage gaps</span>
                    </div>
                    <div
                        className={`${styles.commandItem} ${styles.commandItemHalt}`}
                    >
                        <code>
                            openadapt flow certify bundle --policy clinical-write
                        </code>
                        <span>
                            The clinical gate refuses this demo bundle and
                            exits non-zero — on purpose. Safeguards refuse
                            instead of guessing. Re-run with{' '}
                            <code>--policy permissive</code> to see a clean
                            pass.
                        </span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>openadapt flow replay bundle</code>
                        <span>Replay it locally, with zero AI calls</span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>openadapt flow replay bundle --drift theme</code>
                        <span>Exercise deterministic re-resolution on bundled test drift</span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>pip uninstall openadapt</code>
                        <span>Remove the launcher when you are finished</span>
                    </div>
                </div>
                <p className={styles.note} style={{ marginTop: '0.75rem' }}>
                    Every replay writes a step-by-step run report: what ran,
                    what it saw, what re-resolved, and what halted.
                    Compiler/runtime source and measured limits are in{' '}
                    <a
                        href="https://github.com/OpenAdaptAI/openadapt-flow"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'underline' }}
                    >
                        the openadapt-flow engine
                    </a>
                    . Evaluating a regulated workflow?{' '}
                    <a href="#book" style={{ textDecoration: 'underline' }}>
                        Evaluate a workflow
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
