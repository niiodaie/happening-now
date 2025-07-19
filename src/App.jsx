import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNews } from './hooks/useNews'
import { useGeoLocation } from './hooks/useGeoLocation'
import { NewsCard } from './components/NewsCard'
import { LoadingCard } from './components/LoadingCard'
import { FilterTabs } from './components/FilterTabs'
import { TrendingTopics } from './components/TrendingTopics'
import { SubscribeForm } from './components/SubscribeForm'
import { Footer } from './components/Footer'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import AdSlot from './components/AdSlot'
import { LoadingFallback } from './components/LoadingFallback'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Newspaper, RefreshCw, Clock, AlertCircle, Wifi, WifiOff, MapPin, Globe } from 'lucide-react'

function App() {
  const { t } = useTranslation()
  const [isOnline, setIsOnline] = useState(navigator?.onLine ?? true)
  const [appError, setAppError] = useState(null)
  
  // Geo-location hook with error handling
  const { location, loading: locationLoading, error: locationError } = useGeoLocation()
  
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

  // Global error handling
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error:', event.error)
      setAppError(event.error?.message || 'An unexpected error occurred')
    }

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      setAppError(event.reason?.message || 'An unexpected error occurred')
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Filter articles by selected tag
  const filteredArticles = useMemo(() => {
    if (!articles || !Array.isArray(articles)) return []
    
    if (selectedTag === 'All') {
      return articles
    }
    
    return articles.filter(article => 
      article.tags && article.tags.includes(selectedTag)
    )
  }, [articles, selectedTag])

  // Handle refresh with loading state
  const handleRefresh = async () => {
    if (refreshing || loading) return
    
    try {
      setRefreshing(true)
      setAppError(null)
      await refetch()
    } catch (err) {
      console.error('Refresh failed:', err)
      setAppError('Failed to refresh news. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  // Safe translation function
  const safeT = (key, options = {}) => {
    try {
      const translation = t(key, options)
      return translation === key ? key.split('.').pop() : translation
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error)
      return key.split('.').pop()
    }
  }

  // Show app error if exists
  if (appError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {safeT('errors.appError', 'Application Error')}
            </h2>
            <p className="text-gray-600 mb-4">{appError}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {safeT('app.reload', 'Reload Page')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-orange-600 text-white p-2 rounded-lg">
                <Newspaper className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {safeT('app.title', 'Happening Now')}
                </h1>
                <p className="text-sm text-gray-600">
                  {safeT('app.subtitle', 'Real-time news from around the world')}
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center space-x-4">
              {/* Location Display */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {locationLoading ? (
                  <span>{safeT('location.detecting', 'Detecting...')}</span>
                ) : location ? (
                  <span>{location.city}, {location.country}</span>
                ) : (
                  <span>{safeT('location.unavailable', 'Location unavailable')}</span>
                )}
              </div>

              {/* Online Status */}
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? safeT('app.online', 'Online') : safeT('app.offline', 'Offline')}
                </span>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Offline Banner */}
        {!isOnline && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <WifiOff className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">
                    {safeT('app.offlineMode', 'Offline Mode')}
                  </h3>
                  <p className="text-sm text-orange-700">
                    {safeT('app.offlineMessage', 'You are currently offline. Some features may be limited.')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="ml-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {safeT('app.retry', 'Retry')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">
                    {safeT('errors.loadingFailed', 'Failed to load news')}
                  </h3>
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="ml-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {safeT('app.retry', 'Retry')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {safeT('app.lastUpdated', 'Last updated')}: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
              {safeT('app.refresh', 'Refresh')}
            </Button>
          </div>
        )}

        {/* Trending Topics */}
        <TrendingTopics trends={trends} />

        {/* Ad Slot - Top */}
        <AdSlot position="top" />

        {/* Filter Tabs */}
        <FilterTabs
          tags={availableTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : filteredArticles.length > 0 ? (
            // News articles
            filteredArticles.map((article, index) => (
              <NewsCard
                key={article.id || index}
                article={article}
                variant={index === 0 ? 'featured' : 'default'}
              />
            ))
          ) : (
            // No articles state
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {safeT('app.noArticles', 'No articles found')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedTag === 'All' 
                      ? safeT('app.noArticlesMessage', 'No articles are currently available. Please try refreshing.')
                      : safeT('app.noArticlesForTag', 'No articles found for the selected category.')
                    }
                  </p>
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {safeT('app.refresh', 'Refresh')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Ad Slot - Middle */}
        <AdSlot position="middle" />

        {/* Subscribe Form */}
        <SubscribeForm />

        {/* Ad Slot - Bottom */}
        <AdSlot position="bottom" />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App

