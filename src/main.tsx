import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { GameProvider } from './state/game'
import './index.css'

// Kein Pinch-Zoom/Doppeltipp-Zoom auf iOS (verhindert versehentliches Zoomen beim wilden Tippen)
document.addEventListener('gesturestart', (e) => e.preventDefault())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <GameProvider>
          <App />
        </GameProvider>
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
)
