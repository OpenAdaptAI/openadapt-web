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

/**
 * ACCESSIBILITY IMPROVEMENTS FOR COLORBLIND USERS
 *
 * This component implements multiple accessibility features to ensure
 * the "By Package" chart is usable by colorblind users:
 *
 * 1. Colorblind-Safe Palette: Uses the Tol bright color scheme, scientifically
 *    designed to be distinguishable for all types of color vision deficiency
 *    (protanopia, deuteranopia, tritanopia, and achromatopsia).
 *    Source: https://personal.sron.nl/~paultol/data/colourschemes.pdf
 *
 * 2. Line Patterns: Each package line uses a distinct dash pattern
 *    (solid, dashed, dotted, dash-dot, etc.) providing visual differentiation
 *    beyond color alone.
 *
 * 3. Line Widths: Varying line widths (2-3px) add another layer of distinction.
 *
 * 4. Interactive Legend: Click legend items to show/hide specific packages.
 *    The legend shows line patterns matching the chart lines.
 *
 * 5. Enhanced Tooltips: Hover over any point to see:
 *    - Package name prominently displayed
 *    - Exact download counts
 *    - Total across all packages
 *    - Color indicators matching the line
 *
 * 6. Hover Highlighting: When hovering over a line, other lines fade out
 *    (reduced opacity) to make the hovered line stand out clearly.
 *
 * These features work together to ensure the chart is fully accessible
 * without relying solely on color perception.
 */

// Colorblind-safe color palette using Tol bright scheme
// This palette is designed to be distinguishable for all types of color vision deficiency
// Source: https://personal.sron.nl/~paultol/data/colourschemes.pdf
const TOL_BRIGHT_COLORS = [
    '#4477AA', // Blue
    '#EE6677', // Red
    '#228833', // Green
    '#CCBB44', // Yellow
    '#66CCEE', // Cyan
    '#AA3377', // Purple
    '#BBBBBB', // Grey
    '#EE7733', // Orange (additional)
];

// Line patterns for additional visual differentiation
const LINE_PATTERNS = [
    [],           // Solid
    [10, 5],      // Dashed
    [2, 3],       // Dotted
    [15, 5, 5, 5], // Dash-dot
    [20, 5],      // Long dash
    [5, 5, 1, 5], // Dash-dot-dot
    [8, 4, 2, 4], // Mixed
    [12, 3],      // Medium dash
];

// Line widths for additional differentiation
const LINE_WIDTHS = [3, 2.5, 2.5, 2.5, 2, 2, 2, 2];

