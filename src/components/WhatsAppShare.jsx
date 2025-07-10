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

  // Format the message for WhatsApp
  const formatWhatsAppMessage = () => {
    const message = `${title}\n\n${description ? description + '\n\n' : ''}${url}`
    return encodeURIComponent(message)
  }

  // Share via WhatsApp Web/App
  const shareToWhatsApp = () => {
    const message = formatWhatsAppMessage()
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      const message = `${title}\n\n${description ? description + '\n\n' : ''}${url}`
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = `${title}\n\n${description ? description + '\n\n' : ''}${url}`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Share via Web Share API (if available)
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        })
      } catch (error) {
        console.error('Native sharing failed:', error)
        // Fallback to WhatsApp
        shareToWhatsApp()
      }
    } else {
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
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center gap-2"
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
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
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

