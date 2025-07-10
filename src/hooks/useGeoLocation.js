import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useGeoLocation = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Safely handle geolocation detection
    const detectLocation = async () => {
      try {
        // Only auto-detect if no language is already set
        if (!localStorage.getItem('i18nextLng') || localStorage.getItem('i18nextLng') === 'en') {
          // Try to get user's location and language preference with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

          try {
            const response = await fetch('https://ipapi.co/json/', {
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
              }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const countryCode = data.country_code?.toLowerCase();
            let targetLanguage = 'en'; // default fallback

            // Map country codes to supported languages
            const countryLanguageMap = {
              'us': 'en', 'gb': 'en', 'ca': 'en', 'au': 'en', 'nz': 'en',
              'fr': 'fr', 'be': 'fr', 'ch': 'fr', 'mc': 'fr',
              'es': 'es', 'mx': 'es', 'ar': 'es', 'co': 'es', 'pe': 'es',
              'de': 'de', 'at': 'de',
              'cn': 'zh', 'tw': 'zh', 'hk': 'zh', 'sg': 'zh',
              'ke': 'sw', 'tz': 'sw', 'ug': 'sw',
              'in': 'hi',
              'br': 'pt', 'pt': 'pt',
              'sa': 'ar', 'ae': 'ar', 'eg': 'ar', 'ma': 'ar', 'dz': 'ar'
            };

            if (countryCode && countryLanguageMap[countryCode]) {
              targetLanguage = countryLanguageMap[countryCode];
            } else {
              // Fallback to browser language detection
              const browserLang = navigator.language?.split('-')[0];
              const supportedLangs = ['en', 'fr', 'es', 'de', 'zh', 'sw', 'hi', 'pt', 'ar'];
              if (supportedLangs.includes(browserLang)) {
                targetLanguage = browserLang;
              }
            }

            // Only change language if it's different from current
            if (i18n.language !== targetLanguage) {
              await i18n.changeLanguage(targetLanguage);
            }
          } catch (fetchError) {
            clearTimeout(timeoutId);
            throw fetchError;
          }
        }
      } catch (error) {
        console.log('Geolocation detection failed, using browser language:', error.message);
        
        // Fallback to browser language detection
        try {
          const browserLang = navigator.language?.split('-')[0];
          const supportedLangs = ['en', 'fr', 'es', 'de', 'zh', 'sw', 'hi', 'pt', 'ar'];
          
          if (supportedLangs.includes(browserLang) && i18n.language !== browserLang) {
            await i18n.changeLanguage(browserLang);
          }
        } catch (browserLangError) {
          console.log('Browser language detection also failed:', browserLangError.message);
          // Final fallback to English
          if (i18n.language !== 'en') {
            try {
              await i18n.changeLanguage('en');
            } catch (finalError) {
              console.log('Final fallback to English failed:', finalError.message);
            }
          }
        }
      }
    };

    // Run detection with additional safety
    detectLocation().catch(error => {
      console.log('Geolocation hook failed completely:', error.message);
    });
  }, [i18n]);
};

export default useGeoLocation;

