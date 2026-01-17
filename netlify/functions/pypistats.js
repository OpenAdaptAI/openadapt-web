/**
 * Netlify Function to proxy pypistats.org requests
 * This avoids CORS issues when fetching from the client
 */

const allowedPackages = [
    'openadapt',
    'openadapt-ml',
    'openadapt-capture',
    'openadapt-evals',
    'openadapt-viewer',
    'openadapt-grounding',
    'openadapt-retrieval',
    'openadapt-privacy',
];

const allowedEndpoints = ['overall', 'recent'];

exports.handler = async function(event, context) {
    const params = event.queryStringParameters || {};
    const { package: packageName, endpoint = 'overall', period = 'month' } = params;

    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (!packageName) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Package name is required' }),
        };
    }

    if (!allowedPackages.includes(packageName)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid package name' }),
        };
    }

    if (!allowedEndpoints.includes(endpoint)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid endpoint' }),
        };
    }

    try {
        const url = `https://pypistats.org/api/packages/${packageName}/${endpoint}?period=${period}&mirrors=true`;
        const response = await fetch(url);

        if (!response.ok) {
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: `pypistats.org returned ${response.status}` }),
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error fetching from pypistats.org:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch package stats' }),
        };
    }
};
