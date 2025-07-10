import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNews } from './hooks/useNews'
import useGeoLocation from './hooks/useGeoLocation'
import { NewsCard } from './components/NewsCard'
import { LoadingCard } from './components/LoadingCard'
import { FilterTabs } from './components/FilterTabs'
import { TrendingTopics } from './components/TrendingTopics'
import { SubscribeForm } from './components/SubscribeForm'
import Footer from './components/Footer'
import LanguageSwitcher from './components/LanguageSwitcher'
import { HeaderAd, SidebarAd, ArticleAd } from './components/AdSlot'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Newspaper, RefreshCw, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react'

function App() {
  const { t } = useTranslation()
  const [isOnline, setIsOnline] = useState(navigator?.onlineState ?? true)
  const [appError, setAppError] = useState(null)
  
  // Safe geo-location hook usage
  try {
    useGeoLocation()
  } catch (error) {
    console.warn('Geo-location failed:', error)
  }
  
  const { 
    articles = [], 
    trends = [], 
    loading = false, 
    error, 
    lastUpdated, 
    availableTags = [], 
    refetch 
  } = useNews() || {}
  
  const [selectedTag, setSelectedTag] = useState('All')
  const [refreshing, setRefreshing] = useState(false)

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Global error boundary effect
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error:', event.error)
      setAppError('An unexpected error occurred. Please refresh the page.')
    }
    
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      setAppError('A network error occurred. Please check your connection.')
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Filter articles by selected tag with safe array handling
  const filteredArticles = useMemo(() => {
    try {
      if (!Array.isArray(articles)) return []
      if (selectedTag === 'All') return articles
      return articles.filter(article => 
        article?.tags && Array.isArray(article.tags) && article.tags.includes(selectedTag)
      )
    } catch (error) {
      console.error('Error filtering articles:', error)
      return []
    }
  }, [articles, selectedTag])

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      setAppError(null)
      if (refetch && typeof refetch === 'function') {
        await refetch()
      }
    } catch (error) {
      console.error('Refresh failed:', error)
      setAppError('Failed to refresh. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  const handleTagSelect = (tag) => {
    try {
      setSelectedTag(tag || 'All')
    } catch (error) {
      console.error('Error selecting tag:', error)
      setSelectedTag('All')
    }
  }

  // Safe translation function
  const safeT = (key, options = {}) => {
    try {
      return t(key, options)
    } catch (error) {
      console.warn('Translation failed for key:', key)
      return key.split('.').pop() // Return the last part of the key as fallback
    }
  }

  // Offline banner
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center p-8">
            <WifiOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">You're offline</h2>
            <p className="text-gray-600 mb-4">
              Please check your internet connection and try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // App error state
  if (appError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 border-red-200">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{appError}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Refresh Page
              </Button>
              <Button variant="outline" onClick={() => setAppError(null)} className="w-full">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border">
                <img 
                  src="/logo.png" 
                  alt="HN Logo" 
                  className="h-8 w-8"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'block'
                  }}
                />
                <Newspaper className="h-8 w-8 text-blue-600" style={{ display: 'none' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {safeT('app.title') || 'Happening Now'}
                </h1>
                <p className="text-sm text-gray-600">
                  {safeT('app.subtitle') || 'Real-time news from around the world'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              
              {lastUpdated && (
                <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {safeT('app.lastUpdated', { 
                      time: lastUpdated?.toLocaleTimeString?.() || 'Unknown' 
                    }) || `Updated: ${lastUpdated?.toLocaleTimeString?.() || 'Unknown'}`}
                  </span>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {safeT('app.refresh') || 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Header Ad */}
      <HeaderAd />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Failed to load news</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-auto">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Trending Topics */}
        {!loading && Array.isArray(trends) && trends.length > 0 && (
          <TrendingTopics trends={trends} loading={loading} />
        )}

        {/* Article Ad */}
        <ArticleAd />

        {/* Filter Tabs */}
        {!loading && Array.isArray(availableTags) && availableTags.length > 0 && (
          <FilterTabs 
            tags={availableTags}
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
          />
        )}

        {/* Article Count */}
        {!loading && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredArticles?.length || 0} article{(filteredArticles?.length || 0) !== 1 ? 's' : ''}
              {selectedTag !== 'All' && ` tagged with "${selectedTag}"`}
            </p>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            // Loading state
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : Array.isArray(filteredArticles) && filteredArticles.length > 0 ? (
            // Articles
            filteredArticles.map((article, index) => (
              <NewsCard key={article?.id || index} article={article} />
            ))
          ) : (
            // No articles state
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Newspaper className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">
                {selectedTag === 'All' 
                  ? 'No news articles are currently available.' 
                  : `No articles found for "${selectedTag}".`
                }
              </p>
              <Button variant="outline" onClick={handleRefresh}>
                Refresh News
              </Button>
            </div>
          )}
        </div>

        {/* Email Subscription Form */}
        {!loading && (
          <div className="mt-12 max-w-md mx-auto">
            <SubscribeForm />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App

