import React, { useState } from 'react';
import { Share, Twitter, Facebook, MessageCircle, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { shareToSocialMedia, shareNewsToWhatsApp, copyToClipboard } from '@/lib/shareUtils';

const SocialShare = ({ 
  article,
  url = window.location.href, 
  title = '', 
  description = '',
  className = 'flex gap-2 mt-3'
}) => {
  const [copied, setCopied] = useState(false);

  // Enhanced error logging
  const logError = (context, error) => {
    console.error(`[SocialShare:${context}]`, error)
  }

  // Enhanced share handler with better error handling
  const handleShare = (platform) => {
    try {
      if (!platform) {
        throw new Error('Platform not specified')
      }
      
      if (platform === 'whatsapp' && article) {
        shareNewsToWhatsApp(article);
      } else {
        const safeTitle = title || 'Check out this news!'
        const safeUrl = url || window.location.href
        const safeDescription = description || ''
        
        shareToSocialMedia(platform, safeTitle, safeUrl, safeDescription);
      }
      
      logError('shareSuccess', `Shared to ${platform}`)
    } catch (error) {
      logError('handleShare', error)
      alert(`Failed to share to ${platform}. Please try again.`)
    }
  };

  // Enhanced native share with better error handling
  const handleNativeShare = async () => {
    try {
      if (!navigator.share) {
        logError('nativeShare', 'Native share not supported')
        handleCopyLink();
        return
      }
      
      const shareData = {
        title: title || 'Check out this news!',
        text: description || '',
        url: url || window.location.href,
      }
      
      await navigator.share(shareData);
      logError('nativeShareSuccess', 'Native share completed')
    } catch (error) {
      logError('handleNativeShare', error)
      
      // Check if user cancelled
      if (error.name === 'AbortError') {
        logError('nativeShare', 'User cancelled share')
        return
      }
      
      // Fallback to WhatsApp or copy
      if (article) {
        try {
          shareNewsToWhatsApp(article);
        } catch (fallbackError) {
          logError('whatsappFallback', fallbackError)
          handleCopyLink();
        }
      } else {
        handleCopyLink();
      }
    }
  };

  // Enhanced copy link with better error handling
  const handleCopyLink = async () => {
    try {
      const safeTitle = title || 'Check out this news!'
      const safeUrl = url || window.location.href
      const safeDescription = description || ''
      
      const shareText = article 
        ? `${safeTitle}\n\n${safeDescription}\n\n${safeUrl}`
        : `${safeTitle} - ${safeUrl}`;
      
      const success = await copyToClipboard(shareText);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        logError('copySuccess', 'Content copied to clipboard')
      } else {
        throw new Error('Copy operation failed')
      }
    } catch (error) {
      logError('handleCopyLink', error)
      
      // Final fallback - show alert with URL
      const safeUrl = url || window.location.href
      if (window.prompt) {
        window.prompt('Copy this URL manually:', safeUrl)
      } else {
        alert(`Copy this URL: ${safeUrl}`)
      }
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500 font-medium">Share:</span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('whatsapp')}
          className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('twitter')}
          className="h-8 px-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          title="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('facebook')}
          className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="h-8 px-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
          title={copied ? "Copied!" : "Copy link"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNativeShare}
          className="h-8 px-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
          title="More sharing options"
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;

