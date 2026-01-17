import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faChartLine, faArrowTrendUp, faArrowTrendDown, faMinus, faStar, faDownload, faCalendarDay, faCalendarWeek, faCube, faTrophy, faLink } from '@fortawesome/free-solid-svg-icons';
import {
    getPyPIDownloadHistoryLimited,
    formatDate,
    calculateGrowthStats,
    getRecentDownloadStats,
    getGitHubStats,
} from 'utils/pypistatsHistory';
import { formatDownloadCount } from 'utils/pypiStats';
import { getPackageVersionHistory, getVersionReleasedOnDate, getVersionForDate } from 'utils/pypiVersions';
import styles from './PyPIDownloadChart.module.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Color palette for different packages
const packageColors = {
    'openadapt': {
        border: 'rgb(86, 13, 248)',
        background: 'rgba(86, 13, 248, 0.2)',
    },
    'openadapt-ml': {
        border: 'rgb(52, 152, 219)',
        background: 'rgba(52, 152, 219, 0.2)',
    },
    'openadapt-capture': {
        border: 'rgb(46, 204, 113)',
        background: 'rgba(46, 204, 113, 0.2)',
    },
    'openadapt-evals': {
        border: 'rgb(241, 196, 15)',
        background: 'rgba(241, 196, 15, 0.2)',
    },
    'openadapt-viewer': {
        border: 'rgb(231, 76, 60)',
        background: 'rgba(231, 76, 60, 0.2)',
    },
    'openadapt-grounding': {
        border: 'rgb(155, 89, 182)',
        background: 'rgba(155, 89, 182, 0.2)',
    },
    'openadapt-retrieval': {
        border: 'rgb(26, 188, 156)',
        background: 'rgba(26, 188, 156, 0.2)',
    },
    'openadapt-privacy': {
        border: 'rgb(230, 126, 34)',
        background: 'rgba(230, 126, 34, 0.2)',
    },
    'openadapt-tray': {
        border: 'rgb(149, 165, 166)',
        background: 'rgba(149, 165, 166, 0.2)',
    },
    'openadapt-telemetry': {
        border: 'rgb(52, 73, 94)',
        background: 'rgba(52, 73, 94, 0.2)',
    },
    // 'openadapt-agent': {
    //     border: 'rgb(255, 99, 132)',
    //     background: 'rgba(255, 99, 132, 0.2)',
    // },
    'combined': {
        border: 'rgb(96, 165, 250)',
        background: 'rgba(96, 165, 250, 0.3)',
    },
};

