import React, { useState } from 'react';
import { Share2, Twitter, Facebook, MessageCircle, Copy, Check } from 'lucide-react';
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

  const handleShare = (platform) => {
    if (platform === 'whatsapp' && article) {
      shareNewsToWhatsApp(article);
    } else {
      shareToSocialMedia(platform, url, title, description);
    }
  };

  const handleCopy = () => {
    copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className}>
      <div className="flex gap-2">
        <Button onClick={() => handleShare('twitter')} title="Share on Twitter">
          <Twitter className="h-4 w-4" />
        </Button>
        <Button onClick={() => handleShare('facebook')} title="Share on Facebook">
          <Facebook className="h-4 w-4" />
        </Button>
        <Button onClick={() => handleShare('whatsapp')} title="Share on WhatsApp">
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button onClick={handleCopy} title="Copy URL">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          onClick={handleShare}
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