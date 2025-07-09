import { useState, useEffect, useCallback } from 'react'

const API_BASE_URL = '/api'

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

      // Fetch news articles
      const newsResponse = await fetch(`${API_BASE_URL}/news`)
      if (!newsResponse.ok) {
        throw new Error(`HTTP error! status: ${newsResponse.status}`)
      }
      const newsData = await newsResponse.json()

      // Fetch trending topics
      const trendsResponse = await fetch(`${API_BASE_URL}/trends`)
      const trendsData = trendsResponse.ok ? await trendsResponse.json() : { trends: [] }

      setArticles(newsData.articles || [])
      setTrends(trendsData.trends || [])
      setLastUpdated(new Date())

      // Extract unique tags
      const tags = ['All']
      newsData.articles?.forEach(article => {
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
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    return fetchNews()
  }, [fetchNews])

  useEffect(() => {
    fetchNews()

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchNews])

  return {
    articles,
    trends,
    loading,
    error,
    lastUpdated,
    availableTags,
    refetch
  }
}