// Package-specific configuration with colorblind-safe colors and patterns
const packageColors = {
    'openadapt': {
        border: TOL_BRIGHT_COLORS[0], // Blue
        background: `${TOL_BRIGHT_COLORS[0]}33`,
        borderDash: LINE_PATTERNS[0], // Solid
        borderWidth: LINE_WIDTHS[0],
    },
    'openadapt-ml': {
        border: TOL_BRIGHT_COLORS[1], // Red
        background: `${TOL_BRIGHT_COLORS[1]}33`,
        borderDash: LINE_PATTERNS[1], // Dashed
        borderWidth: LINE_WIDTHS[1],
    },
    'openadapt-capture': {
        border: TOL_BRIGHT_COLORS[2], // Green
        background: `${TOL_BRIGHT_COLORS[2]}33`,
        borderDash: LINE_PATTERNS[2], // Dotted
        borderWidth: LINE_WIDTHS[2],
    },
    'openadapt-evals': {
        border: TOL_BRIGHT_COLORS[3], // Yellow
        background: `${TOL_BRIGHT_COLORS[3]}33`,
        borderDash: LINE_PATTERNS[3], // Dash-dot
        borderWidth: LINE_WIDTHS[3],
    },
    'openadapt-viewer': {
        border: TOL_BRIGHT_COLORS[4], // Cyan
        background: `${TOL_BRIGHT_COLORS[4]}33`,
        borderDash: LINE_PATTERNS[4], // Long dash
        borderWidth: LINE_WIDTHS[4],
    },
    'openadapt-grounding': {
        border: TOL_BRIGHT_COLORS[5], // Purple
        background: `${TOL_BRIGHT_COLORS[5]}33`,
        borderDash: LINE_PATTERNS[5], // Dash-dot-dot
        borderWidth: LINE_WIDTHS[5],
    },
    'openadapt-retrieval': {
        border: TOL_BRIGHT_COLORS[7], // Orange
        background: `${TOL_BRIGHT_COLORS[7]}33`,
        borderDash: LINE_PATTERNS[6], // Mixed
        borderWidth: LINE_WIDTHS[6],
    },
    'openadapt-privacy': {
        border: TOL_BRIGHT_COLORS[6], // Grey
        background: `${TOL_BRIGHT_COLORS[6]}33`,
        borderDash: LINE_PATTERNS[7], // Medium dash
        borderWidth: LINE_WIDTHS[7],
    },
    'combined': {
        border: 'rgb(96, 165, 250)',
        background: 'rgba(96, 165, 250, 0.3)',
        borderDash: [],
        borderWidth: 3,
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
                // Use Promise.allSettled to ensure all promises complete even if some fail
                const results = await Promise.allSettled([
                    getRecentDownloadStats(),
                    getGitHubStats(),
                    getPackageVersionHistory('openadapt'),
                ]);

                // Handle each result individually
                if (results[0].status === 'fulfilled' && results[0].value) {
                    console.log('Recent stats loaded:', results[0].value);
                    setRecentStats(results[0].value);
                } else {
                    console.error('Failed to load recent stats:', results[0].reason);
                }

                if (results[1].status === 'fulfilled' && results[1].value) {
                    setGithubStats(results[1].value);
                } else {
                    console.error('Failed to load GitHub stats:', results[1].reason);
                }

                if (results[2].status === 'fulfilled' && results[2].value) {
                    setVersionHistory(results[2].value);
                } else {
                    console.error('Failed to load version history:', results[2].reason);
                }
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
                borderDash: colors.borderDash || [],
                borderWidth: colors.borderWidth || 2,
                fill: false,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointHoverBorderWidth: 3,
                // Enhanced hover highlighting
                hoverBorderWidth: colors.borderWidth ? colors.borderWidth + 1 : 3,
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
                        weight: '500',
                    },
                    padding: 10,
                    boxWidth: 20,
                    boxHeight: 3,
                    usePointStyle: false,
                    // Generate box to show line pattern
                    generateLabels: function(chart) {
                        const datasets = chart.data.datasets;
                        return datasets.map((dataset, i) => ({
                            text: dataset.label,
                            fillStyle: dataset.borderColor,
                            strokeStyle: dataset.borderColor,
                            lineWidth: dataset.borderWidth || 2,
                            lineDash: dataset.borderDash || [],
                            hidden: !chart.isDatasetVisible(i),
                            index: i,
                            datasetIndex: i,
                        }));
                    },
                },
                onClick: function(e, legendItem, legend) {
                    const index = legendItem.datasetIndex;
                    const chart = legend.chart;
                    const meta = chart.getDatasetMeta(index);

                    // Toggle dataset visibility
                    meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
                    chart.update();
                },
                onHover: function(e, legendItem, legend) {
                    e.native.target.style.cursor = 'pointer';
                },
                onLeave: function(e, legendItem, legend) {
                    e.native.target.style.cursor = 'default';
                },
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 46, 0.98)',
                titleColor: 'white',
                titleFont: {
                    size: 13,
                    weight: 'bold',
                },
                bodyColor: 'rgba(255, 255, 255, 0.9)',
                bodyFont: {
                    size: 12,
                },
                borderColor: 'rgba(86, 13, 248, 0.5)',
                borderWidth: 2,
                padding: 14,
                displayColors: true,
                boxWidth: 15,
                boxHeight: 15,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    title: function(context) {
                        // Show date in tooltip title
                        return context[0].label;
                    },
                    label: function(context) {
                        const value = context.parsed.y;
                        const label = context.dataset.label;
                        return `${label}: ${value.toLocaleString()} downloads`;
                    },
                    labelColor: function(context) {
                        return {
                            borderColor: context.dataset.borderColor,
                            backgroundColor: context.dataset.borderColor,
                            borderWidth: 2,
                            borderDash: context.dataset.borderDash || [],
                        };
                    },
                    afterBody: function(context) {
                        if (!historyData || !versionHistory.length) return '';

                        // Get the date for this data point
                        const dataIndex = context[0].dataIndex;
                        const dateStr = historyData.combined[dataIndex]?.date;

                        if (!dateStr) return '';

                        // Check if a version was released on this date
                        const releasedVersion = getVersionReleasedOnDate(versionHistory, dateStr);

                        if (releasedVersion) {
                            const emoji = releasedVersion.type === 'major' ? '🎉' :
                                         releasedVersion.type === 'minor' ? '🚀' : '📦';
                            return `\n${emoji} Version ${releasedVersion.version} released!`;
                        }

                        // Otherwise, show the current version for this date
                        const currentVersion = getVersionForDate(versionHistory, dateStr);

                        if (currentVersion) {
                            return `\nCurrent version: ${currentVersion.version}`;
                        }

                        return '';
                    },
                    footer: function(context) {
                        if (chartType !== 'packages') return '';

                        // Show total across all packages for this time point
                        const total = context.reduce((sum, item) => sum + item.parsed.y, 0);
                        return `\nTotal: ${total.toLocaleString()} downloads`;
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
        // Enhanced hover effect to highlight the active dataset
        onHover: function(event, activeElements, chart) {
            if (chartType !== 'packages') return;

            if (activeElements.length > 0) {
                const datasetIndex = activeElements[0].datasetIndex;

                // Reduce opacity of non-hovered datasets
                chart.data.datasets.forEach((dataset, index) => {
                    if (index !== datasetIndex) {
                        dataset.borderColor = dataset.borderColor.includes('rgba')
                            ? dataset.borderColor
                            : dataset.borderColor.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, 'rgba($1, $2, $3, 0.2)');
                    }
                });
            } else {
                // Restore original opacity when not hovering
                chart.data.datasets.forEach((dataset, index) => {
                    const packageName = historyData.packageNames[index];
                    const originalColors = packageColors[packageName] || packageColors.combined;
                    dataset.borderColor = originalColors.border;
                });
            }
            chart.update('none'); // Update without animation
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
                                Total Downloads (All Packages)
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
                                Today (All Packages)
                            </span>
                        </div>
                        <div className={styles.statItemSmall}>
                            <span className={styles.statValueSmall}>
                                <FontAwesomeIcon icon={faCalendarWeek} className={styles.statIconSmall} />
                                {recentStats.totals.last_week.toLocaleString()}
                            </span>
                            <span className={styles.statLabelSmall}>
                                This Week (All Packages)
                            </span>
                        </div>
                        <div className={styles.statItemSmall}>
                            <span className={styles.statValueSmall}>
                                <FontAwesomeIcon icon={faArrowTrendUp} className={styles.statIconSmall} />
                                {recentStats.totals.last_month.toLocaleString()}
                            </span>
                            <span className={styles.statLabelSmall}>
                                This Month (All Packages)
                            </span>
                        </div>
                        {recentStats.topPackage.name && (
                            <div className={styles.statItemSmall}>
                                <span className={styles.statValueSmall}>
                                    <FontAwesomeIcon icon={faTrophy} className={styles.statIconGold} />
                                    {recentStats.topPackage.name.replace('openadapt-', '')}
                                </span>
                                <span className={styles.statLabelSmall}>
                                    Top Package This Month
                                    <a
                                        href={`https://pypistats.org/packages/${recentStats.topPackage.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.sourceLink}
                                        aria-label="View top package statistics"
                                    >
                                        <FontAwesomeIcon icon={faLink} className={styles.sourceLinkIcon} />
                                        <span className={styles.sourceLinkTooltip}>View package stats</span>
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
                <div className={styles.attributionContent}>
                    <FontAwesomeIcon icon={faPython} className={styles.attributionIcon} />
                    <span>
                        Data sourced from{' '}
                        <a
                            href="https://pypi.org/search/?q=openadapt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.attributionLink}
                        >
                            PyPI OpenAdapt packages
                        </a>
                        {' '}via pypistats.org API
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PyPIDownloadChart;
