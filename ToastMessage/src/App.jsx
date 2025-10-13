import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toasts, useToast } from './Toasts'
import { createContext } from 'react'

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
export const AppContext = createContext()
function App() {

  const [val] = useState('new')

  return (
    <AppContext.Provider value={val}>
      <Toasts>
        <Content />
      </Toasts>
    </AppContext.Provider>
  )
}

export default App
