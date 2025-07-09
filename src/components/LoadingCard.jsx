import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function LoadingCard() {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
        <div className="absolute top-2 left-2 flex gap-1">
          <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse" />
          <div className="h-6 w-12 bg-gray-300 rounded-full animate-pulse" />
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

