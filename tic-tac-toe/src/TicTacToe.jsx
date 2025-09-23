import { useState, useEffect, useMemo } from 'react'



function TicTacToe({ size }) {
  const [grid, setGrid] = useState(new Array(size).fill(new Array(size).fill('')))
  const [player, setPlayer] = useState('X')
  const [winner, setWinner] = useState(null)
  const onClickGrid = (row, cell) => {
    console.log('sd')
    if (winner) return
    // checkWinnigs(row, cell)
    const newGrid = grid.map((gg, idx) => idx !== row ? gg : gg.map((ggg, cell_idx) => cell_idx !== cell ? ggg : player))
    const val = newGrid[row][cell]
    //check Row
    let checkRow = true
    for (let i = 0; i < newGrid[row].length; i++) {
      if (newGrid[row][i] !== val) {
        checkRow = false; break;
      }
    }

    // check col
    let checkCol = true
    for (let i = 0; i < newGrid[row].length; i++) {
      if (newGrid[i][cell] !== val) {
        checkCol = false; break
      }
    }

    //check diagnol
    let checkdiagnol
    if (cell === row) {
      checkdiagnol = true
      for (let i = 0; i < newGrid[row].length; i++) {
        if (newGrid[i][i] !== val) {
          checkdiagnol = false; break
        }
      }
    }

    //check anidiagnol
    let checkAntidiagnol
    if (row + cell === newGrid.length - 1) {
      checkAntidiagnol = true
      for (let i = 0; i < newGrid.length; i++) {
        if (newGrid[i][newGrid.length - 1 - i] !== val) {
          checkAntidiagnol = false; break
        }
      }
    }

    setGrid(newGrid)
    if (checkRow || checkCol || checkdiagnol || checkAntidiagnol) {
      setWinner(val)
    }
    else
      setPlayer(p => p === 'X' ? 'O' : 'X')

  }

  const onReset = () => {
    setGrid(new Array(size).fill(new Array(size).fill('')))
    setWinner(null)
    setPlayer('X')
  }
  return (
    <div className="min-h-screen flex-col flex items-center">
      <header className='flex justify-between mx-8'>
        {!winner && <div className='font-bold text-xl px-10'> Player {player} turn!</div>}
        {winner && <div className='font-bold text-xl px-10 text-amber-600'> Player {winner} Wins!</div>}
        <button className='w-40 h-10 border-1 shadow rounded-2xl cursor-pointer' onClick={() => onReset()}>Reset</button>
      </header>
      <div className={`box-grid grid gap-1 my-10 font-bold text-2xl `} style={{ '--col': `${size}` }}>
        {grid.map((row, row_idx) => {
          return row.map((cell, cell_idx) =>
            <button key={row_idx + cell_idx}
              className={` w-20 h-20 border-1 rounded-xs cursor-pointer flex items-center justify-center ${cell !== '' || winner ? 'bg-grey' : '  bg-white'}`}
              disabled={cell !== '' || winner}
              onClick={() => onClickGrid(row_idx, cell_idx)}>{cell}</button>)
        })}
      </div>

    </div >
  )
}

export default TicTacToe
