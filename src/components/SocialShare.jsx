import React from 'react';
import { Share2, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

const SocialShare = ({ 
  url = window.location.href, 
  title = '', 
  description = '',
  className = 'flex gap-2 mt-3'
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const shareText = encodeURIComponent(`${title} - ${description}`);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        // You could show a toast notification here
        console.log('URL copied to clipboard');
      } catch (error) {
        console.log('Failed to copy URL:', error);
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
          onClick={() => handleShare('whatsapp')}
          className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNativeShare}
          className="h-8 px-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
          title="More sharing options"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;

