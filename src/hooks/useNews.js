import { useState, useEffect } from 'react'

export function useNews() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch('/api/news')
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const data = await res.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Process articles and add tags based on content
      const processedArticles = data.articles.map(article => ({
        ...article,
        tags: generateTags(article)
      }))
      
      setArticles(processedArticles)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('News fetch error:', err)
      setError(err.message)
      
      // Fallback to mock data if API fails
      setArticles(getMockArticles())
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  // Generate tags based on article content
  const generateTags = (article) => {
    const tags = []
    const content = `${article.title} ${article.description}`.toLowerCase()
    
    // Technology keywords
    if (content.includes('tech') || content.includes('ai') || content.includes('software') || 
        content.includes('computer') || content.includes('digital') || content.includes('internet')) {
      tags.push('Tech')
    }
    
    // Business keywords
    if (content.includes('business') || content.includes('economy') || content.includes('market') || 
        content.includes('finance') || content.includes('company') || content.includes('stock')) {
      tags.push('Business')
    }
    
    // Sports keywords
    if (content.includes('sport') || content.includes('game') || content.includes('team') || 
        content.includes('player') || content.includes('match') || content.includes('championship')) {
      tags.push('Sports')
    }
    
    // Health keywords
    if (content.includes('health') || content.includes('medical') || content.includes('hospital') || 
        content.includes('doctor') || content.includes('disease') || content.includes('vaccine')) {
      tags.push('Health')
    }
    
    // Politics keywords
    if (content.includes('politic') || content.includes('government') || content.includes('president') || 
        content.includes('election') || content.includes('congress') || content.includes('senate')) {
      tags.push('Politics')
    }
    
    // Entertainment keywords
    if (content.includes('entertainment') || content.includes('movie') || content.includes('music') || 
        content.includes('celebrity') || content.includes('film') || content.includes('actor')) {
      tags.push('Entertainment')
    }
    
    // Default to World if no specific tags
    if (tags.length === 0) {
      tags.push('World')
    }
    
    return tags
  }

  // Mock articles as fallback
  const getMockArticles = () => [
    {
      id: 'mock-1',
      title: 'Breaking: Major Tech Conference Announces AI Breakthrough',
      description: 'Leading technology companies unveil revolutionary artificial intelligence capabilities that could transform multiple industries.',
      url: '#',
      imageUrl: 'https://via.placeholder.com/400x200?text=Tech+News',
      publishedAt: new Date().toISOString(),
      source: 'Tech News',
      tags: ['Tech', 'World']
    },
    {
      id: 'mock-2',
      title: 'Global Markets React to Economic Policy Changes',
      description: 'Stock markets worldwide show mixed reactions following announcement of new economic policies by major world economies.',
      url: '#',
      imageUrl: 'https://via.placeholder.com/400x200?text=Business+News',
      publishedAt: new Date().toISOString(),
      source: 'Business Today',
      tags: ['Business', 'World']
    },
    {
      id: 'mock-3',
      title: 'Championship Finals Draw Record Viewership',
      description: 'Sports fans around the globe tune in for what experts are calling one of the most exciting championship matches in recent history.',
      url: '#',
      imageUrl: 'https://via.placeholder.com/400x200?text=Sports+News',
      publishedAt: new Date().toISOString(),
      source: 'Sports Central',
      tags: ['Sports', 'Entertainment']
    },
    {
      id: 'mock-4',
      title: 'New Health Study Reveals Surprising Findings',
      description: 'Researchers publish groundbreaking study that challenges conventional wisdom about nutrition and wellness practices.',
      url: '#',
      imageUrl: 'https://via.placeholder.com/400x200?text=Health+News',
      publishedAt: new Date().toISOString(),
      source: 'Health Today',
      tags: ['Health', 'World']
    },
    {
      id: 'mock-5',
      title: 'Political Leaders Meet for Climate Summit',
      description: 'World leaders gather to discuss urgent climate action and sustainable development goals for the coming decade.',
      url: '#',
      imageUrl: 'https://via.placeholder.com/400x200?text=Politics+News',
      publishedAt: new Date().toISOString(),
      source: 'Global Politics',
      tags: ['Politics', 'World']
    }
  ]

  // Get available tags from articles
  const getAvailableTags = () => {
    const allTags = articles.flatMap(article => article.tags || [])
    const uniqueTags = [...new Set(allTags)]
    
    // Add 'All' as the first option and ensure common tags are included
    const commonTags = ['World', 'Tech', 'Business', 'Sports', 'Health', 'Politics', 'Entertainment']
    const finalTags = ['All', ...commonTags.filter(tag => uniqueTags.includes(tag))]
    
    // Add any additional unique tags
    uniqueTags.forEach(tag => {
      if (!finalTags.includes(tag)) {
        finalTags.push(tag)
      }
    })
    
    return finalTags
  }

  // Generate mock trends data
  const getTrends = () => [
    {
      id: 1,
      title: 'AI Technology Breakthrough',
      mentions: 15420,
      source: 'Tech News'
    },
    {
      id: 2,
      title: 'Global Economic Summit',
      mentions: 12350,
      source: 'Business News'
    },
    {
      id: 3,
      title: 'Championship Finals',
      mentions: 9870,
      source: 'Sports News'
    },
    {
      id: 4,
      title: 'Climate Action Plan',
      mentions: 8640,
      source: 'Environmental News'
    },
    {
      id: 5,
      title: 'Health Research Study',
      mentions: 7230,
      source: 'Medical News'
    }
  ]

  useEffect(() => {
    fetchNews()
    
    // Set up auto-refresh every 15 minutes
    const interval = setInterval(fetchNews, 15 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    articles,
    loading,
    error,
    refetch: fetchNews,
    trends: getTrends(),
    lastUpdated,
    availableTags: getAvailableTags()
  }
}

