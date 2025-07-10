import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'

// Optional: simple error boundary if needed
function Fallback() {
  return (
    <div className="p-4 text-center text-sm text-red-600">
      Oops! Something went wrong while loading the app.
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div className="p-4 text-center">Loading HappeningNow...</div>}>
      <App />
    </Suspense>
  </StrictMode>
)
