import { useState, useEffect } from 'react'

export function useGeoLocation() {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const detectLocation = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try multiple IP geolocation services
        const services = [
          'https://ipapi.co/json/',
          'https://ipinfo.io/json',
          'https://api.ipify.org?format=json'
        ]

        let locationData = null

        for (const service of services) {
          try {
            const response = await fetch(service, {
              timeout: 5000,
              headers: {
                'Accept': 'application/json'
              }
            })

            if (response.ok) {
              const data = await response.json()
              
              if (service.includes('ipapi.co')) {
                locationData = {
                  city: data.city || 'Unknown',
                  country: data.country_name || 'Unknown',
                  countryCode: data.country_code || 'US',
                  region: data.region || '',
                  timezone: data.timezone || '',
                  latitude: data.latitude || null,
                  longitude: data.longitude || null
                }
              } else if (service.includes('ipinfo.io')) {
                locationData = {
                  city: data.city || 'Unknown',
                  country: data.country || 'Unknown',
                  countryCode: data.country || 'US',
                  region: data.region || '',
                  timezone: data.timezone || '',
                  latitude: null,
                  longitude: null
                }
              }

              if (locationData) break
            }
          } catch (serviceError) {
            console.warn(`Failed to fetch from ${service}:`, serviceError)
            continue
          }
        }

        // Fallback to browser language detection
        if (!locationData) {
          const browserLang = navigator.language || 'en-US'
          const [lang, region] = browserLang.split('-')
          
          locationData = {
            city: 'Unknown',
            country: region || 'Unknown',
            countryCode: region || 'US',
            region: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
            latitude: null,
            longitude: null
          }
        }

        if (isMounted) {
          setLocation(locationData)
          setLoading(false)
        }
      } catch (err) {
        console.error('Geolocation detection failed:', err)
        if (isMounted) {
          setError(err.message)
          setLoading(false)
          
          // Set fallback location
          setLocation({
            city: 'Unknown',
            country: 'Unknown',
            countryCode: 'US',
            region: '',
            timezone: '',
            latitude: null,
            longitude: null
          })
        }
      }
    }

    // Check if we have cached location data
    const cachedLocation = localStorage.getItem('userLocation')
    const cacheTimestamp = localStorage.getItem('locationTimestamp')
    const cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours

    if (cachedLocation && cacheTimestamp) {
      const isExpired = Date.now() - parseInt(cacheTimestamp) > cacheExpiry
      
      if (!isExpired) {
        try {
          const parsedLocation = JSON.parse(cachedLocation)
          setLocation(parsedLocation)
          setLoading(false)
          return
        } catch (parseError) {
          console.warn('Failed to parse cached location:', parseError)
        }
      }
    }

    // Detect location if no valid cache
    detectLocation()

    return () => {
      isMounted = false
    }
  }, [])

  // Cache location data when it changes
  useEffect(() => {
    if (location && !error) {
      try {
        localStorage.setItem('userLocation', JSON.stringify(location))
        localStorage.setItem('locationTimestamp', Date.now().toString())
      } catch (storageError) {
        console.warn('Failed to cache location:', storageError)
      }
    }
  }, [location, error])

  return {
    location,
    loading,
    error,
    refetch: () => {
      // Clear cache and refetch
      localStorage.removeItem('userLocation')
      localStorage.removeItem('locationTimestamp')
      setLoading(true)
      setError(null)
      // Trigger re-detection by updating a dependency
      window.location.reload()
    }
  }
}

