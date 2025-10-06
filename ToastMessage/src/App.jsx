import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toasts, useToast } from './Toasts'

function Content() {
  const { addToast } = useToast()

  const createToast = (val) => {
    addToast({
      id: new Date(),
      content: val,
      duration: 3000
    })
  }

  return <button onClick={() => createToast('Error')}>Add</button>
}

function App() {
  return (
    <Toasts>
      <Content />
    </Toasts>
  )
}

export default App
