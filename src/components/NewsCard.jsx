import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Clock, ExternalLink, Share, User } from 'lucide-react'
import SocialShare from './SocialShare'
import { formatTimeAgo, generateSlug } from '@/lib/utils'
import { shareNews, shareNewsToWhatsApp } from '@/lib/shareUtils'

export function NewsCard({ article }) {
  // Enhanced error handling for article sharing
  const handleShare = async () => {
    try {
      if (!article) {
        throw new Error('Article data is missing')
      }
      
      const title = article.title || 'News Article'
      const url = article.url || window.location.href
      const summary = article.summary || ''
      
      await shareNews(title, url, summary);
    } catch (err) {
      console.error('Error sharing article:', err);
      
      // Enhanced fallback to WhatsApp
      try {
        if (article) {
          shareNewsToWhatsApp(article);
        } else {
          // Final fallback
          const fallbackUrl = `https://wa.me/?text=${encodeURIComponent('Check out this news from Happening Now!')}`
          window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
        }
      } catch (fallbackErr) {
        console.error('Fallback sharing failed:', fallbackErr)
        alert('Sharing failed. Please try again.')
      }
    }
  }

  // Enhanced safe article data handling
  const safeArticle = article || {}
  const title = safeArticle.title || 'Untitled Article'
  const image = safeArticle.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'
  const tags = Array.isArray(safeArticle.tags) ? safeArticle.tags : []
  const summary = safeArticle.summary || 'No summary available.'
  const source = safeArticle.source || 'Unknown Source'
  const timestamp = safeArticle.timestamp || new Date()
  const url = safeArticle.url || '#'

  const slug = generateSlug(title)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden hover-lift">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.warn('Image failed to load:', e.target.src)
            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'
          }}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-black/70 text-white border-0 backdrop-blur-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-black/70 text-white hover:bg-black/80 backdrop-blur-sm"
          onClick={handleShare}
          title="Share this article"
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-bold text-lg leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Clock className="h-4 w-4" />
          <span>{formatTimeAgo(timestamp)}</span>
          <span>•</span>
          <User className="h-4 w-4" />
          <span>{source}</span>
        </div>
        
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {summary}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tags.slice(2, 4).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="group/btn hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700"
            onClick={() => {
              try {
                if (url && url !== '#') {
                  window.open(url, '_blank', 'noopener,noreferrer')
                } else {
                  console.warn('No valid URL for article')
                  alert('Article link not available')
                }
              } catch (error) {
                console.error('Error opening article:', error)
                alert('Failed to open article')
              }
            }}
          >
            Read More
            <ExternalLink className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
        
        {/* Enhanced Social Sharing */}
        <SocialShare 
          article={safeArticle}
          url={url}
          title={title}
          description={summary}
          className="flex gap-2 mt-3 pt-3 border-t border-gray-100"
        />
      </CardContent>
    </Card>
  )
}

