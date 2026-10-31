import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionGlobalConfig } from 'motion/react'
import './design/tokens.css'
import './styles.css'
import App from './App'

// ?still jumps every animation to its end state (for reviews and screenshots)
if (new URLSearchParams(location.search).has('still')) MotionGlobalConfig.skipAnimations = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
