// Vercel serverless function for news API
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
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY || 'e5d61af9dc354abfa6e2f7a009ba6daf'
    
    // Try to fetch from NewsAPI with better error handling
    const newsResponse = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=20&apiKey=${NEWSAPI_KEY}`,
      {
        headers: {
          'User-Agent': 'HappeningNow/1.0'
        },
        timeout: 10000 // 10 second timeout
      }
    )

    let newsData
    const responseText = await newsResponse.text()
    
    try {
      newsData = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Response:', responseText.substring(0, 200))
      throw new Error('Invalid JSON response from NewsAPI')
    }

    if (newsResponse.ok && newsData.status === 'ok') {
      // Transform NewsAPI data to our format
      const articles = newsData.articles?.map((article, index) => ({
        id: `news-${index}`,
        title: article.title,
        summary: article.description || article.content?.substring(0, 200) + '...',
        url: article.url,
        image: article.urlToImage,
        source: article.source?.name || 'Unknown',
        timestamp: article.publishedAt,
        publishedAt: article.publishedAt,
        tags: categorizeArticle(article.title + ' ' + (article.description || '')),
        slug: generateSlug(article.title)
      })).filter(article => 
        article.title && 
        !article.title.includes('[Removed]') && 
        article.title !== 'null'
      ) || []

      return res.status(200).json({
        status: 'success',
        articles,
        totalResults: articles.length,
        source: 'NewsAPI'
      })
    } else {
      throw new Error(`NewsAPI error: ${newsResponse.status} - ${newsData.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('NewsAPI failed, using mock data:', error.message)
    
    // Fallback to mock data with proper structure
    const mockArticles = [
      {
        id: "mock-1",
        title: "Breaking: Major Tech Company Announces Revolutionary AI Breakthrough",
        summary: "Scientists demonstrate unprecedented problem-solving abilities in artificial intelligence, marking a significant leap forward in machine learning technology.",
        url: "https://example.com/ai-breakthrough",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        source: "Tech News",
        timestamp: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        tags: ["Tech", "AI", "Science"],
        slug: "major-tech-company-ai-breakthrough"
      },
      {
        id: "mock-2",
        title: "Global Climate Summit Reaches Historic Agreement on Carbon Reduction",
        summary: "World leaders commit to ambitious new targets for reducing greenhouse gas emissions by 2030, with unprecedented international cooperation.",
        url: "https://example.com/climate-summit",
        image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop",
        source: "Climate News",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        tags: ["World", "Environment", "Politics"],
        slug: "global-climate-summit-historic-agreement"
      },
      {
        id: "mock-3",
        title: "Stock Markets Surge as Tech Giants Report Record Earnings",
        summary: "Major technology companies exceed expectations in quarterly reports, driving significant gains across global financial markets.",
        url: "https://example.com/stock-markets-surge",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
        source: "Financial Times",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        tags: ["Finance", "Tech", "Business"],
        slug: "stock-markets-surge-tech-giants-earnings"
      },
      {
        id: "mock-4",
        title: "New Medical Treatment Shows Promise for Rare Disease",
        summary: "Clinical trials demonstrate significant improvement in patients with previously untreatable genetic condition, offering hope to thousands.",
        url: "https://example.com/medical-treatment-rare-disease",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
        source: "Medical Journal",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        tags: ["Health", "Science", "Medicine"],
        slug: "medical-treatment-promise-rare-disease"
      },
      {
        id: "mock-5",
        title: "Major Sports Championship Finals Draw Record Viewership",
        summary: "The championship game attracts over 100 million viewers worldwide, setting new records for sports broadcasting and streaming platforms.",
        url: "https://example.com/sports-championship-finals",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
        source: "Sports Network",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        tags: ["Sports", "Entertainment", "Media"],
        slug: "sports-championship-finals-record-viewership"
      },
      {
        id: "mock-6",
        title: "Breakthrough in Quantum Computing Achieved by Research Team",
        summary: "Scientists demonstrate stable quantum entanglement at room temperature, potentially revolutionizing computing and communication technologies.",
        url: "https://example.com/quantum-computing-breakthrough",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
        source: "Science Daily",
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        tags: ["Science", "Tech", "Research"],
        slug: "quantum-computing-breakthrough-research-team"
      }
    ]

    return res.status(200).json({
      status: 'success',
      articles: mockArticles,
      totalResults: mockArticles.length,
      source: 'Mock Data',
      note: 'Using fallback data due to API limitations'
    })
  }
}

function categorizeArticle(text) {
  const categories = {
    'Tech': ['technology', 'tech', 'ai', 'artificial intelligence', 'computer', 'software', 'digital', 'internet', 'app', 'startup'],
    'Politics': ['politics', 'government', 'election', 'president', 'congress', 'senate', 'policy', 'law', 'legislation'],
    'Health': ['health', 'medical', 'medicine', 'doctor', 'hospital', 'disease', 'treatment', 'vaccine', 'covid'],
    'Sports': ['sports', 'football', 'basketball', 'baseball', 'soccer', 'olympics', 'championship', 'game', 'player'],
    'Business': ['business', 'economy', 'market', 'stock', 'finance', 'company', 'corporate', 'earnings', 'revenue'],
    'Entertainment': ['entertainment', 'movie', 'film', 'music', 'celebrity', 'hollywood', 'tv', 'show', 'actor'],
    'Science': ['science', 'research', 'study', 'discovery', 'space', 'climate', 'environment', 'energy'],
    'World': ['world', 'international', 'global', 'country', 'nation', 'war', 'peace', 'trade', 'diplomacy']
  }

  const lowerText = text.toLowerCase()
  const tags = []

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      tags.push(category)
    }
  }

  return tags.length > 0 ? tags : ['General']
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .trim()
}

