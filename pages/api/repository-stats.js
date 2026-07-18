export default async function handler(request, response) {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET')
        return response.status(405).json({ error: 'Method not allowed' })
    }

    const { getOpenAdaptRepositoryStats } = await import(
        '../../lib/openAdaptRepositoryStats'
    )
    const stats = await getOpenAdaptRepositoryStats()

    response.setHeader(
        'Cache-Control',
        'public, max-age=0, s-maxage=600, stale-while-revalidate=3600, stale-if-error=86400'
    )
    return response.status(200).json(stats)
}
