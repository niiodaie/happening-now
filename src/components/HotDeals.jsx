import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { X, Flame, ExternalLink, Clock, Star, TrendingUp, Zap, ShoppingCart } from 'lucide-react'

const HotDeals = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Mock deals data - professional and news-worthy
  const deals = [
    {
      id: 1,
      title: "Professional Noise-Canceling Headphones",
      description: "Premium audio quality for journalists and remote workers",
      originalPrice: 299,
      salePrice: 194,
      discount: 35,
      category: "Tech",
      rating: 4.8,
      reviews: 2847,
      timeLeft: "6h 23m",
      isHot: true,
      image: "🎧",
      url: "#"
    },
    {
      id: 2,
      title: "Ergonomic Laptop Stand",
      description: "Improve your workspace setup for better productivity",
      originalPrice: 89,
      salePrice: 67,
      discount: 25,
      category: "Office",
      rating: 4.6,
      reviews: 1523,
      timeLeft: "12h 45m",
      isHot: false,
      image: "💻",
      url: "#"
    },
    {
      id: 3,
      title: "Wireless Charging Pad",
      description: "Fast charging for smartphones and devices",
      originalPrice: 49,
      salePrice: 29,
      discount: 41,
      category: "Tech",
      rating: 4.4,
      reviews: 892,
      timeLeft: "2h 15m",
      isHot: true,
      image: "⚡",
      url: "#"
    },
    {
      id: 4,
      title: "Blue Light Blocking Glasses",
      description: "Reduce eye strain during long reading sessions",
      originalPrice: 79,
      salePrice: 47,
      discount: 40,
      category: "Health",
      rating: 4.5,
      reviews: 1247,
      timeLeft: "8h 30m",
      isHot: false,
      image: "👓",
      url: "#"
    },
    {
      id: 5,
      title: "Portable Phone Tripod",
      description: "Perfect for video calls and content creation",
      originalPrice: 35,
      salePrice: 21,
      discount: 40,
      category: "Tech",
      rating: 4.3,
      reviews: 634,
      timeLeft: "4h 12m",
      isHot: true,
      image: "📱",
      url: "#"
    },
    {
      id: 6,
      title: "Premium Coffee Subscription",
      description: "Fuel your news reading with artisan coffee",
      originalPrice: 45,
      salePrice: 32,
      discount: 29,
      category: "Lifestyle",
      rating: 4.7,
      reviews: 956,
      timeLeft: "24h 00m",
      isHot: false,
      image: "☕",
      url: "#"
    }
  ]

  const categories = ['All', 'Tech', 'Office', 'Health', 'Lifestyle']

  // Filter deals by category
  const filteredDeals = selectedCategory === 'All' 
    ? deals 
    : deals.filter(deal => deal.category === selectedCategory)

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
      // In a real app, this would navigate to the affiliate link
      console.log('Deal clicked:', deal.title)
      // For now, just show an alert
      alert(`Redirecting to ${deal.title} deal...`)
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
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">🔥 Hot Deals</h2>
                <p className="text-orange-100 text-sm">
                  Exclusive offers for our news readers
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 animate-pulse">
                <TrendingUp className="h-3 w-3 mr-1" />
                Limited Time
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2"
                title="Close deals"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDeals.map((deal) => (
              <Card 
                key={deal.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-orange-500"
                onClick={() => handleDealClick(deal)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Product Image/Icon */}
                    <div className="text-3xl flex-shrink-0">
                      {deal.image}
                    </div>
                    
                    {/* Deal Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {deal.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {deal.description}
                          </p>
                        </div>
                        
                        {deal.isHot && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 ml-2 flex-shrink-0">
                            <Flame className="h-3 w-3 mr-1" />
                            HOT
                          </Badge>
                        )}
                      </div>
                      
                      {/* Rating and Reviews */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">
                            {deal.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({deal.reviews.toLocaleString()} reviews)
                        </span>
                      </div>
                      
                      {/* Pricing */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-green-600">
                          ${deal.salePrice}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${deal.originalPrice}
                        </span>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          -{deal.discount}%
                        </Badge>
                      </div>
                      
                      {/* Time Left and Action */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-orange-600">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{deal.timeLeft} left</span>
                        </div>
                        
                        <Button 
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white group-hover:scale-105 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDealClick(deal)
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Buy Now
                          <ExternalLink className="h-3 w-3 ml-1" />
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
                No deals found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Zap className="h-4 w-4 inline mr-1" />
              Deals update every hour • Affiliate partnerships help support our news coverage
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-gray-300"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotDeals

