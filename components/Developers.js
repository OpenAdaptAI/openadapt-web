import React from 'react';
import styles from './Developers.module.css';
import InstallSection from '@components/InstallSection';
import PyPIDownloadChart from './PyPIDownloadChart';
import { BLOG_LINK, DEVELOPER_LINKS } from 'data/developerLinks';

// Canonical hrefs live in data/developerLinks.js (shared with the nav
// "Developers" dropdown). Keep the historical on-page order: compiler/runtime
// source, Docs, Technical paper source, Blog, Discord, Report an issue.
const ecosystemLinks = [
    ...DEVELOPER_LINKS.slice(0, 3),
    BLOG_LINK,
    ...DEVELOPER_LINKS.slice(3),
];

export default function Developers({ buildWarnings = [], githubStats = null }) {
    // Known engine breakage (open main-broken issues) and GitHub social
    // proof arrive server-rendered from the page's getStaticProps; the
    // visitor's browser never calls api.github.com.
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
                        <code>pip install openadapt</code> is the stable
                        end-user entry point. The <code>openadapt-flow</code>{' '}
                        engine records a workflow, compiles it into a
                        reviewable program, and replays it locally with no model
                        calls on a healthy run.
                    </p>

                    {/* uv-first Installation Section */}
                    <InstallSection />

                    {/* PyPI Download Statistics */}
                    <PyPIDownloadChart githubStats={githubStats} />

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
