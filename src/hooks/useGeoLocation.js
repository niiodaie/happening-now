import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const useGeoLocation = () => {
  const { i18n } = useTranslation();
  const [geoError, setGeoError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    // Enhanced geo-location detection with better error handling
    const detectLocation = async () => {
      try {
        setIsDetecting(true);
        setGeoError(null);

        // Only auto-detect if no language is already set or if it's the default
        const currentLang = localStorage.getItem('i18nextLng');
        if (currentLang && currentLang !== 'en' && currentLang !== 'cimode') {
          setIsDetecting(false);
          return; // User has already set a preference
        }

        // Try multiple geo-location services with timeout
        const geoPromises = [
          // Primary service
          fetch('https://ipapi.co/json/', { 
            signal: AbortSignal.timeout(5000) 
          }).then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          }),
          
          // Fallback service
          fetch('https://api.ipgeolocation.io/ipgeo?apiKey=free', { 
            signal: AbortSignal.timeout(5000) 
          }).then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          }).catch(() => {
            // If both fail, use browser language
            throw new Error('All geo services failed');
          })
        ];

        let geoData = null;
        
        // Try services in order
        for (const promise of geoPromises) {
          try {
            geoData = await promise;
            if (geoData && (geoData.country_code || geoData.country_code2)) {
              break; // Success
            }
          } catch (error) {
            console.warn('Geo service failed:', error.message);
            continue; // Try next service
          }
        }

        let targetLanguage = 'en'; // default fallback

        if (geoData) {
          const countryCode = (geoData.country_code || geoData.country_code2)?.toLowerCase();
          
          // Enhanced country to language mapping
          const countryLanguageMap = {
            // English-speaking countries
            'us': 'en', 'gb': 'en', 'ca': 'en', 'au': 'en', 'nz': 'en', 'ie': 'en', 'za': 'en',
            
            // French-speaking countries
            'fr': 'fr', 'be': 'fr', 'ch': 'fr', 'mc': 'fr', 'lu': 'fr', 'sn': 'fr', 'ci': 'fr',
            
            // Spanish-speaking countries
            'es': 'es', 'mx': 'es', 'ar': 'es', 'co': 'es', 'pe': 'es', 'cl': 'es', 've': 'es',
            'ec': 'es', 'gt': 'es', 'cu': 'es', 'bo': 'es', 'do': 'es', 'hn': 'es', 'py': 'es',
            'sv': 'es', 'ni': 'es', 'cr': 'es', 'pa': 'es', 'uy': 'es',
            
            // German-speaking countries
            'de': 'de', 'at': 'de', 'li': 'de',
            
            // Chinese-speaking regions
            'cn': 'zh', 'tw': 'zh', 'hk': 'zh', 'sg': 'zh', 'mo': 'zh',
            
            // Swahili-speaking countries
            'ke': 'sw', 'tz': 'sw', 'ug': 'sw',
            
            // Hindi-speaking regions
            'in': 'hi',
            
            // Portuguese-speaking countries
            'br': 'pt', 'pt': 'pt', 'ao': 'pt', 'mz': 'pt', 'gw': 'pt', 'cv': 'pt', 'st': 'pt',
            
            // Arabic-speaking countries
            'sa': 'ar', 'ae': 'ar', 'eg': 'ar', 'ma': 'ar', 'dz': 'ar', 'tn': 'ar', 'ly': 'ar',
            'sd': 'ar', 'sy': 'ar', 'iq': 'ar', 'jo': 'ar', 'lb': 'ar', 'kw': 'ar', 'qa': 'ar',
            'bh': 'ar', 'om': 'ar', 'ye': 'ar'
          };

          if (countryCode && countryLanguageMap[countryCode]) {
            targetLanguage = countryLanguageMap[countryCode];
          }
        }

        // Fallback to browser language detection if geo failed
        if (targetLanguage === 'en' && !geoData) {
          const browserLang = navigator.language?.split('-')[0];
          const supportedLangs = ['en', 'fr', 'es', 'de', 'zh', 'sw', 'hi', 'pt', 'ar'];
          if (supportedLangs.includes(browserLang)) {
            targetLanguage = browserLang;
          }
        }

        // Only change language if it's different from current and supported
        const supportedLanguages = ['en', 'fr', 'es', 'de', 'zh', 'sw', 'hi', 'pt', 'ar'];
        if (supportedLanguages.includes(targetLanguage) && i18n.language !== targetLanguage) {
          await i18n.changeLanguage(targetLanguage);
          console.log(`Language auto-detected and changed to: ${targetLanguage}`);
        }

      } catch (error) {
        console.warn('Enhanced geolocation detection failed:', error.message);
        setGeoError(error.message);
        
        // Final fallback to browser language
        try {
          const browserLang = navigator.language?.split('-')[0];
          const supportedLangs = ['en', 'fr', 'es', 'de', 'zh', 'sw', 'hi', 'pt', 'ar'];
          if (supportedLangs.includes(browserLang) && i18n.language !== browserLang) {
            await i18n.changeLanguage(browserLang);
            console.log(`Fallback to browser language: ${browserLang}`);
          }
        } catch (fallbackError) {
          console.warn('Browser language fallback failed:', fallbackError);
          // Keep default language (en)
        }
      } finally {
        setIsDetecting(false);
      }
    };

    // Only run detection once per session
    const hasDetected = sessionStorage.getItem('geoLocationDetected');
    if (!hasDetected) {
      detectLocation();
      sessionStorage.setItem('geoLocationDetected', 'true');
    }
  }, [i18n]);

  return {
    isDetecting,
    geoError,
    hasError: !!geoError
  };
};

export default useGeoLocation;

