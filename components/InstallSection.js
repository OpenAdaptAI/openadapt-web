import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows, faApple, faLinux, faPython } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faCheck, faTerminal, faDownload, faRocket, faBolt, faEye, faPlay, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import styles from './InstallSection.module.css';
import { getPyPIDownloadStats, formatDownloadCount } from 'utils/pypiStats';

// One-liner install command (inspired by clawd.bot)
const ONE_LINER = 'curl -fsSL https://openadapt.ai/install.sh | bash';
const ONE_LINER_WINDOWS = 'irm https://openadapt.ai/install.ps1 | iex';

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

    const isWindows = selectedPlatform === 'Windows';
    const oneLiner = isWindows ? ONE_LINER_WINDOWS : ONE_LINER;

    return (
        <div className={styles.installSection}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={faRocket} className={styles.terminalIcon} />
                <h3 className={styles.title}>Install in 30 Seconds</h3>
            </div>

            {/* One-Liner Hero Section - inspired by clawd.bot */}
            <div className={styles.oneLinerSection}>
                <p className={styles.oneLinerTagline}>
                    Works everywhere. Installs everything. You're welcome.
                </p>
                <div className={styles.oneLinerContainer}>
                    <div className={styles.oneLinerCode}>
                        <span className={styles.oneLinerComment}># {isWindows ? 'Run in PowerShell' : 'macOS / Linux / WSL'}</span>
                        <code className={styles.oneLinerCommand}>{oneLiner}</code>
                    </div>
                    <CopyButton text={oneLiner} className={styles.oneLinerCopyBtn} />
                </div>
                <p className={styles.oneLinerNote}>
                    Installs uv, Python 3.11, and OpenAdapt CLI automatically
                </p>
            </div>

            <div className={styles.dividerOr}>
                <span>or install manually</span>
            </div>

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

            {/* Quick Start Commands */}
            <div className={styles.quickStart}>
                <h4 className={styles.quickStartTitle}>Quick Start Commands</h4>
                <div className={styles.commandGrid}>
                    <div className={styles.commandItem}>
                        <div className={styles.commandIcon}>
                            <FontAwesomeIcon icon={faPlay} />
                        </div>
                        <div className={styles.commandContent}>
                            <code>openadapt record --name invoice-task</code>
                            <span>Record a demonstration</span>
                        </div>
                    </div>
                    <div className={styles.commandItem}>
                        <div className={styles.commandIcon}>
                            <FontAwesomeIcon icon={faEye} />
                        </div>
                        <div className={styles.commandContent}>
                            <code>openadapt view invoice-task</code>
                            <span>Review and annotate</span>
                        </div>
                    </div>
                    <div className={styles.commandItem}>
                        <div className={styles.commandIcon}>
                            <FontAwesomeIcon icon={faGraduationCap} />
                        </div>
                        <div className={styles.commandContent}>
                            <code>openadapt replay invoice-task</code>
                            <span>Replay with AI assistance</span>
                        </div>
                    </div>
                    <div className={styles.commandItem}>
                        <div className={styles.commandIcon}>
                            <FontAwesomeIcon icon={faBolt} />
                        </div>
                        <div className={styles.commandContent}>
                            <code>openadapt doctor</code>
                            <span>Check system setup</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
