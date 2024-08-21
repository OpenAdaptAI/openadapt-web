import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const DownloadGraph = () => {
    const [chartData, setChartData] = useState({
        labels: [],
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
        aspectRatio: 1.5, // Lower ratio to make the chart taller
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
        const processReleases = async () => {
            let cumulativeTotalDownloads = 0;
            let allReleases = [];
            let page = 1;

            while (true) {
                const releaseData = await fetchReleaseData(page);
                if (releaseData.length === 0) break;

                allReleases = [...allReleases, ...releaseData];
                if (releaseData.length < 30) break;

                page++;
            }

            // Sort releases by published date
            allReleases.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));

            const labels = [];
            const dailyDownloads = [];
            const cumulativeDownloads = [];

            let foundNonZero = false;
            allReleases.forEach(release => {
                const dailyTotalDownloads = release.assets.reduce((acc, asset) => {
                    if (asset.name.endsWith('.zip')) {
                        return acc + asset.download_count;
                    }
                    return acc;
                }, 0);

                // Skip releases with zero downloads
                if (dailyTotalDownloads > 0) foundNonZero = true;
                if (dailyTotalDownloads === 0 && foundNonZero) return;

                cumulativeTotalDownloads += dailyTotalDownloads;

                const date = new Date(release.published_at).toLocaleDateString();
                const label = `${release.name} : ${date}`; // Combine release name with date
                labels.push(label);

                dailyDownloads.push(dailyTotalDownloads);
                cumulativeDownloads.push(cumulativeTotalDownloads);
            });

            setChartData(prevChartData => ({
                labels,
                datasets: [
                    { ...prevChartData.datasets[0], data: dailyDownloads },
                    { ...prevChartData.datasets[1], data: cumulativeDownloads },
                ],
            }));
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
