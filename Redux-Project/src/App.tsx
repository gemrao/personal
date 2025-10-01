import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, increment } from './store/habit-slice'
function App() {
  // const [count, setCount] = useState(0)
  const dispatch = useDispatch()
  const { count, loading, error } = useSelector(state => state.habit)
  const onClick = () => {
    dispatch(increment(5))
  }

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={(e) => onClick(e)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      {loading && <p className="read-the-docs">
        Loading.....
      </p>}
      {error && <p className="read-the-docs">
        Erorr!!.....
      </p>}
    </>
  )
}

export default App
