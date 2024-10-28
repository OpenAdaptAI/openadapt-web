import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows, faApple } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import styles from './Developers.module.css';
import { getReleasesDownloadCount } from 'utils/githubStats';
import EmailForm from '@components/EmailForm';
import { Bounties } from '@components/Bounties';
import DownloadGraph from './DownloadGraph';

export default function Developers() {
    const [latestRelease, setLatestRelease] = useState({ version: null, date: null });
    const [downloadCount, setDownloadCount] = useState({ windows: 0, mac: 0 });
    const [buildWarnings, setBuildWarnings] = useState([]);
    const macURL = latestRelease.version
        ? `https://github.com/OpenAdaptAI/OpenAdapt/releases/download/${latestRelease.version}/OpenAdapt-${latestRelease.version}.dmg`
        : '';
    const windowsURL = latestRelease.version
        ? `https://github.com/OpenAdaptAI/OpenAdapt/releases/download/${latestRelease.version}/OpenAdapt_Installer-${latestRelease.version}.exe`
        : '';

    useEffect(() => {
        // Fetch the latest release information
        fetch('https://api.github.com/repos/OpenAdaptAI/OpenAdapt/releases/latest')
            .then(response => response.json())
            .then(data => {
                const releaseDate = new Date(data.published_at).toLocaleString('en-US', {
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                    hour12: false, timeZoneName: 'short'
                });
                setLatestRelease({
                    version: data.name,
                    date: releaseDate
                });
            });

        // Fetch download counts
        getReleasesDownloadCount().then(({ windowsDownloadCount, macDownloadCount }) => {
            setDownloadCount({
                windows: windowsDownloadCount,
                mac: macDownloadCount,
            });
            console.log("Download counts:", { windowsDownloadCount, macDownloadCount });
        });

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

    const handleDownloadClick = (os, url) => {
        const fileName = url.split('/').pop();
        window.gtag('event', 'download_start', {
            event_category: 'Software Downloads',
            event_action: `Download Initiated ${os}`,
            event_label: fileName,
            value: 1
        });
        downloadFile(url, os, fileName);
    }

    const downloadFile = async (url, os, fileName) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                window.gtag('event', 'download_success', {
                    event_category: 'Software Downloads',
                    event_action: `Download Successful ${os}`,
                    event_label: fileName,
                    value: 1
                });
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Download failed:', error);
            window.gtag('event', 'download_failure', {
                event_category: 'Software Downloads',
                event_action: `Download Failed ${os}`,
                event_label: fileName,
                value: 0
            });
        }
    }
    
    return (
        <div className={styles.row} id="start">
            <div className="relative flex items-center justify-center mx-20 md-12">
                <div className="grid grid-cols-1 break-words">
                    {buildWarnings.length > 0 && (
                        <div className="bg-yellow-600 text-white text-center p-4">
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
                    {/* Remaining JSX unchanged */}
                </div>
            </div>
        </div>
    )
}
