import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, ExternalLink, Share, User } from 'lucide-react';
import SocialShare from './SocialShare'; // ✅ fixed import

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const publishedDate = new Date(dateString);
  const diffInMinutes = Math.floor((now - publishedDate) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export function NewsCard({ article, variant = 'default' }) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url || window.location.href,
        });
      } else {
        const text = encodeURIComponent(`${article.title}\n\n${article.description}\n\n${article.url || window.location.href}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const timeAgo = article.timeAgo || formatTimeAgo(article.publishedAt);
  const isBreaking = timeAgo.includes('m ago') && parseInt(timeAgo) < 30;

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden ${variant === 'featured' ? 'md:col-span-2 lg:col-span-2' : ''}`}>
      <div className="relative">
        <img
          src={article.imageUrl || article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'}
          alt={article.title}
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${variant === 'featured' ? 'h-64' : 'h-48'}`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop';
          }}
        />
        {isBreaking && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 text-white border-0 animate-pulse">🔴 BREAKING</Badge>
          </div>
        )}
        <div className={`absolute ${isBreaking ? 'top-12' : 'top-2'} left-2 flex flex-wrap gap-1`}>
          {article.tags?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-black/70 text-white border-0 backdrop-blur-sm">{tag}</Badge>
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

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span className="font-medium">{article.source || 'News Source'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className={`font-medium ${isBreaking ? 'text-red-600' : ''}`}>{timeAgo}</span>
          </div>
        </div>
        <h3 className={`font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 ${variant === 'featured' ? 'text-xl' : 'text-lg'}`}>
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.description}</p>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700"
            onClick={() => window.open(article.url || '#', '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
            Read More
          </Button>
          <SocialShare
            title={article.title}
            url={article.url || window.location.href}
            description={article.description}
            article={article}
          />
        </div>
      </CardContent>
    </Card>
  );
}
