import { useState, useMemo } from 'react'
import { useNews } from './hooks/useNews'
import { NewsCard } from './components/NewsCard'
import { LoadingCard } from './components/LoadingCard'
import { FilterTabs } from './components/FilterTabs'
import { TrendingTopics } from './components/TrendingTopics'
import { SubscribeForm } from './components/SubscribeForm'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Newspaper, RefreshCw, Clock, AlertCircle } from 'lucide-react'

function App() {
  const { articles, trends, loading, error, lastUpdated, availableTags, refetch } = useNews()
  const [selectedTag, setSelectedTag] = useState('All')
  const [refreshing, setRefreshing] = useState(false)

  // Filter articles by selected tag
  const filteredArticles = useMemo(() => {
    if (selectedTag === 'All') return articles
    return articles.filter(article => 
      article.tags && article.tags.includes(selectedTag)
    )
  }, [articles, selectedTag])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Newspaper className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Happening Now</h1>
                <p className="text-sm text-gray-600">Real-time news updates</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
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
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

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
        {!loading && trends.length > 0 && (
          <TrendingTopics trends={trends} loading={loading} />
        )}

        {/* Filter Tabs */}
        {!loading && availableTags.length > 0 && (
          <FilterTabs 
            tags={availableTags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
        )}

        {/* Article Count */}
        {!loading && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
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
          ) : filteredArticles.length > 0 ? (
            // Articles
            filteredArticles.map((article, index) => (
              <NewsCard key={index} article={article} />
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
    </div>
  )
}

export default App

