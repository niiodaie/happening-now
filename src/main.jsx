// File: main.jsx
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import LoadingFallback from './components/LoadingFallback.jsx'

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);


// File: App.jsx (initial import section)
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
// import { HeaderAd, SidebarAd, ArticleAd } from './components/AdSlot' // temporarily disabled to fix 400s
import LoadingFallback from './components/LoadingFallback'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Newspaper, RefreshCw, Clock, AlertCircle, Wifi, WifiOff, Share } from 'lucide-react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

// Set up request limiter
const CACHE_INTERVAL = 30 * 60 * 1000; // 30 mins
const LAST_FETCH_KEY = 'hn_last_fetch';
const LAST_DATA_KEY = 'hn_cached_articles';

function App() {
  const { t } = useTranslation()
  const [isOnline, setIsOnline] = useState(navigator?.onLine ?? true)
  const [appError, setAppError] = useState(null)
  const [geoLocationError, setGeoLocationError] = useState(null)

  useEffect(() => {
    try {
      useGeoLocation()
    } catch (error) {
      setGeoLocationError('Location detection failed')
      console.warn('Geo-location failed:', error)
    }
  }, [])

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

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      setAppError(null)
      if (refetch && typeof refetch === 'function') {
        await refetch(true) // bypass cache on manual refresh
      }
    } catch (error) {
      console.error('Refresh failed:', error)
      setAppError('Failed to refresh. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  // ... the rest of your rendering logic (unchanged) ...
}

export default App;
