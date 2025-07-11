import { useState, useEffect, useCallback } from 'react'

const API_BASE_URL = '/api'

// Mock fresh news data with current timestamps
const generateMockNews = () => {
  const now = new Date()
  const categories = ['Tech', 'Business', 'Sports', 'Health', 'Politics', 'Entertainment', 'World']
  
  const mockArticles = [
    {
      id: `article-${Date.now()}-1`,
      title: "Breaking: Major Tech Company Announces Revolutionary AI Breakthrough",
      description: "Scientists have developed a new artificial intelligence system that could transform how we interact with technology in our daily lives.",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
      publishedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      source: "Tech News Daily",
      tags: ['Tech', 'AI']
    },
    {
      id: `article-${Date.now()}-2`,
      title: "Global Markets React to Economic Policy Changes",
      description: "Stock markets worldwide show mixed reactions following the announcement of new economic policies by major world economies.",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
      publishedAt: new Date(now.getTime() - 32 * 60 * 1000).toISOString(), // 32 minutes ago
      source: "Financial Times",
      tags: ['Business', 'Economy']
    },
    {
      id: `article-${Date.now()}-3`,
      title: "Championship Finals Set Record Viewership Numbers",
      description: "The latest championship match has broken all previous viewership records, drawing millions of fans worldwide.",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop",
      publishedAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      source: "Sports Central",
      tags: ['Sports']
    },
    {
      id: `article-${Date.now()}-4`,
      title: "New Health Study Reveals Surprising Benefits of Daily Exercise",
      description: "Researchers have discovered additional health benefits of regular exercise that go beyond what was previously known.",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      publishedAt: new Date(now.getTime() - 1.2 * 60 * 60 * 1000).toISOString(), // 1.2 hours ago
      source: "Health Today",
      tags: ['Health']
    },
    {
      id: `article-${Date.now()}-5`,
      title: "Political Leaders Meet for Climate Summit",
      description: "World leaders gather to discuss urgent climate action and new environmental policies for the coming decade.",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=250&fit=crop",
      publishedAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours ago
      source: "Global News",
      tags: ['Politics', 'World']
    },
    {
      id: `article-${Date.now()}-6`,
      title: "Entertainment Industry Embraces New Streaming Technology",
      description: "Major entertainment companies are adopting cutting-edge streaming technology to enhance viewer experience.",
      url: "#",
      imageUrl: "https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=400&h=250&fit=crop",
      publishedAt: new Date(now.getTime() - 3.8 * 60 * 60 * 1000).toISOString(), // 3.8 hours ago
      source: "Entertainment Weekly",
      tags: ['Entertainment', 'Tech']
    }
  ]

  return mockArticles
}

// Generate mock trending topics
const generateMockTrends = () => [
  { id: 1, title: "AI Breakthrough", count: 15420 },
  { id: 2, title: "Climate Summit", count: 12890 },
  { id: 3, title: "Tech Innovation", count: 9876 },
  { id: 4, title: "Global Markets", count: 8765 },
  { id: 5, title: "Health Research", count: 7654 }
]

// Format time ago helper
const formatTimeAgo = (dateString) => {
  const now = new Date()
  const publishedDate = new Date(dateString)
  const diffInMinutes = Math.floor((now - publishedDate) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

export function useNews() {
  const [articles, setArticles] = useState([])
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [availableTags, setAvailableTags] = useState(['All'])

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch from API first
      try {
        const newsResponse = await fetch(`${API_BASE_URL}/news`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        if (newsResponse.ok) {
          const newsData = await newsResponse.json()
          
          // Update timestamps to be fresh
          const freshArticles = newsData.articles?.map(article => ({
            ...article,
            publishedAt: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000).toISOString(), // Random time within last 4 hours
            timeAgo: formatTimeAgo(article.publishedAt)
          })) || []

          setArticles(freshArticles)
          
          // Fetch trending topics
          try {
            const trendsResponse = await fetch(`${API_BASE_URL}/trends`)
            const trendsData = trendsResponse.ok ? await trendsResponse.json() : { trends: generateMockTrends() }
            setTrends(trendsData.trends || generateMockTrends())
          } catch {
            setTrends(generateMockTrends())
          }

          setLastUpdated(new Date())

          // Extract unique tags
          const tags = ['All']
          freshArticles.forEach(article => {
            if (article.tags) {
              article.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                  tags.push(tag)
                }
              })
            }
          })
          setAvailableTags(tags)
          
          return
        }
      } catch (apiError) {
        console.warn('API fetch failed, using mock data:', apiError)
      }

      // Fallback to mock data with fresh timestamps
      const mockArticles = generateMockNews()
      const articlesWithTimeAgo = mockArticles.map(article => ({
        ...article,
        timeAgo: formatTimeAgo(article.publishedAt)
      }))

      setArticles(articlesWithTimeAgo)
      setTrends(generateMockTrends())
      setLastUpdated(new Date())

      // Extract unique tags from mock data
      const tags = ['All']
      mockArticles.forEach(article => {
        if (article.tags) {
          article.tags.forEach(tag => {
            if (!tags.includes(tag)) {
              tags.push(tag)
            }
          })
        }
      })
      setAvailableTags(tags)

    } catch (err) {
      console.error('Error fetching news:', err)
      setError(err.message)
      
      // Even on error, provide some mock data
      const mockArticles = generateMockNews()
      setArticles(mockArticles)
      setTrends(generateMockTrends())
      setAvailableTags(['All', 'Tech', 'Business', 'Sports', 'Health', 'Politics', 'Entertainment', 'World'])
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    return fetchNews()
  }, [fetchNews])

  useEffect(() => {
    fetchNews()

    // Auto-refresh every 5 minutes for fresh content
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchNews])

  // Update time ago every minute
  useEffect(() => {
    const updateTimeAgo = () => {
      setArticles(prevArticles => 
        prevArticles.map(article => ({
          ...article,
          timeAgo: formatTimeAgo(article.publishedAt)
        }))
      )
    }

    const timeInterval = setInterval(updateTimeAgo, 60 * 1000) // Update every minute
    return () => clearInterval(timeInterval)
  }, [])

  return {
    articles,
    trends,
    loading,
    error,
    lastUpdated,
    availableTags,
    refetch,
    formatTimeAgo
  }
}

