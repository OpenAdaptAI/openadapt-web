import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows, faApple, faLinux } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faCheck, faTerminal } from '@fortawesome/free-solid-svg-icons';
import styles from './InstallSection.module.css';
import { track, EVENTS } from 'utils/analytics';

// One self-contained line, Homebrew-style. The hosted install script
// (public/install.sh, served at openadapt.ai/install.sh) bootstraps uv if
// it's missing, then installs OpenAdapt as a persistent `openadapt` command —
// so there's no separate "install uv first" step to show.
const platforms = {
    'macOS': {
        icon: faApple,
        install: 'curl -fsSL https://openadapt.ai/install.sh | sh',
        script: '/install.sh',
        note: 'Intel and Apple Silicon Macs',
    },
    'Linux': {
        icon: faLinux,
        install: 'curl -fsSL https://openadapt.ai/install.sh | sh',
        script: '/install.sh',
        note: 'Most modern Linux distributions',
    },
    'Windows': {
        icon: faWindows,
        install: 'powershell -c "irm https://openadapt.ai/install.ps1 | iex"',
        script: '/install.ps1',
        note: 'Run in PowerShell (not Command Prompt)',
    },
};

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
    const [selectedPlatform, setSelectedPlatform] = useState('macOS');
    const [detectedPlatform, setDetectedPlatform] = useState(null);

    useEffect(() => {
        // Auto-detect platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.includes('win')) {
            setSelectedPlatform('Windows');
            setDetectedPlatform('Windows');
        } else if (userAgent.includes('mac')) {
            setSelectedPlatform('macOS');
            setDetectedPlatform('macOS');
        } else if (userAgent.includes('linux')) {
            setSelectedPlatform('Linux');
            setDetectedPlatform('Linux');
        }

    }, []);

    const currentPlatform = platforms[selectedPlatform];

    return (
        <div className={styles.installSection}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={faTerminal} className={styles.terminalIcon} />
                <h3 className={styles.title}>Install the browser workflow CLI</h3>
            </div>

            <p className={styles.subtitle}>
                One command installs the OpenAdapt launcher and governed compiler.
                No account or hosted service is required.
            </p>

            {/* Platform Tabs */}
            <div className={styles.platformTabs}>
                {Object.entries(platforms).map(([name, platform]) => (
                    <button
                        key={name}
                        onClick={() => setSelectedPlatform(name)}
                        className={`${styles.platformTab} ${selectedPlatform === name ? styles.activeTab : ''}`}
                    >
                        <FontAwesomeIcon icon={platform.icon} className={styles.platformIcon} />
                        <span>{name}</span>
                        {detectedPlatform === name && (
                            <span className={styles.detectedBadge}>detected</span>
                        )}
                    </button>
                ))}
            </div>

            {/* One self-contained line (Homebrew-style) */}
            <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                    <span className={styles.codeTitle}>Install</span>
                    <CopyButton
                        text={currentPlatform.install}
                        onCopied={() =>
                            track(EVENTS.INSTALL_COMMAND_COPIED, {
                                platform: selectedPlatform,
                            })
                        }
                    />
                </div>
                <pre className={styles.codeBlock}>
                    <div className={styles.commandLine}>
                        <span className={styles.prompt}>$</span>
                        <code className={styles.command}>
                            {currentPlatform.install}
                        </code>
                    </div>
                </pre>
                <div className={styles.codeFooter}>
                    <span className={styles.note}>
                        Installs uv and OpenAdapt, then the compiler is available
                        under <code>openadapt flow</code>. {currentPlatform.note}.
                        These platform tabs describe the CLI and browser path,
                        not validated native desktop automation.{' '}
                        <a
                            href={currentPlatform.script}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.uvLink}
                        >
                            View the script
                        </a>
                    </span>
                </div>
            </div>

            {/* Quick Start: the full loop */}
            <div className={styles.quickStart}>
                <h4 className={styles.quickStartTitle}>
                    The end-to-end browser loop
                </h4>
                <p className={styles.note} style={{ marginBottom: '0.75rem' }}>
                    Try the whole loop right now against the
                    bundled demo app: record, compile, inspect, certify, replay,
                    and induce known test drift. No account or cloud service. Once it is
                    installed, your workflow data stays on your machine. One
                    heads-up on first run: the first <code>demo-record</code> or{' '}
                    <code>replay</code> downloads a bundled Chromium (~150&nbsp;MB)
                    once, so that step takes a few minutes, and on Linux you may
                    need <code>playwright install-deps</code> first.
                </p>
                <div className={styles.commandGrid}>
                    <div className={styles.commandItem}>
                        <code>
                            curl -fsSL https://openadapt.ai/install.sh | sh
                        </code>
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
                    <div className={styles.commandItem}>
                        <code>
                            openadapt flow certify bundle --policy clinical-write
                        </code>
                        <span>Enforce a policy before deployment</span>
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
                        <code>uv tool uninstall openadapt</code>
                        <span>Remove the launcher when you are finished</span>
                    </div>
                </div>
                <p className={styles.note} style={{ marginTop: '0.75rem' }}>
                    Every replay writes a step-by-step run report: what ran,
                    what it saw, what re-resolved, and what halted. The
                    browser path is the only shipped end-to-end backend today.
                    Source and measured limits on{' '}
                    <a
                        href="https://github.com/OpenAdaptAI/openadapt-flow"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'underline' }}
                    >
                        openadapt-flow
                    </a>
                    . Evaluating a regulated workflow?{' '}
                    <a href="#book" style={{ textDecoration: 'underline' }}>
                        Book a demo
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