const PyPIDownloadChart = () => {
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('cumulative'); // 'cumulative', 'combined', or 'packages'
    const [period, setPeriod] = useState('month');
    const [timeRange, setTimeRange] = useState('all'); // '2y' for 2 years, 'all' for all time
    const [growthStats, setGrowthStats] = useState(null);
    const [recentStats, setRecentStats] = useState(null);
    const [githubStats, setGithubStats] = useState(null);
    const [versionHistory, setVersionHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Determine limit based on time range
                let limit;
                if (timeRange === 'all') {
                    limit = 9999; // Effectively unlimited - get all available data
                } else {
                    // 2 years worth of data
                    limit = period === 'day' ? 730 : period === 'week' ? 104 : 24;
                }
                const data = await getPyPIDownloadHistoryLimited(period, limit);

                if (!data.combined || data.combined.length === 0) {
                    setError('No download data available');
                    setHistoryData(null);
                } else {
                    setHistoryData(data);
                    setGrowthStats(calculateGrowthStats(data.combined));
                }
            } catch (err) {
                console.error('Error fetching PyPI history:', err);
                setError('Failed to load download statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period, timeRange]);

    // Fetch recent stats, GitHub stats, and version history once on mount
    useEffect(() => {
        const fetchAdditionalStats = async () => {
            try {
                const [recent, github, versions] = await Promise.all([
                    getRecentDownloadStats(),
                    getGitHubStats(),
                    getPackageVersionHistory('openadapt'),
                ]);
                setRecentStats(recent);
                setGithubStats(github);
                setVersionHistory(versions);
            } catch (err) {
                console.error('Error fetching additional stats:', err);
            }
        };
        fetchAdditionalStats();
    }, []);

    const getCumulativeChartData = () => {
        if (!historyData) return null;

        const labels = historyData.cumulativeHistory.map(item => formatDate(item.date, period));
        const downloads = historyData.cumulativeHistory.map(item => item.downloads);

        return {
            labels,
            datasets: [
                {
                    label: 'Cumulative Downloads',
                    data: downloads,
                    borderColor: 'rgb(34, 197, 94)', // Green for growth
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };
    };

    const getCombinedChartData = () => {
        if (!historyData) return null;

        const labels = historyData.combined.map(item => formatDate(item.date, period));
        const downloads = historyData.combined.map(item => item.downloads);

        return {
            labels,
            datasets: [
                {
                    label: 'Downloads per Period',
                    data: downloads,
                    borderColor: packageColors.combined.border,
                    backgroundColor: packageColors.combined.background,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };
    };

    const getPackagesChartData = () => {
        if (!historyData) return null;

        // Get all unique dates from combined data
        const labels = historyData.combined.map(item => formatDate(item.date, period));

        const datasets = historyData.packageNames.map(packageName => {
            const packageHistory = historyData.packages[packageName] || [];
            const colors = packageColors[packageName] || packageColors.combined;

            // Create a map for quick lookup
            const historyMap = new Map(
                packageHistory.map(item => [item.date, item.downloads])
            );

            // Align data with labels
            const data = historyData.combined.map(item => historyMap.get(item.date) || 0);

            return {
                label: packageName,
                data,
                borderColor: colors.border,
                backgroundColor: colors.background,
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5,
            };
        });

        return { labels, datasets };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: chartType === 'packages',
                position: 'right',
                align: 'start',
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 11,
                    },
                    padding: 10,
                    boxWidth: 12,
                    boxHeight: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 46, 0.95)',
                titleColor: 'white',
                bodyColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: 'rgba(86, 13, 248, 0.5)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function(context) {
                        const value = context.parsed.y;
                        return `${context.dataset.label}: ${value.toLocaleString()} downloads`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    font: {
                        size: 11,
                    },
                    maxRotation: 45,
                    minRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    font: {
                        size: 11,
                    },
                    callback: function(value) {
                        return formatDownloadCount(value).replace('+', '');
                    },
                },
            },
        },
    };

    const getTrendIcon = () => {
        if (!growthStats) return faMinus;
        if (growthStats.trend === 'growing') return faArrowTrendUp;
        if (growthStats.trend === 'declining') return faArrowTrendDown;
        return faMinus;
    };

    const getTrendClass = () => {
        if (!growthStats) return '';
        if (growthStats.trend === 'growing') return styles.trendUp;
        if (growthStats.trend === 'declining') return styles.trendDown;
        return styles.trendStable;
    };

    const getChartData = () => {
        if (chartType === 'cumulative') return getCumulativeChartData();
        if (chartType === 'combined') return getCombinedChartData();
        return getPackagesChartData();
    };

    const chartData = getChartData();

    // Calculate total cumulative downloads
    const totalCumulative = historyData?.cumulativeHistory?.length > 0
        ? historyData.cumulativeHistory[historyData.cumulativeHistory.length - 1].downloads
        : 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <FontAwesomeIcon icon={faPython} className={styles.icon} />
                    <h3 className={styles.title}>PyPI Download Trends</h3>
                </div>
                <p className={styles.subtitle}>
                    Historical download statistics for OpenAdapt packages
                </p>
            </div>

            {/* Stats Summary - Enhanced Grid */}
            <div className={styles.statsGrid}>
                {/* Primary Stats Row */}
                <div className={styles.statsRow}>
                    {historyData && (
                        <div className={`${styles.statItem} ${styles.statPrimary}`}>
                            <span className={styles.statValue}>
                                <FontAwesomeIcon icon={faDownload} className={styles.statIcon} />
                                {formatDownloadCount(totalCumulative)}
                            </span>
                            <span className={styles.statLabel}>
                                Total Downloads
                                <a
                                    href="https://pypistats.org/packages/openadapt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.sourceLink}
                                    aria-label="View PyPI statistics data source"
                                >
                                    <FontAwesomeIcon icon={faLink} className={styles.sourceLinkIcon} />
                                    <span className={styles.sourceLinkTooltip}>View data source</span>
                                </a>
                            </span>
                        </div>
                    )}
                    {githubStats && (
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>
                                <FontAwesomeIcon icon={faStar} className={styles.statIconGold} />
                                {githubStats.stars.toLocaleString()}
                            </span>
                            <span className={styles.statLabel}>
                                GitHub Stars
                                <a
                                    href="https://github.com/OpenAdaptAI/OpenAdapt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.sourceLink}
                                    aria-label="View GitHub repository"
                                >
                                    <FontAwesomeIcon icon={faLink} className={styles.sourceLinkIcon} />
                                    <span className={styles.sourceLinkTooltip}>View data source</span>
                                </a>
                            </span>
                        </div>
                    )}
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>
                            <FontAwesomeIcon icon={faCube} className={styles.statIcon} />
                            {historyData?.packageNames?.length || 8}
                        </span>
                        <span className={styles.statLabel}>
                            Packages
                            <a
                                href="https://pypi.org/user/openadapt/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.sourceLink}
                                aria-label="View PyPI user page"
                            >
                                <FontAwesomeIcon icon={faLink} className={styles.sourceLinkIcon} />
                                <span className={styles.sourceLinkTooltip}>View data source</span>
                            </a>
                        </span>
                    </div>
                </div>

                {/* Recent Activity Row */}
                {recentStats && (
                    <div className={styles.statsRowSecondary}>
                        <div className={styles.statItemSmall}>
                            <span className={styles.statValueSmall}>
                                <FontAwesomeIcon icon={faCalendarDay} className={styles.statIconSmall} />
                                {recentStats.totals.last_day.toLocaleString()}
                            </span>
                            <span className={styles.statLabelSmall}>
                                Today
                                <a
                                    href="https://pypistats.org/packages/openadapt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.sourceLink}
                                    aria-label="View PyPI statistics data source"
                                >
                                    <FontAwesomeIcon icon={faLink} className={styles.sourceLinkIcon} />
                                    <span className={styles.sourceLinkTooltip}>View data source</span>
                                </a>
                            </span>
                        </div>
                        <div className={styles.statItemSmall}>
                            <span className={styles.statValueSmall}>
                                <FontAwesomeIcon icon={faCalendarWeek} className={styles.statIconSmall} />
                                {recentStats.totals.last_week.toLocaleString()}
                            </span>
                            <span className={styles.statLabelSmall}>
                                This Week
                                <a
                                    href="https://pypistats.org/packages/openadapt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.sourceLink}
                                    aria-label="View PyPI statistics data source"
                                >
                                    <FontAwesomeIcon icon={faLink} className={styles.sourceLinkIcon} />
                                    <span className={styles.sourceLinkTooltip}>View data source</span>
                                </a>
                            </span>
                        </div>
                        <div className={styles.statItemSmall}>
                            <span className={styles.statValueSmall}>
                                <FontAwesomeIcon icon={faArrowTrendUp} className={styles.statIconSmall} />
                                {recentStats.totals.last_month.toLocaleString()}
                            </span>
                            <span className={styles.statLabelSmall}>
                                This Month
                                <a
                                    href="https://pypistats.org/packages/openadapt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.sourceLink}
                                    aria-label="View PyPI statistics data source"
                                >
                                    <FontAwesomeIcon icon={faLink} className={styles.sourceLinkIcon} />
                                    <span className={styles.sourceLinkTooltip}>View data source</span>
                                </a>
                            </span>
                        </div>
                        {recentStats.topPackage.name && (
                            <div className={styles.statItemSmall}>
                                <span className={styles.statValueSmall}>
                                    <FontAwesomeIcon icon={faTrophy} className={styles.statIconGold} />
                                    {recentStats.topPackage.name.replace('openadapt-', '')}
                                </span>
                                <span className={styles.statLabelSmall}>
                                    Top Package
                                    <a
                                        href="https://pypistats.org/packages/openadapt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.sourceLink}
                                        aria-label="View PyPI statistics data source"
                                    >
                                        <FontAwesomeIcon icon={faLink} className={styles.sourceLinkIcon} />
                                        <span className={styles.sourceLinkTooltip}>View data source</span>
                                    </a>
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>View:</span>
                    <div className={styles.toggleGroup}>
                        <button
                            className={`${styles.toggleBtn} ${chartType === 'cumulative' ? styles.active : ''}`}
                            onClick={() => setChartType('cumulative')}
                        >
                            Cumulative
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${chartType === 'combined' ? styles.active : ''}`}
                            onClick={() => setChartType('combined')}
                        >
                            Per Period
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${chartType === 'packages' ? styles.active : ''}`}
                            onClick={() => setChartType('packages')}
                        >
                            By Package
                        </button>
                    </div>
                </div>
                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>Range:</span>
                    <div className={styles.toggleGroup}>
                        <button
                            className={`${styles.toggleBtn} ${timeRange === 'all' ? styles.active : ''}`}
                            onClick={() => setTimeRange('all')}
                        >
                            All Time
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${timeRange === '2y' ? styles.active : ''}`}
                            onClick={() => setTimeRange('2y')}
                        >
                            2 Years
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className={chartType === 'packages' ? styles.chartContainerPackages : styles.chartContainer}>
                {loading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                        <span>Loading statistics...</span>
                    </div>
                )}
                {error && (
                    <div className={styles.errorOverlay}>
                        <FontAwesomeIcon icon={faChartLine} className={styles.errorIcon} />
                        <span>{error}</span>
                    </div>
                )}
                {!loading && !error && chartData && (
                    <Line data={chartData} options={chartOptions} />
                )}
            </div>

            {/* Data Source Attribution */}
            <div className={styles.attribution}>
                Data from{' '}
                <a
                    href="https://pypistats.org/packages/openadapt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.attributionLink}
                >
                    pypistats.org
                </a>
            </div>
        </div>
    );
};

export default PyPIDownloadChart;
