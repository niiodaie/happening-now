import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { X, Flame, ExternalLink, Clock, Star, TrendingUp, Zap, ShoppingCart, Filter } from 'lucide-react'

const HotDeals = ({ isOpen, onClose, deals = [] }) => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Default mock deals if none provided
  const defaultDeals = [
    {
      id: 1,
      title: "Amazon Echo Dot - 55% Off",
      description: "Smart speaker with Alexa - Perfect for news updates",
      originalPrice: 49.99,
      salePrice: 22.49,
      discount: 55,
      category: "Tech",
      rating: 4.8,
      reviews: 12847,
      timeLeft: "6h 23m",
      isHot: true,
      image: "🔊",
      url: "https://amzn.to/example-link"
    },
    {
      id: 2,
      title: "Wireless Noise-Canceling Headphones",
      description: "Premium audio quality for focused news reading",
      originalPrice: 199.99,
      salePrice: 89.99,
      discount: 55,
      category: "Tech",
      rating: 4.6,
      reviews: 8523,
      timeLeft: "12h 45m",
      isHot: false,
      image: "🎧",
      url: "https://amzn.to/example-link"
    },
    {
      id: 3,
      title: "Ergonomic Laptop Stand",
      description: "Improve your workspace for better productivity",
      originalPrice: 79.99,
      salePrice: 39.99,
      discount: 50,
      category: "Office",
      rating: 4.4,
      reviews: 3892,
      timeLeft: "2h 15m",
      isHot: true,
      image: "💻",
      url: "https://amzn.to/example-link"
    },
    {
      id: 4,
      title: "Blue Light Blocking Glasses",
      description: "Reduce eye strain during long reading sessions",
      originalPrice: 59.99,
      salePrice: 24.99,
      discount: 58,
      category: "Health",
      rating: 4.5,
      reviews: 5247,
      timeLeft: "8h 30m",
      isHot: false,
      image: "👓",
      url: "https://amzn.to/example-link"
    },
    {
      id: 5,
      title: "Premium Coffee Subscription",
      description: "Fuel your news reading with artisan coffee",
      originalPrice: 45.00,
      salePrice: 29.99,
      discount: 33,
      category: "Lifestyle",
      rating: 4.7,
      reviews: 2156,
      timeLeft: "24h 00m",
      isHot: false,
      image: "☕",
      url: "https://amzn.to/example-link"
    },
    {
      id: 6,
      title: "Portable Phone Charger",
      description: "Never miss breaking news with reliable power",
      originalPrice: 39.99,
      salePrice: 19.99,
      discount: 50,
      category: "Tech",
      rating: 4.3,
      reviews: 7634,
      timeLeft: "4h 12m",
      isHot: true,
      image: "🔋",
      url: "https://amzn.to/example-link"
    }
  ]

  const activeDeals = deals.length > 0 ? deals : defaultDeals
  const categories = ['All', ...new Set(activeDeals.map(deal => deal.category))]

  // Filter deals by category
  const filteredDeals = selectedCategory === 'All' 
    ? activeDeals 
    : activeDeals.filter(deal => deal.category === selectedCategory)

  // Safe translation function
  const safeT = (key, options = {}) => {
    try {
      return t(key, options) || key.split('.').pop()
    } catch (error) {
      console.warn('Translation failed for key:', key)
      return key.split('.').pop()
    }
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle deal click
  const handleDealClick = (deal) => {
    try {
      if (deal.url && deal.url !== '#') {
        window.open(deal.url, '_blank', 'noopener,noreferrer')
      } else {
        console.log('Deal clicked:', deal.title)
        alert(`Redirecting to ${deal.title} deal...`)
      }
    } catch (error) {
      console.error('Error handling deal click:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">🔥 {safeT('hotDeals.title') || 'Hot Deals'}</h2>
                <p className="text-orange-100 text-sm">
                  {safeT('hotDeals.subtitle') || 'Exclusive offers for our news readers'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 animate-pulse">
                <TrendingUp className="h-3 w-3 mr-1" />
                {safeT('hotDeals.limitedTime') || 'Limited Time'}
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2"
                title={safeT('hotDeals.close') || 'Close deals'}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mr-3">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">{safeT('hotDeals.filter') || 'Filter'}:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`
                  text-sm font-medium transition-all
                  ${selectedCategory === category 
                    ? 'bg-white text-orange-600 hover:bg-white/90' 
                    : 'text-white hover:bg-white/20'
                  }
                `}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals.map((deal) => (
              <Card 
                key={deal.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500 hover:-translate-y-1"
                onClick={() => handleDealClick(deal)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Product Image/Icon */}
                    <div className="text-2xl flex-shrink-0">
                      {deal.image}
                    </div>
                    
                    {/* Deal Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 text-sm">
                          {deal.title}
                        </h3>
                        
                        {deal.isHot && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 ml-2 flex-shrink-0 text-xs">
                            <Flame className="h-3 w-3 mr-1" />
                            HOT
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {deal.description}
                      </p>
                      
                      {/* Rating and Reviews */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-gray-700">
                            {deal.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({deal.reviews?.toLocaleString()} reviews)
                        </span>
                      </div>
                      
                      {/* Pricing */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-green-600">
                          ${deal.salePrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${deal.originalPrice}
                        </span>
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          -{deal.discount}%
                        </Badge>
                      </div>
                      
                      {/* Time Left and Action */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{deal.timeLeft} left</span>
                        </div>
                        
                        <Button 
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white group-hover:scale-105 transition-transform text-xs px-2 py-1 h-auto"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDealClick(deal)
                          }}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {safeT('hotDeals.buyNow') || 'Buy Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredDeals.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <ShoppingCart className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {safeT('hotDeals.noDeals') || 'No deals found'}
              </h3>
              <p className="text-gray-600">
                {safeT('hotDeals.tryDifferentCategory') || 'Try selecting a different category'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Zap className="h-4 w-4 inline mr-1" />
              {safeT('hotDeals.disclaimer') || 'Deals update every hour • Affiliate partnerships help support our news coverage'}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-gray-300"
            >
              {safeT('hotDeals.close') || 'Close'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotDeals

