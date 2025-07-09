import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Activity, Globe, MessageSquare } from 'lucide-react'

export function TrendingTopics({ trends = [], loading = false }) {
  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            What's Hot Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSourceIcon = (source) => {
    switch (source) {
      case 'Google Trends':
        return <Globe className="h-3 w-3" />
      case 'Reddit':
        return <MessageSquare className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const getSourceColor = (source) => {
    switch (source) {
      case 'Google Trends':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Reddit':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          What's Hot Now
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {trends.map((trend, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`flex items-center gap-1 px-3 py-1 text-sm font-medium transition-all hover:scale-105 cursor-pointer ${getSourceColor(trend.source)}`}
              title={`${trend.count} mentions from ${trend.source}`}
            >
              {getSourceIcon(trend.source)}
              <span>{trend.keyword}</span>
              <span className="text-xs opacity-75">({trend.count})</span>
            </Badge>
          ))}
        </div>
        {trends.length > 0 && (
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>Google Trends</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>Reddit</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span>Mock Data</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

