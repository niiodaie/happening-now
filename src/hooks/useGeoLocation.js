import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useGeoLocation = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Only auto-detect if no language is already set
    if (!localStorage.getItem('i18nextLng') || localStorage.getItem('i18nextLng') === 'en') {
      // Try to get user's location and language preference
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
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
            i18n.changeLanguage(targetLanguage);
          }
        })
        .catch(error => {
          console.log('Geolocation detection failed, using browser language:', error);
          // Fallback to browser language
          const browserLang = navigator.language?.split('-')[0];
          const supportedLangs = ['en', 'fr', 'es', 'de', 'zh', 'sw', 'hi', 'pt', 'ar'];
          if (supportedLangs.includes(browserLang) && i18n.language !== browserLang) {
            i18n.changeLanguage(browserLang);
          }
        });
    }
  }, [i18n]);
};

export default useGeoLocation;

