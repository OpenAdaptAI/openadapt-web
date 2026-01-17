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
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { faChartLine, faArrowTrendUp, faArrowTrendDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import {
    getPyPIDownloadHistoryLimited,
    formatDate,
    calculateGrowthStats,
} from 'utils/pypistatsHistory';
import { formatDownloadCount } from 'utils/pypiStats';
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
    'combined': {
        border: 'rgb(96, 165, 250)',
        background: 'rgba(96, 165, 250, 0.3)',
    },
};

const PyPIDownloadChart = () => {
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('combined'); // 'combined' or 'packages'
    const [period, setPeriod] = useState('month');
    const [growthStats, setGrowthStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const limit = period === 'day' ? 30 : period === 'week' ? 12 : 12;
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
    }, [period]);

    const getCombinedChartData = () => {
        if (!historyData) return null;

        const labels = historyData.combined.map(item => formatDate(item.date, period));
        const downloads = historyData.combined.map(item => item.downloads);

        return {
            labels,
            datasets: [
                {
                    label: 'Total Downloads',
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
                position: 'top',
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12,
                    },
                    padding: 16,
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

    const chartData = chartType === 'combined' ? getCombinedChartData() : getPackagesChartData();

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

            {/* Stats Summary */}
            {growthStats && historyData && (
                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>
                            {formatDownloadCount(
                                historyData.combined.reduce((sum, item) => sum + item.downloads, 0)
                            )}
                        </span>
                        <span className={styles.statLabel}>Total ({period}ly)</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>
                            {formatDownloadCount(growthStats.recentAvg)}
                        </span>
                        <span className={styles.statLabel}>Avg per {period}</span>
                    </div>
                    <div className={`${styles.statItem} ${getTrendClass()}`}>
                        <span className={styles.statValue}>
                            <FontAwesomeIcon icon={getTrendIcon()} className={styles.trendIcon} />
                            {growthStats.growthPercent > 0 ? '+' : ''}{growthStats.growthPercent}%
                        </span>
                        <span className={styles.statLabel}>Growth</span>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>View:</span>
                    <div className={styles.toggleGroup}>
                        <button
                            className={`${styles.toggleBtn} ${chartType === 'combined' ? styles.active : ''}`}
                            onClick={() => setChartType('combined')}
                        >
                            Combined
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
                    <span className={styles.controlLabel}>Period:</span>
                    <div className={styles.toggleGroup}>
                        <button
                            className={`${styles.toggleBtn} ${period === 'day' ? styles.active : ''}`}
                            onClick={() => setPeriod('day')}
                        >
                            Daily
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${period === 'week' ? styles.active : ''}`}
                            onClick={() => setPeriod('week')}
                        >
                            Weekly
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${period === 'month' ? styles.active : ''}`}
                            onClick={() => setPeriod('month')}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className={styles.chartContainer}>
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
