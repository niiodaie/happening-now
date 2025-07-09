// Vercel serverless function for trends API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Try to fetch Reddit trends
    const redditTrends = await getRedditTrends()
    
    // Combine with mock Google Trends data (since Google Trends API requires special setup)
    const mockGoogleTrends = [
      { keyword: 'AI Revolution', count: 1250, source: 'Google Trends' },
      { keyword: 'Climate Action', count: 980, source: 'Google Trends' },
      { keyword: 'Space Exploration', count: 750, source: 'Google Trends' }
    ]

    const allTrends = [...redditTrends, ...mockGoogleTrends]

    return res.status(200).json({
      status: 'success',
      trends: allTrends,
      totalTrends: allTrends.length,
      sources: ['Reddit', 'Google Trends (Mock)']
    })
  } catch (error) {
    console.error('Trends API error:', error)
    
    // Fallback to mock data
    const mockTrends = [
      { keyword: 'Breaking News', count: 1500, source: 'Mock Data' },
      { keyword: 'Tech Innovation', count: 1200, source: 'Mock Data' },
      { keyword: 'Global Events', count: 950, source: 'Mock Data' },
      { keyword: 'Sports Update', count: 800, source: 'Mock Data' },
      { keyword: 'Market Analysis', count: 650, source: 'Mock Data' },
      { keyword: 'Health News', count: 500, source: 'Mock Data' }
    ]

    return res.status(200).json({
      status: 'success',
      trends: mockTrends,
      totalTrends: mockTrends.length,
      sources: ['Mock Data'],
      note: 'Using fallback data due to API limitations'
    })
  }
}

async function getRedditTrends() {
  try {
    const response = await fetch('https://www.reddit.com/r/news/hot.json?limit=10', {
      headers: {
        'User-Agent': 'HappeningNow/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`)
    }

    const data = await response.json()
    const trends = []

    data.data?.children?.forEach((post, index) => {
      if (post.data?.title && index < 5) {
        // Extract keywords from title
        const keywords = extractKeywords(post.data.title)
        keywords.forEach(keyword => {
          trends.push({
            keyword,
            count: Math.floor(Math.random() * 500) + 100, // Mock engagement count
            source: 'Reddit'
          })
        })
      }
    })

    return trends.slice(0, 5) // Return top 5 trends
  } catch (error) {
    console.error('Reddit trends error:', error)
    return []
  }
}

function extractKeywords(title) {
  // Simple keyword extraction
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']
  
  const words = title.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))

  // Return first 2 meaningful words as keywords
  return words.slice(0, 2).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  )
}

