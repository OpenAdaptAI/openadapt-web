import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows, faApple, faLinux, faPython } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faCheck, faTerminal, faDownload } from '@fortawesome/free-solid-svg-icons';
import styles from './InstallSection.module.css';
import { getPyPIDownloadStats, formatDownloadCount } from 'utils/pypiStats';

const platforms = {
    'macOS': {
        icon: faApple,
        commands: [
            'curl -LsSf https://astral.sh/uv/install.sh | sh',
            'uv tool install openadapt',
            'openadapt --help'
        ],
        note: 'Works on Intel and Apple Silicon Macs'
    },
    'Linux': {
        icon: faLinux,
        commands: [
            'curl -LsSf https://astral.sh/uv/install.sh | sh',
            'uv tool install openadapt',
            'openadapt --help'
        ],
        note: 'Works on most modern Linux distributions'
    },
    'Windows': {
        icon: faWindows,
        commands: [
            'powershell -c "irm https://astral.sh/uv/install.ps1 | iex"',
            'uv tool install openadapt',
            'openadapt --help'
        ],
        note: 'Run in PowerShell (not Command Prompt)'
    }
};

function CopyButton({ text, className }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
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
    const [pypiStats, setPypiStats] = useState({ total: 0, packages: {} });

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

        // Fetch PyPI download stats
        getPyPIDownloadStats().then(stats => {
            setPypiStats(stats);
        });
    }, []);

    const currentPlatform = platforms[selectedPlatform];
    const allCommands = currentPlatform.commands.join('\n');

    return (
        <div className={styles.installSection}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={faTerminal} className={styles.terminalIcon} />
                <h3 className={styles.title}>Install in 30 seconds</h3>
            </div>

            <p className={styles.subtitle}>
                One command installs everything you need. No Python setup required.
            </p>

            {/* PyPI Download Stats */}
            {pypiStats.total > 0 && (
                <div className={styles.pypiStats}>
                    <FontAwesomeIcon icon={faPython} className={styles.pypiIcon} />
                    <span className={styles.pypiCount}>
                        {formatDownloadCount(pypiStats.total)}
                    </span>
                    <span className={styles.pypiLabel}>
                        installs this month (all packages)
                    </span>
                </div>
            )}

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

            {/* Code Block */}
            <div className={styles.codeContainer}>
                <div className={styles.codeHeader}>
                    <span className={styles.codeTitle}>Terminal</span>
                    <CopyButton text={allCommands} />
                </div>
                <pre className={styles.codeBlock}>
                    {currentPlatform.commands.map((cmd, index) => (
                        <div key={index} className={styles.commandLine}>
                            <span className={styles.prompt}>$</span>
                            <code className={styles.command}>{cmd}</code>
                        </div>
                    ))}
                </pre>
                <div className={styles.codeFooter}>
                    <span className={styles.note}>{currentPlatform.note}</span>
                </div>
            </div>

            {/* What is uv? */}
            <div className={styles.uvInfo}>
                <p>
                    <a
                        href="https://docs.astral.sh/uv/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.uvLink}
                    >
                        What is uv?
                    </a>
                    {' '}- uv is a fast Python package manager that automatically installs Python and manages dependencies.
                </p>
            </div>

            {/* Quick Start: the full loop */}
            <div className={styles.quickStart}>
                <h4 className={styles.quickStartTitle}>
                    The full loop, in five commands
                </h4>
                <p className={styles.note} style={{ marginBottom: '0.75rem' }}>
                    Try record → compile → replay → heal right now against the
                    bundled demo app. No account, no cloud, nothing leaves
                    your machine.
                </p>
                <div className={styles.commandGrid}>
                    <div className={styles.commandItem}>
                        <code>
                            pip install openadapt-flow && playwright install
                            chromium
                        </code>
                        <span>Install the demonstration compiler</span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>openadapt-flow demo-record --out rec</code>
                        <span>Record a demonstration</span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>
                            openadapt-flow compile rec --out bundle --name
                            my-task
                        </code>
                        <span>Compile it into an editable workflow</span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>openadapt-flow replay bundle</code>
                        <span>Replay: local, with zero model calls</span>
                    </div>
                    <div className={styles.commandItem}>
                        <code>openadapt-flow replay bundle --drift theme</code>
                        <span>Drift the UI and watch it heal itself</span>
                    </div>
                </div>
                <p className={styles.note} style={{ marginTop: '0.75rem' }}>
                    Every replay writes an illustrated run report: what ran,
                    what it saw, what healed. Source on{' '}
                    <a
                        href="https://github.com/OpenAdaptAI/openadapt-flow"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'underline' }}
                    >
                        GitHub
                    </a>
                    . Running this on your own desktop workflows in a regulated
                    environment?{' '}
                    <a href="#book" style={{ textDecoration: 'underline' }}>
                        Book a demo
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
