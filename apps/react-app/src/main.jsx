// src/main.jsx
import React from 'react'                         // optional with new JSX transform
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Missing <div id="root"> in index.html')

// Register the service worker
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      // Show a prompt to refresh the page
      if (confirm('New content available, reload?')) {
        window.location.reload()
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline')
    },
    immediate: true
  })
}

createRoot(rootElement).render(
  <StrictMode>
      <App />
  </StrictMode>
)
