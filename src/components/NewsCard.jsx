import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Clock, ExternalLink } from 'lucide-react'
import SocialShare from './SocialShare'
import { formatTimeAgo, generateSlug } from '@/lib/utils'

export function NewsCard({ article }) {
  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.summary,
      url: article.url
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(article.url)
    }
  }

  const slug = generateSlug(article.title)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden hover-lift">
      <div className="relative">
        <img 
          src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'} 
          alt={article.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'
          }}
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {article.tags?.slice(0, 2).map((tag, index) => (
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
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-bold text-lg leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Clock className="h-4 w-4" />
          <span>{formatTimeAgo(article.timestamp)}</span>
          <span>•</span>
          <User className="h-4 w-4" />
          <span>{article.source}</span>
        </div>
        
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.summary || 'No summary available.'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {article.tags?.slice(2, 4).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="group/btn hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700"
            onClick={() => window.open(article.url, '_blank')}
          >
            Read More
            <ExternalLink className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
        
        {/* Social Sharing */}
        <SocialShare 
          url={article.url}
          title={article.title}
          description={article.summary || ''}
          className="flex gap-2 mt-3 pt-3 border-t border-gray-100"
        />
      </CardContent>
    </Card>
  )
}

