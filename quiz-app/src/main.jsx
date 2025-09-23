import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import data from './quiz.json'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Quiz  quiz={data[0]} /> */}
  </StrictMode>,
)
