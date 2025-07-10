// File: main.jsx
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import LoadingFallback from './components/LoadingFallback.jsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
