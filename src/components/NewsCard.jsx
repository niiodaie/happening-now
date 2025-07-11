import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Clock, ExternalLink, Share, User } from 'lucide-react'
import SocialShare from './SocialShare'
import { formatTimeAgo, generateSlug } from '@/lib/utils'
import { shareNews, shareNewsToWhatsApp } from '@/lib/shareUtils'

export default function NewsCard({ article }) {
  if (!article) return null;

  return (
    <Card>
      <CardHeader>{article.title}</CardHeader>
      <CardContent>
        <p>{article.description}</p>
        <Button onClick={() => shareNews(article)}>Share</Button>
      </CardContent>
    </Card>
  );
}