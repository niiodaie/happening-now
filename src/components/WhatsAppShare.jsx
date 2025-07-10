import { useState } from 'react'
import { MessageCircle, Share, Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

const WhatsAppShare = ({ 
  url = window.location.href, 
  title = "Check out this news from Happening Now!", 
  description = "",
  compact = false 
}) => {
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  // Enhanced error logging
  const logError = (context, error) => {
    console.error(`[WhatsAppShare:${context}]`, error)
  }

  // Format the message for WhatsApp with enhanced safety
  const formatWhatsAppMessage = () => {
    try {
      const safeTitle = title || "Check out this news from Happening Now!"
      const safeUrl = url || window.location.href
      const safeDescription = description || ""
      
      const message = `${safeTitle}\n\n${safeDescription ? safeDescription + '\n\n' : ''}${safeUrl}`
      return encodeURIComponent(message)
    } catch (error) {
      logError('formatMessage', error)
      return encodeURIComponent(`Check out this news from Happening Now!\n\n${window.location.href}`)
    }
  }

  // Enhanced share via WhatsApp Web/App
  const shareToWhatsApp = () => {
    try {
      const message = formatWhatsAppMessage()
      const whatsappUrl = `https://wa.me/?text=${message}`
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      logError('shareSuccess', 'WhatsApp share opened successfully')
    } catch (error) {
      logError('shareToWhatsApp', error)
      alert('Failed to open WhatsApp. Please try again.')
    }
  }

  // Enhanced copy to clipboard with better fallbacks
  const copyToClipboard = async () => {
    try {
      const safeTitle = title || "Check out this news from Happening Now!"
      const safeUrl = url || window.location.href
      const safeDescription = description || ""
      
      const message = `${safeTitle}\n\n${safeDescription ? safeDescription + '\n\n' : ''}${safeUrl}`
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message)
      } else {
        // Enhanced fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = message
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (!successful) {
          throw new Error('Copy command failed')
        }
      }
      
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      logError('copySuccess', 'Content copied to clipboard')
    } catch (error) {
      logError('copyToClipboard', error)
      
      // Final fallback - show the text to user
      const safeTitle = title || "Check out this news from Happening Now!"
      const safeUrl = url || window.location.href
      const message = `${safeTitle}\n\n${safeUrl}`
      
      if (window.prompt) {
        window.prompt('Copy this text manually:', message)
      } else {
        alert('Copy failed. Please copy the URL manually: ' + safeUrl)
      }
    }
  }

  // Enhanced native share with better error handling
  const shareNative = async () => {
    try {
      if (!navigator.share) {
        shareToWhatsApp()
        return
      }
      
      const shareData = {
        title: title || "Check out this news from Happening Now!",
        text: description || "",
        url: url || window.location.href,
      }
      
      await navigator.share(shareData)
      logError('nativeShareSuccess', 'Native share completed')
    } catch (error) {
      logError('shareNative', error)
      
      // Check if user cancelled
      if (error.name === 'AbortError') {
        logError('shareNative', 'User cancelled share')
        return
      }
      
      // Fallback to WhatsApp
      shareToWhatsApp()
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={shareToWhatsApp}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center gap-2"
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
        </Button>
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Share className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Share the News</h3>
              <p className="text-sm text-gray-600">
                Spread the word about what's happening now
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!showOptions ? (
              <Button
                onClick={() => setShowOptions(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
                title="Show sharing options"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareToWhatsApp}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                
                {navigator.share && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareNative}
                    className="flex items-center gap-2"
                    title="More sharing options"
                  >
                    <Share className="h-4 w-4" />
                    More
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptions(false)}
                  className="text-gray-500"
                  title="Close sharing options"
                >
                  ×
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WhatsAppShare

