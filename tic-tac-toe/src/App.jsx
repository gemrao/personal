import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TicTacToe from './TicTacToe'


function App() {
  const [player, setPlayer] = useState('X')

  const onClickGrid = (i) => {
    setGrid(p =>
      p.map((pp, pi) => pi !== i ? pp : player)
    )
    setPlayer(p => p === 'X' ? 'O' : 'X')

  }

  const checkWinnigs = () => {
    // for(let i =0;i<grid.length;i++){
    //   for(let j =0;j<g)
    // }
  }
  return (
    <div className="min-h-screen flex-col flex items-center">
      <h1 className='text-3xl my-16'>Tic tac toe</h1>
      <TicTacToe size={4} />
    </div >
  )
}

export default App
