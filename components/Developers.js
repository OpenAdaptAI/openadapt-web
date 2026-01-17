import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows, faApple } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import styles from './Developers.module.css';
import { getReleasesDownloadCount } from 'utils/githubStats';
import EmailForm from '@components/EmailForm';
import InstallSection from '@components/InstallSection';
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
                    <h2 id="start" className="text-2xl mt-10 mb-5 font-light text-center">
                        Getting Started
                    </h2>
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
                    <p className="font-light mt-3 mb-6 mx-auto text-center max-w-2xl">
                        OpenAdapt is an open-source platform for GUI automation with ML.
                        Record human demonstrations, train models, and deploy agents that can operate any software.
                    </p>

                    {/* New uv-first Installation Section */}
                    <InstallSection />

                    {/* Desktop App Downloads (keep existing buttons) */}
                    <div className="mt-12">
                        <h3 className="text-xl font-light text-center mb-4">
                            Or Download Desktop App
                        </h3>
                        {latestRelease.version && (
                            <div className="text-center mb-4">
                                <div className="inline-block bg-transparent p-3 shadow-lg rounded-lg">
                                    <table className="table-auto border-separate border-spacing-y-2">
                                        <tbody>
                                            <tr>
                                                <td className="bg-gray-800 px-4 py-2 rounded-l text-sm font-semibold text-white w-40 border-r border-gray-800">Current Version:</td>
                                                <td className="bg-white bg-opacity-50 px-4 py-2 rounded-r text-lg font-bold text-white border-l border-transparent">{latestRelease.version}</td>
                                            </tr>
                                            <tr className="mt-2">
                                                <td className="bg-gray-800 px-4 py-2 rounded-l text-sm font-semibold text-white w-40 border-r border-gray-800">Released on:</td>
                                                <td className="bg-white bg-opacity-50 px-4 py-2 rounded-r text-lg text-white border-l border-transparent">{latestRelease.date}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-10 justify-center items-center sm:flex-row">
                            <Link
                                className="w-fit flex flex-col gap-y-6 h-fit btn btn-primary hover:no-underline mb-6 py-8"
                                href={windowsURL}
                                onClick={() => handleDownloadClick('Windows', windowsURL)}
                            >
                                <FontAwesomeIcon
                                    icon={faWindows}
                                    className="text-[96px]"
                                />
                                <span className="text-2xl">
                                    Download for Windows
                                </span>
                                {downloadCount.windows > 0 && (
                                    <span className="text-lg">
                                        {downloadCount.windows} downloads
                                    </span>
                                )}
                            </Link>
                            <Link
                                className="px-8 w-fit flex flex-col gap-y-6 h-fit btn btn-primary hover:no-underline mb-6 py-8 sm:px-6"
                                href={macURL}
                                onClick={() => handleDownloadClick('MacOS', macURL)}
                            >
                                <FontAwesomeIcon
                                    icon={faApple}
                                    style={{ fontSize: 96 }}
                                />
                                <span className="text-2xl">Download for MacOS</span>
                                {downloadCount.mac > 0 && (
                                    <span className="text-lg">
                                        {downloadCount.mac} downloads
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    <DownloadGraph />
                    <EmailForm />

                    <h2 className="text-2xl mt-10 font-light text-center">What's Next?</h2>
                    <ul className={`${styles.noBullets} mt-2 font-light text-center`}>
                        <li className="mt-2 font-light">
                            <a
                                className="font-medium hover:underline"
                                href="https://discord.gg/yF527cQbDG"
                                style={{
                                    color: '#FFF',
                                    backgroundColor: '#560DF8',
                                    padding: '10px',
                                    display: 'inline-block',
                                    margin: '5px',
                                }}
                            >
                                Join our Discord
                            </a>
                        </li>
                        <li className="mt-2 font-light">
                            <a
                                className="font-medium hover:underline"
                                href="https://github.com/OpenAdaptAI/OpenAdapt#usage"
                                style={{
                                    color: '#FFF',
                                    backgroundColor: '#560DF8',
                                    padding: '10px',
                                    display: 'inline-block',
                                    margin: '5px',
                                }}
                            >
                                Read our Usage Instructions on GitHub
                            </a>
                        </li>
                    </ul>
                    <h2 className="text-2xl mt-10 font-light text-center">
                        Troubleshooting
                    </h2>
                    <ul className={`${styles.noBullets} mt-2 font-light text-center`}>
                        <li className="mt-2 font-light">
                            <a
                                className="font-medium hover:underline"
                                href="https://github.com/OpenAdaptAI/OpenAdapt/issues/new/choose"
                                style={{
                                    color: '#FFF',
                                    backgroundColor: '#560DF8',
                                    padding: '10px',
                                    display: 'inline-block',
                                    margin: '5px',
                                }}
                            >
                                Please submit a GitHub Issue
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
