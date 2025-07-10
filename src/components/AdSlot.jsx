import React, { useEffect, useState } from 'react';

const AdSlot = ({ 
  slot = '1234567890', 
  format = 'auto', 
  responsive = 'true',
  style = { display: 'block', textAlign: 'center' },
  className = 'my-4'
}) => {
  const [adError, setAdError] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // Check if we're in production and AdSense is properly configured
    const checkAdSenseAvailability = () => {
      try {
        // Only load ads in production with proper configuration
        const isProductionEnv = process.env.NODE_ENV === 'production';
        const hasAdSenseScript = document.querySelector('script[src*="adsbygoogle"]');
        const hasValidPublisherId = slot && slot !== '1234567890'; // Check for real slot ID
        
        setIsProduction(isProductionEnv && hasAdSenseScript && hasValidPublisherId);
        
        if (isProductionEnv && hasAdSenseScript && hasValidPublisherId) {
          // Push ad to AdSense queue only if everything is properly configured
          if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
            window.adsbygoogle.push({});
          }
        }
      } catch (error) {
        console.log('AdSense configuration error:', error.message);
        setAdError(true);
      }
    };

    // Delay execution to ensure DOM is ready
    const timer = setTimeout(checkAdSenseAvailability, 100);
    
    return () => clearTimeout(timer);
  }, [slot]);

  // Don't render ads in development or if there's an error
  if (process.env.NODE_ENV === 'development' || adError || !isProduction) {
    return (
      <div className={className}>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
          <div className="text-sm font-medium">
            {process.env.NODE_ENV === 'development' 
              ? 'AdSense Placeholder (Development)' 
              : adError 
                ? 'Ad Loading Error' 
                : 'Ad Slot (Production Only)'}
          </div>
          <div className="text-xs mt-1">Slot: {slot}</div>
          <div className="text-xs">Format: {format}</div>
          {adError && (
            <div className="text-xs text-red-500 mt-1">
              Check AdSense configuration
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins 
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-6074565478510564"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

// Specific ad slot components for different placements - temporarily disabled
export const HeaderAd = () => null;
export const SidebarAd = () => null;
export const ArticleAd = () => null;
export const FooterAd = () => null;

// Alternative: Safe ad components that only show in production with proper setup
export const SafeHeaderAd = () => (
  <AdSlot 
    slot="1111111111" 
    format="horizontal"
    className="my-2"
    style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
  />
);

export const SafeSidebarAd = () => (
  <AdSlot 
    slot="2222222222" 
    format="rectangle"
    className="my-4"
    style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
  />
);

export const SafeArticleAd = () => (
  <AdSlot 
    slot="3333333333" 
    format="fluid"
    className="my-6"
    style={{ display: 'block', textAlign: 'center', minHeight: '200px' }}
  />
);

export const SafeFooterAd = () => (
  <AdSlot 
    slot="4444444444" 
    format="horizontal"
    className="my-4"
    style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
  />
);

export default AdSlot;

