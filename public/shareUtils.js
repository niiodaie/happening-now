// WhatsApp Share Helper Utility

export const shareNews = (title, url, description = '') => {
  const shareText = description 
    ? `${title}\n\n${description}\n\n${url}`
    : `${title}\n\n${url}`;
  
  if (navigator.share) {
    // Use native Web Share API if available
    navigator.share({ 
      title, 
      text: description,
      url 
    }).catch(err => {
      console.log('Native share failed, falling back to WhatsApp:', err);
      openWhatsAppShare(shareText);
    });
  } else {
    // Fallback to WhatsApp Web
    openWhatsAppShare(shareText);
  }
};

export const openWhatsAppShare = (text) => {
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

export const shareToSocialMedia = (platform, title, url, description = '') => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const shareText = encodeURIComponent(`${title} - ${description}`);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  if (shareLinks[platform]) {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
  }
};

// Enhanced WhatsApp sharing with better formatting
export const shareNewsToWhatsApp = (article) => {
  const { title, url, summary, source, timestamp } = article;
  
  let shareText = `📰 *${title}*\n\n`;
  
  if (summary) {
    shareText += `${summary}\n\n`;
  }
  
  if (source) {
    shareText += `📍 Source: ${source}\n`;
  }
  
  if (timestamp) {
    const timeAgo = formatTimeAgo(timestamp);
    shareText += `⏰ ${timeAgo}\n`;
  }
  
  shareText += `\n🔗 Read more: ${url}\n\n`;
  shareText += `📱 Shared via Happening Now`;
  
  openWhatsAppShare(shareText);
};

// Helper function to format time ago (if not already available)
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

