import React from 'react';

// Temporarily disabled AdSlot components to fix 400 errors
// These can be re-enabled once proper AdSense configuration is ready

const AdSlot = ({ 
  slot = '1234567890', 
  format = 'auto', 
  responsive = 'true',
  style = { display: 'block', textAlign: 'center' },
  className = 'my-4'
}) => {
  // Return null to completely disable ads for now
  return null;
  
  // Original implementation commented out to prevent 400 errors
  /*
  useEffect(() => {
    try {
      // Push ad to AdSense queue
      if (window.adsbygoogle && window.adsbygoogle.push) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.log('AdSense error:', error);
    }
  }, []);

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
      
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
          <div className="text-sm font-medium">AdSense Placeholder</div>
          <div className="text-xs mt-1">Slot: {slot}</div>
          <div className="text-xs">Format: {format}</div>
        </div>
      )}
    </div>
  );
  */
};

// Specific ad slot components for different placements - all disabled
export const HeaderAd = () => null;
export const SidebarAd = () => null;
export const ArticleAd = () => null;
export const FooterAd = () => null;

export default AdSlot;

