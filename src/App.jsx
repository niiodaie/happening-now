import { useState, useEffect } from 'react'
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

const CACHE_INTERVAL = 30 * 60 * 1000 // 30 mins
const LAST_FETCH_KEY = 'hn_last_fetch'
const LAST_DATA_KEY = 'hn_cached_articles'

function App() {
  const { t } = useTranslation()
  const [isOnline, setIsOnline] = useState(navigator?.onLine ?? true)
  const [appError, setAppError] = useState(null)
  const [geoLocationError, setGeoLocationError] = useState(null)

  const geo = useGeoLocation()

  const {
    articles = [],
    trends = [],
    loading = false,
    error,
    lastUpdated,
    availableTags = [],
    refetch
  } = useNews({ useCache: true, cacheKey: LAST_FETCH_KEY, cacheDataKey: LAST_DATA_KEY, interval: CACHE_INTERVAL }) || {}

  const [selectedTag, setSelectedTag] = useState('All')
  const [refreshing, setRefreshing] = useState(false)

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine && refetch) {
        refetch()
      }
    }, 10 * 60 * 1000) // every 10 minutes
    return () => clearInterval(interval)
  }, [refetch])

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      setAppError(null)
      if (refetch && typeof refetch === 'function') {
        await refetch(true)
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
      const safeTag = tag && typeof tag === 'string' ? tag : 'All'
      setSelectedTag(safeTag)
    } catch (error) {
      setSelectedTag('All')
    }
  }

  const filteredArticles = selectedTag === 'All'
    ? articles
    : articles.filter(article => article?.tags?.includes?.(selectedTag))

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center p-8">
            <WifiOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            className="text-xl font-semibold text-gray-900 mb-2">{t('app.failedToLoad')}</h2>
            <p className="text-gray-600 mb-4">{t('app.noArticlesAvailable')}</p>
            <Button onClick={() => window.location.reload()}>{t('app.tryAgain')}</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (appError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 border-red-200">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{appError}</p>
            <Button onClick={handleRefresh}>Refresh Page</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="HN" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-gray-900">{t('app.title')}</h1>
          </div>
          <div className="flex gap-2 items-center">
            <LanguageSwitcher />
            <Button onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {t('app.refresh')}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Hot Deal Section */}
        <div className="mb-6">
          <a
            href="https://amzn.to/44mFp0h"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-yellow-100 border border-yellow-300 rounded-md p-4 text-center hover:bg-yellow-200"
          >
            🛍️ Hot Deal: Check out our favorite gadget on Amazon!
          </a>
        </div>

        {error && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="p-4 text-red-700">
              <AlertCircle className="inline-block mr-2" />
              Failed to load news. {error}
            </CardContent>
          </Card>
        )}

        {trends?.length > 0 && (
          <TrendingTopics trends={trends} loading={loading} />
        )}

        {availableTags?.length > 0 && (
          <FilterTabs tags={availableTags} selectedTag={selectedTag} onTagSelect={handleTagSelect} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => <LoadingCard key={idx} />)
            : filteredArticles.map((article, idx) => (
                <NewsCard key={article.id || idx} article={article} />
              ))
          }
        </div>

        <div className="mt-12 max-w-md mx-auto">
          <SubscribeForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App;
