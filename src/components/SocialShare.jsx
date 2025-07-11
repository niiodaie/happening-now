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
      shareToSocialMedia(platform, title, url, description);
    }
  };

  const handleCopyLink = async () => {
    const shareText = article
      ? `${title}\n\n${description}\n\n${url}`
      : `${title} - ${url}`;

    const success = await copyToClipboard(shareText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch (err) {
        console.log('Native share failed, fallback to WhatsApp.');
        if (article) shareNewsToWhatsApp(article);
      }
    } else {
      handleCopyLink();
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
          title="Copy link"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
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
