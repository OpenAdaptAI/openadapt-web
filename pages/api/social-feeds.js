// API route for fetching and caching social media feeds
// This provides server-side caching to improve performance and reduce API calls

export default async function handler(req, res) {
    // Set cache headers - cache for 5 minutes, allow stale content while revalidating
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=600'
    )

    try {
        // Fetch data from all sources in parallel
        const [githubResponse, redditResponse, hnResponse] = await Promise.allSettled([
            fetch('https://api.github.com/repos/OpenAdaptAI/OpenAdapt'),
            fetch('https://www.reddit.com/search.json?q=openadapt&sort=new&limit=5'),
            fetch('https://hn.algolia.com/api/v1/search?query=openadapt&tags=story')
        ])

        // Process GitHub data
        let github = null
        if (githubResponse.status === 'fulfilled' && githubResponse.value.ok) {
            const data = await githubResponse.value.json()
            github = {
                stars: data.stargazers_count,
                forks: data.forks_count,
                watchers: data.subscribers_count,
                issues: data.open_issues_count
            }
        }

        // Process Reddit data
        let reddit = []
        if (redditResponse.status === 'fulfilled' && redditResponse.value.ok) {
            const data = await redditResponse.value.json()
            reddit = data.data.children
                .map(child => child.data)
                .filter(post => !post.stickied)
                .slice(0, 5)
                .map(post => ({
                    id: post.id,
                    title: post.title,
                    subreddit: post.subreddit,
                    author: post.author,
                    score: post.score,
                    num_comments: post.num_comments,
                    permalink: post.permalink,
                    created: post.created_utc
                }))
        }

        // Process Hacker News data
        let hn = []
        if (hnResponse.status === 'fulfilled' && hnResponse.value.ok) {
            const data = await hnResponse.value.json()
            hn = data.hits
                .filter(story => story.points && story.points > 0)
                .slice(0, 5)
                .map(story => ({
                    id: story.objectID,
                    title: story.title,
                    author: story.author,
                    points: story.points,
                    num_comments: story.num_comments || 0,
                    url: story.url || `https://news.ycombinator.com/item?id=${story.objectID}`,
                    created_at: story.created_at
                }))
        }

        // Return aggregated data
        res.status(200).json({
            github,
            reddit,
            hn,
            cached_at: new Date().toISOString()
        })
    } catch (error) {
        console.error('Error fetching social feeds:', error)
        res.status(500).json({
            error: 'Failed to fetch social feeds',
            message: error.message
        })
    }
}
