/**
 * API route to proxy pypistats.org requests
 * This avoids CORS issues when fetching from the client
 */

export default async function handler(req, res) {
    const { package: packageName, endpoint = 'overall', period = 'month' } = req.query;

    if (!packageName) {
        return res.status(400).json({ error: 'Package name is required' });
    }

    // Whitelist allowed packages for security
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

    if (!allowedPackages.includes(packageName)) {
        return res.status(400).json({ error: 'Invalid package name' });
    }

    // Whitelist allowed endpoints
    const allowedEndpoints = ['overall', 'recent'];
    if (!allowedEndpoints.includes(endpoint)) {
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    try {
        const url = `https://pypistats.org/api/packages/${packageName}/${endpoint}?period=${period}&mirrors=true`;
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(response.status).json({
                error: `pypistats.org returned ${response.status}`,
            });
        }

        const data = await response.json();

        // Cache for 1 hour
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching from pypistats.org:', error);
        return res.status(500).json({ error: 'Failed to fetch package stats' });
    }
}
