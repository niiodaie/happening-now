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
import { Newspaper, RefreshCw, Clock, AlertCircle, WifiOff } from 'lucide-react'

function App() {
  const { t } = useTranslation()
  const [isOnline, setIsOnline] = useState(navigator?.onLine ?? true)
  const [appError, setAppError] = useState(null)

  // WhatsApp + Web Share fallback
  const handleShare = ({ title = document.title, url = window.location.href } = {}) => {
    try {
      if (navigator.share) {
        navigator.share({ title, url }).catch(() => openWhatsAppFallback(title, url))
      } else {
        openWhatsAppFallback(title, url)
      }
    } catch (e) {
      openWhatsAppFallback(title, url)
    }
  }

  const openWhatsAppFallback = (title, url) => {
    const link = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    window.open(link, '_blank')
  }

  try {
    useGeoLocation()
  } catch (e) {
    console.warn('Geo-location failed:', e)
  }

  const {
    articles = [],
    trends = [],
    loading = false,
    error,
    lastUpdated,
    availableTags = [],
    refetch,
  } = useNews() || {}

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

  const filteredArticles = useMemo(() => {
    try {
      if (!Array.isArray(articles)) return []
      if (selectedTag === 'All') return articles
      return articles.filter((a) => a?.tags?.includes?.(selectedTag))
    } catch (e) {
      console.warn('Filter error:', e)
      return []
    }
  }, [articles, selectedTag])

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      setAppError(null)
      if (typeof refetch === 'function') await refetch()
    } catch (e) {
      setAppError('Failed to refresh. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  const safeT = (key, options = {}) => {
    try {
      return t(key, options)
    } catch {
      return key.split('.').pop()
    }
  }

  // Offline UI
  if (!isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <WifiOff className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">You're offline</h2>
            <p className="text-gray-600 mb-4">Please check your connection.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // App error UI
  if (appError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto border-red-200">
          <CardContent className="text-center p-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{appError}</p>
            <Button className="w-full mb-2" onClick={() => window.location.reload()}>Refresh Page</Button>
            <Button variant="outline" className="w-full" onClick={() => setAppError(null)}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-3 items-center">
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
              <h1 className="text-xl font-bold text-gray-900">{safeT('app.title') || 'Happening Now'}</h1>
              <p className="text-sm text-gray-600">{safeT('app.subtitle') || 'Real-time news from around the world'}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <LanguageSwitcher />
            {lastUpdated && (
              <div className="text-sm text-gray-500 hidden sm:flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{safeT('app.lastUpdated', { time: lastUpdated?.toLocaleTimeString?.() })}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {safeT('app.refresh') || 'Refresh'}
            </Button>
          </div>
        </div>
      </header>

      <HeaderAd />

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6">
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

        {trends.length > 0 && <TrendingTopics trends={trends} loading={loading} />}
        <ArticleAd />

        <FilterTabs
          tags={availableTags}
          selectedTag={selectedTag}
          onTagSelect={(tag) => setSelectedTag(tag || 'All')}
        />

        {!loading && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
            {selectedTag !== 'All' && ` tagged with "${selectedTag}"`}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)
            : filteredArticles.map((article, i) => <NewsCard key={article?.id || i} article={article} />)
          }
        </div>

        {/* Share Button */}
        <div className="text-center mt-8">
          <Button onClick={handleShare}>📤 Share this page</Button>
        </div>

        <div className="mt-12 max-w-md mx-auto">
          <SubscribeForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
