import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const DownloadGraph = () => {
    const [chartData, setChartData] = useState({
        datasets: [
            {
                label: 'Release Downloads',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Total Downloads',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Downloads'
                }
            }
        }
    };

    const fetchReleaseData = async (page = 1) => {
        const queryParams = new URLSearchParams({
            per_page: 30,
            page,
        });
        const response = await fetch(`https://api.github.com/repos/OpenAdaptAI/OpenAdapt/releases?${queryParams.toString()}`);
        return response.json();
    };

    useEffect(() => {
        let cumulativeTotalDownloads = 0;
        let allReleases = [];

        const processReleases = async (page = 1) => {
            const releaseData = await fetchReleaseData(page);
            if (releaseData.length === 0) return;

            allReleases = [...allReleases, ...releaseData];
            if (releaseData.length === 30) {
                await processReleases(page + 1);
            } else {
                // Sort releases by published date
                allReleases.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));

                const dailyDownloads = [];
                const cumulativeDownloads = [];

                allReleases.forEach(release => {
                    const date = new Date(release.published_at);
                    const dailyTotalDownloads = release.assets.reduce((acc, asset) => {
                        return acc + (asset.name.endsWith('.zip') ? asset.download_count : 0);
                    }, 0);

                    cumulativeTotalDownloads += dailyTotalDownloads;
                    dailyDownloads.push({ x: date, y: dailyTotalDownloads });
                    cumulativeDownloads.push({ x: date, y: cumulativeTotalDownloads });
                });

                setChartData({
                    datasets: [
                        { ...chartData.datasets[0], data: dailyDownloads },
                        { ...chartData.datasets[1], data: cumulativeDownloads },
                    ],
                });
            }
        };

        processReleases();
    }, []);

    return (
        <div style={{ minHeight: '300px', height: '40vh' }} className="my-10">
            <h2>Downloads</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default DownloadGraph;
