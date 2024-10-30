import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import IaApp from './iaApp.jsx'
import "./static/scss/styles.scss"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IaApp />
  </StrictMode>,
)
