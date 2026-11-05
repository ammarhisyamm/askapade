import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Dev only: lets the Figma bridge capture screens as editable layers
if (import.meta.env.DEV) {
  import('@builder.io/html-to-figma').then(m => { (window as any).__htmlToFigma = (m as any).htmlToFigma ?? (m as any).default?.htmlToFigma })
}
