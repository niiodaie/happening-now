import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { isValidEmail } from '@/lib/utils'

export function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    if (!isValidEmail(email.trim())) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('Subscribing...')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('✅ Subscribed successfully! You\'ll receive daily trending news updates.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      setStatus('error')
      setMessage('❌ Network error. Please try again.')
      console.error('Subscription error:', error)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800">
          <Mail className="h-5 w-5 text-orange-600" />
          Subscribe for Daily Trending News
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Get the hottest trending topics delivered to your inbox every morning
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {getStatusIcon()}
            {status === 'loading' ? 'Subscribing...' : 
             status === 'success' ? 'Subscribed!' : 
             'Subscribe Now'}
          </Button>
          
          {message && (
            <div className={`text-sm text-center mt-3 flex items-center justify-center gap-2 ${getStatusColor()}`}>
              {status !== 'loading' && getStatusIcon()}
              <span>{message}</span>
            </div>
          )}
        </form>
        
        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 text-center">
              📧 Check your email for confirmation. You can unsubscribe anytime.
            </p>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>
            🔒 We respect your privacy. No spam, unsubscribe anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

