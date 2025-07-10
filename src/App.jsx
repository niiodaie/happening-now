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
import LoadingFallback from './components/LoadingFallback'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Newspaper, RefreshCw, Clock, AlertCircle, Wifi, WifiOff, Share } from 'lucide-react'

// Temporarily disabled AdSlot components to fix 400 errors
const HeaderAd = () => null
const SidebarAd = () => null
const ArticleAd = () => null

// Enhanced error logging utility
const logError = (context, error, additionalInfo = {}) => {
  const errorInfo = {
    context,
    error: error?.message || error,
    stack: error?.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator?.userAgent,
    url: window?.location?.href,
    ...additionalInfo
  }
  
  console.error(`[${context}]`, errorInfo)
  
  // In production, you could send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorService(errorInfo)
  }
}

function App() {
  const { t } = useTranslation()
  const [isOnline, setIsOnline] = useState(navigator?.onLine ?? true)
  const [appError, setAppError] = useState(null)
  const [geoLocationError, setGeoLocationError] = useState(null)
  
  // Enhanced safe geo-location hook usage with error handling
  useEffect(() => {
    try {
      useGeoLocation()
    } catch (error) {
      logError('GeoLocation', error)
      setGeoLocationError('Location detection failed')
      console.warn('Geo-location failed:', error)
    }
  }, [])
  
  // Enhanced news hook with better error handling
  let newsData = {}
  try {
    newsData = useNews() || {}
  } catch (error) {
    logError('NewsHook', error)
    newsData = {}
  }
  
  const { 
    articles = [], 
    trends = [], 
    loading = false, 
    error, 
    lastUpdated, 
    availableTags = [], 
    refetch 
  } = newsData
  
  const [selectedTag, setSelectedTag] = useState('All')
  const [refreshing, setRefreshing] = useState(false)

  // Enhanced online status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      logError('NetworkStatus', 'Back online', { status: 'online' })
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      logError('NetworkStatus', 'Gone offline', { status: 'offline' })
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Enhanced global error handling
  useEffect(() => {
    const handleGlobalError = (event) => {
      logError('GlobalError', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
      setAppError('An unexpected error occurred. Please refresh the page.')
    }
    
    const handleUnhandledRejection = (event) => {
      logError('UnhandledRejection', event.reason)
      setAppError('A network error occurred. Please check your connection.')
    }
    
    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Enhanced article filtering with robust error handling
  const filteredArticles = useMemo(() => {
    try {
      // Defensive checks for articles
      if (!articles) {
        logError('ArticleFilter', 'Articles is null/undefined')
        return []
      }
      
      if (!Array.isArray(articles)) {
        logError('ArticleFilter', 'Articles is not an array', { 
          type: typeof articles, 
          value: articles 
        })
        return []
      }
      
      if (articles.length === 0) {
        return []
      }
      
      // Defensive check for selectedTag
      const safeSelectedTag = selectedTag || 'All'
      
      if (safeSelectedTag === 'All') {
        return articles.filter(article => article && typeof article === 'object')
      }
      
      return articles.filter(article => {
        try {
          if (!article || typeof article !== 'object') {
            return false
          }
          
          const tags = article.tags
          if (!tags) return false
          
          if (!Array.isArray(tags)) {
            logError('ArticleFilter', 'Article tags is not an array', { 
              articleId: article.id,
              tags: tags 
            })
            return false
          }
          
          return tags.includes(safeSelectedTag)
        } catch (filterError) {
          logError('ArticleFilter', filterError, { 
            articleId: article?.id,
            selectedTag: safeSelectedTag 
          })
          return false
        }
      })
    } catch (error) {
      logError('ArticleFilter', error, { 
        articlesLength: articles?.length,
        selectedTag 
      })
      return []
    }
  }, [articles, selectedTag])

  // Enhanced refresh handler
  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      setAppError(null)
      
      if (!refetch) {
        throw new Error('Refetch function not available')
      }
      
      if (typeof refetch !== 'function') {
        throw new Error('Refetch is not a function')
      }
      
      await refetch()
      logError('Refresh', 'Refresh successful', { timestamp: new Date().toISOString() })
    } catch (error) {
      logError('Refresh', error)
      setAppError('Failed to refresh. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  // Enhanced tag selection handler
  const handleTagSelect = (tag) => {
    try {
      const safeTag = tag && typeof tag === 'string' ? tag : 'All'
      setSelectedTag(safeTag)
      logError('TagSelect', 'Tag selected', { tag: safeTag })
    } catch (error) {
      logError('TagSelect', error, { tag })
      setSelectedTag('All')
    }
  }

  // Enhanced safe translation function
  const safeT = (key, options = {}) => {
    try {
      if (!key || typeof key !== 'string') {
        return key || 'Translation key missing'
      }
      
      const result = t(key, options)
      return result || key.split('.').pop()
    } catch (error) {
      logError('Translation', error, { key, options })
      return key?.split?.('.')?.pop() || 'Translation failed'
    }
  }

  // Enhanced WhatsApp sharing function
  const handleSharePage = async () => {
    try {
      const shareData = {
        title: safeT('app.title') || 'Happening Now',
        text: safeT('app.subtitle') || 'Real-time news from around the world',
        url: window.location.href
      }
      
      if (navigator.share) {
        await navigator.share(shareData)
        logError('Share', 'Native share successful')
      } else {
        // Fallback to WhatsApp
        const message = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
        logError('Share', 'WhatsApp fallback used')
      }
    } catch (error) {
      logError('Share', error)
      // Final fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      } catch (clipboardError) {
        logError('Share', clipboardError)
        alert('Sharing failed. Please copy the URL manually.')
      }
    }
  }

  // Offline state with enhanced error info
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
            {geoLocationError && (
              <p className="text-sm text-orange-600 mb-4">
                Note: {geoLocationError}
              </p>
            )}
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Enhanced app error state
  if (appError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 border-red-200">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{appError}</p>
            {geoLocationError && (
              <p className="text-sm text-orange-600 mb-4">
                Additional issue: {geoLocationError}
              </p>
            )}
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
                    logError('LogoLoad', 'Logo failed to load')
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
              
              {/* Share Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSharePage}
                className="flex items-center gap-2"
                title="Share this page"
              >
                <Share className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Enhanced Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Failed to load news</p>
                <p className="text-sm text-red-600">{error}</p>
                {geoLocationError && (
                  <p className="text-xs text-orange-600 mt-1">
                    Location: {geoLocationError}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-auto">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Trending Topics with enhanced safety */}
        {!loading && Array.isArray(trends) && trends.length > 0 && (
          <TrendingTopics trends={trends} loading={loading} />
        )}

        {/* Filter Tabs with enhanced safety */}
        {!loading && Array.isArray(availableTags) && availableTags.length > 0 && (
          <FilterTabs 
            tags={availableTags}
            selectedTag={selectedTag || 'All'}
            onTagSelect={handleTagSelect}
          />
        )}

        {/* Enhanced Article Count */}
        {!loading && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredArticles?.length || 0} article{(filteredArticles?.length || 0) !== 1 ? 's' : ''}
              {selectedTag && selectedTag !== 'All' && ` tagged with "${selectedTag}"`}
              {geoLocationError && (
                <span className="text-orange-600 ml-2">
                  (Location detection unavailable)
                </span>
              )}
            </p>
          </div>
        )}

        {/* Enhanced News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            // Loading state
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : Array.isArray(filteredArticles) && filteredArticles.length > 0 ? (
            // Articles with enhanced error handling
            filteredArticles.map((article, index) => {
              try {
                return (
                  <NewsCard 
                    key={article?.id || `article-${index}`} 
                    article={article} 
                  />
                )
              } catch (cardError) {
                logError('NewsCard', cardError, { articleId: article?.id, index })
                return (
                  <Card key={`error-${index}`} className="border-red-200">
                    <CardContent className="p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-red-600">
                        Failed to load article
                      </p>
                    </CardContent>
                  </Card>
                )
              }
            })
          ) : (
            // Enhanced no articles state
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
                {error && (
                  <span className="block text-red-600 text-sm mt-2">
                    There was an error loading articles: {error}
                  </span>
                )}
              </p>
              <div className="space-y-2">
                <Button variant="outline" onClick={handleRefresh}>
                  Refresh News
                </Button>
                <Button variant="ghost" onClick={handleSharePage} className="ml-2">
                  <Share className="h-4 w-4 mr-2" />
                  Share Page
                </Button>
              </div>
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

