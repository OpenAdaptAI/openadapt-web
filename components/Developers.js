import React, { useEffect, useState } from 'react';
import styles from './Developers.module.css';
import InstallSection from '@components/InstallSection';
import PyPIDownloadChart from './PyPIDownloadChart';

const ecosystemLinks = [
    {
        label: 'All repositories',
        href: 'https://github.com/OpenAdaptAI',
    },
    {
        label: 'openadapt-flow',
        href: 'https://github.com/OpenAdaptAI/openadapt-flow',
    },
    {
        label: 'Docs',
        href: 'https://docs.openadapt.ai',
    },
    {
        label: 'Blog',
        href: 'https://blog.openadapt.ai',
    },
    {
        label: 'Discord',
        href: 'https://discord.gg/yF527cQbDG',
    },
    {
        label: 'Report an issue',
        href: 'https://github.com/OpenAdaptAI/OpenAdapt/issues/new/choose',
    },
];

export default function Developers() {
    const [buildWarnings, setBuildWarnings] = useState([]);

    useEffect(() => {
        // Fetch issues labeled "main-broken"
        fetch('https://api.github.com/repos/OpenAdaptAI/OpenAdapt/issues?state=open&labels=main-broken')
            .then(response => response.json())
            .then(issues => {
                setBuildWarnings(issues.map(issue => ({
                    id: issue.number,
                    url: issue.html_url
                })));
            });
    }, []);

    return (
        <div className={styles.row} id="open-source">
            {/* Legacy anchors kept for existing inbound links */}
            <span id="start" />
            <span id="developers" />
            <div className="relative flex items-center justify-center mx-4 sm:mx-8 md:mx-12 lg:mx-20 max-w-5xl">
                <div className="grid grid-cols-1 break-words w-full">
                    <p className="eyebrow text-center mt-8 mb-2">Open source</p>
                    <h2 className="font-display text-xl mb-4 font-semibold text-center tracking-tight text-ink">
                        MIT licensed. Install it and read the code.
                    </h2>
                    {buildWarnings.length > 0 && (
                        <div className="bg-amber-100 border border-amber-700/40 text-amber-900 text-center p-4 rounded-lg">
                            Warning: The current version has a known issue{buildWarnings.length > 1 ? 's' : ''}:
                            {buildWarnings.map((issue, index) => (
                                <React.Fragment key={issue.id}>
                                    {index > 0 && ', '}
                                    <a
                                        href={issue.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        #{issue.id}
                                    </a>
                                </React.Fragment>
                            ))}
                            . Please check back later for updates.
                        </div>
                    )}
                    <p className="mt-2 mb-6 mx-auto text-center max-w-2xl text-sm text-ink-2">
                        OpenAdapt is an open-source demonstration compiler for desktop automation.
                        Record a workflow once and it compiles into a self-healing automation that runs on your own machines with no per-run model calls.
                    </p>

                    {/* uv-first Installation Section */}
                    <InstallSection />

                    {/* PyPI Download Statistics */}
                    <PyPIDownloadChart />

                    <div className="mt-8 mb-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
                        {ecosystemLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
