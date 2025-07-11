import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNews } from './hooks/useNews'
import { useGeoLocation } from './hooks/useGeoLocation'
import { NewsCard } from './components/NewsCard'
import { FilterTabs } from './components/FilterTabs'
import { TrendingTopics } from './components/TrendingTopics'
import { SubscribeForm } from './components/SubscribeForm'
import { Footer } from './components/Footer'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { LoadingCard } from './components/LoadingCard'
import { AdSlot } from './components/AdSlot'
import { WhatsAppShare } from './components/WhatsAppShare'
import { SocialShare } from './components/SocialShare'
import { HotDeals } from './components/HotDeals'
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Globe, MapPin, Clock, Wifi, WifiOff, RefreshCw, AlertCircle, Zap, TrendingUp } from 'lucide-react'
import i18n from './i18n'

function App() {
  const { t } = useTranslation()
  const { articles, loading, error, refetch, trends, lastUpdated, availableTags } = useNews()
  const { location, loading: locationLoading, error: locationError } = useGeoLocation()
  const [selectedTag, setSelectedTag] = useState('All')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showHotDeals, setShowHotDeals] = useState(false)

  // RTL and language support
  useEffect(() => {
    const rtlLanguages = ['ar'] // Add more like 'he', 'fa', 'ur' if needed
    document.documentElement.lang = i18n.language
    document.documentElement.dir = rtlLanguages.includes(i18n.language) ? 'rtl' : 'ltr'
  }, [i18n.language])

  // Online/offline detection
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
    }

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
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

  // Safe function for translations with fallback
  const safeT = (key, options = {}) => {
    try {
      const translation = t(key, options)
      return translation === key ? key.split('.').pop() : translation
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error)
      return key.split('.').pop()
    }
  }

  // Breaking news ticker data
  const breakingNews = useMemo(() => {
    if (!articles || articles.length === 0) return []
    return articles.slice(0, 3).map(article => ({
      id: article.id,
      title: article.title,
      time: new Date(article.publishedAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }))
  }, [articles])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 overflow-hidden">
          <div className="flex items-center">
            <div className="bg-white text-red-600 px-3 py-1 font-bold text-sm flex items-center gap-1 mr-4">
              <Zap className="h-4 w-4" />
              {safeT('app.breaking')}
            </div>
            <div className="flex animate-marquee whitespace-nowrap">
              {breakingNews.map((news, index) => (
                <span key={news.id} className="mx-8 text-sm">
                  <span className="font-semibold">{news.time}</span> - {news.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {safeT('app.title')}
                </h1>
                <p className="text-sm text-gray-600">
                  {safeT('app.subtitle')}
                </p>
              </div>
            </div>

            {/* Location and Language */}
            <div className="flex items-center space-x-4">
              {/* Location Display */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {locationLoading ? (
                  <span>{safeT('location.detecting')}</span>
                ) : location ? (
                  <span>{location.city}, {location.country}</span>
                ) : (
                  <span>{safeT('location.unavailable')}</span>
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
                  {isOnline ? safeT('app.online') : safeT('app.offline')}
                </span>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Hot Deals Button */}
              <Button
                onClick={() => setShowHotDeals(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <span className="text-lg">🔥</span>
                <span className="hidden sm:inline">{safeT('hotDeals.title')}</span>
                <Badge className="bg-white/20 text-white text-xs animate-pulse">
                  {safeT('app.new')}
                </Badge>
              </Button>
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
                    {safeT('app.offlineMode')}
                  </h3>
                  <p className="text-sm text-orange-700">
                    {safeT('app.offlineMessage')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  className="ml-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {safeT('app.retry')}
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
                    {safeT('errors.loadingFailed')}
                  </h3>
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  className="ml-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {safeT('app.retry')}
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
                {safeT('app.lastUpdated', { 
                  time: lastUpdated.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })
                })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {safeT('app.refresh')}
            </Button>
          </div>
        )}

        {/* Trending Topics */}
        <TrendingTopics trends={trends} />

        {/* Ad Slot - Top */}
        <AdSlot position="top" />

        {/* Filter Tabs */}
        <FilterTabs
          tags={availableTags || []}
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
          ) : filteredArticles && filteredArticles.length > 0 ? (
            // News articles
            filteredArticles.map((article, index) => (
              <NewsCard
                key={article.id || index}
                article={article}
                variant={index === 0 ? 'featured' : index < 3 ? 'compact' : 'default'}
              />
            ))
          ) : (
            // No articles state
            <div className="col-span-full">
              <Card className="text-center py-12">
                <CardContent>
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {safeT('app.noArticles')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedTag === 'All' 
                      ? safeT('app.noArticlesMessage')
                      : safeT('app.noArticlesForTag', { tag: selectedTag })
                    }
                  </p>
                  <Button onClick={refetch} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {safeT('app.refresh')}
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

        {/* Social Share */}
        <SocialShare
          title={safeT('app.title')}
          description={safeT('app.subtitle')}
          url={window.location.href}
          hashtags={['news', 'trending', 'happeningnow']}
          className="mb-8"
        />

        {/* WhatsApp Share */}
        <WhatsAppShare />

        {/* Ad Slot - Bottom */}
        <AdSlot position="bottom" />
      </main>

      {/* Footer */}
      <Footer />

      {/* Hot Deals Modal */}
      {showHotDeals && (
        <HotDeals
          isOpen={showHotDeals}
          onClose={() => setShowHotDeals(false)}
        />
      )}

      {/* Floating Social Share */}
      <SocialShare
        variant="floating"
        title={safeT('app.title')}
        description={safeT('app.subtitle')}
        url={window.location.href}
        hashtags={['news', 'trending', 'happeningnow']}
      />
    </div>
  )
}

export default App

