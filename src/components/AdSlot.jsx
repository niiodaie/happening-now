import React, { useEffect } from 'react';
import AdSlot from './components/AdSlot'

const AdSlot = ({ 
  slot = '1234567890', 
  format = 'auto', 
  responsive = 'true',
  style = { display: 'block', textAlign: 'center' },
  className = 'my-4'
}) => {
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
      
      {/* Fallback placeholder for development/testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
          <div className="text-sm font-medium">AdSense Placeholder</div>
          <div className="text-xs mt-1">Slot: {slot}</div>
          <div className="text-xs">Format: {format}</div>
        </div>
      )}
    </div>
  );
};

// Specific ad slot components for different placements
export const HeaderAd = () => (
  <AdSlot 
    slot="1111111111" 
    format="horizontal"
    className="my-2"
    style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
  />
);

export const SidebarAd = () => (
  <AdSlot 
    slot="2222222222" 
    format="rectangle"
    className="my-4"
    style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
  />
);

export const ArticleAd = () => (
  <AdSlot 
    slot="3333333333" 
    format="fluid"
    className="my-6"
    style={{ display: 'block', textAlign: 'center', minHeight: '200px' }}
  />
);

export const FooterAd = () => (
  <AdSlot 
    slot="4444444444" 
    format="horizontal"
    className="my-4"
    style={{ display: 'block', textAlign: 'center', minHeight: '90px' }}
  />
);

export default AdSlot;

