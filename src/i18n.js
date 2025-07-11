import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enTranslation from './locales/en/translation.json'
import arTranslation from './locales/ar/translation.json'
import frTranslation from './locales/fr/translation.json'
import esTranslation from './locales/es/translation.json'
import deTranslation from './locales/de/translation.json'
import zhTranslation from './locales/zh/translation.json'
import hiTranslation from './locales/hi/translation.json'
import ptTranslation from './locales/pt/translation.json'
import swTranslation from './locales/sw/translation.json'

// Translation resources
const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  },
  fr: {
    translation: frTranslation
  },
  es: {
    translation: esTranslation
  },
  de: {
    translation: deTranslation
  },
  zh: {
    translation: zhTranslation
  },
  hi: {
    translation: hiTranslation
  },
  pt: {
    translation: ptTranslation
  },
  sw: {
    translation: swTranslation
  }
}

// Language detection options
const detectionOptions = {
  // Order of language detection methods
  order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  
  // Keys to look for in localStorage
  lookupLocalStorage: 'preferredLanguage',
  
  // Cache user language
  caches: ['localStorage'],
  
  // Exclude certain detection methods
  excludeCacheFor: ['cimode'],
  
  // Check all fallback languages
  checkWhitelist: true
}

i18n
  // Language detection
  .use(LanguageDetector)
  // React integration
  .use(initReactI18next)
  // Initialize
  .init({
    resources,
    
    // Language detection configuration
    detection: detectionOptions,
    
    // Fallback language
    fallbackLng: 'en',
    
    // Supported languages
    supportedLngs: ['en', 'ar', 'fr', 'es', 'de', 'zh', 'hi', 'pt', 'sw'],
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
      formatSeparator: ',',
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase()
        if (format === 'lowercase') return value.toLowerCase()
        if (format === 'capitalize') return value.charAt(0).toUpperCase() + value.slice(1)
        return value
      }
    },
    
    // React options
    react: {
      useSuspense: false, // Disable suspense for better error handling
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span']
    },
    
    // Backend options (if using backend)
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Missing key handling
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: function(lng, ns, key, fallbackValue) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`)
      }
    },
    
    // Pluralization
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Key separator
    keySeparator: '.',
    nsSeparator: ':',
    
    // Return objects
    returnObjects: false,
    returnEmptyString: false,
    returnNull: false,
    
    // Post processing
    postProcess: false,
    
    // Clean code on production
    cleanCode: true,
    
    // Load languages
    preload: ['en', 'ar'],
    
    // Whitelist languages
    whitelist: ['en', 'ar', 'fr', 'es', 'de', 'zh', 'hi', 'pt', 'sw'],
    
    // Non-explicit whitelist
    nonExplicitWhitelist: true,
    
    // Load all namespaces
    load: 'languageOnly',
    
    // Simplify plural suffix
    simplifyPluralSuffix: true,
    
    // Update missing
    updateMissing: process.env.NODE_ENV === 'development',
    
    // Append namespace to missing
    appendNamespaceToMissing: false,
    
    // Parse missing key handler
    parseMissingKeyHandler: function(key) {
      return key
    }
  })

// Set initial direction based on language
i18n.on('languageChanged', (lng) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  document.documentElement.lang = lng
  document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr'
  
  // Update page title if needed
  if (document.title) {
    // You can add logic here to update the page title based on language
  }
})

// Error handling
i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`Failed to load language ${lng} namespace ${ns}:`, msg)
})

i18n.on('missingKey', (lng, namespace, key, res) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Missing key "${key}" for language "${lng}" in namespace "${namespace}"`)
  }
})

// Safe translation function
export const safeT = (key, options = {}) => {
  try {
    const translation = i18n.t(key, options)
    return translation === key ? key.split('.').pop() : translation
  } catch (error) {
    console.warn(`Translation error for key: ${key}`, error)
    return key.split('.').pop()
  }
}

// Get current language direction
export const getCurrentDirection = () => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  return rtlLanguages.includes(i18n.language) ? 'rtl' : 'ltr'
}

// Check if current language is RTL
export const isRTL = () => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  return rtlLanguages.includes(i18n.language)
}

// Get available languages
export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' }
  ]
}

export default i18n

