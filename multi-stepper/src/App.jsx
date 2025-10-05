import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'



function App() {
  const data = [{
    step: '1',
    Componenet: () => <div>Enter name</div>
  }, {
    step: '2',
    Componenet: () => <div>Enter work details</div>
  },
  {
    step: '3',
    Componenet: () => <div>Preview details</div>
  },
  {
    step: '4',
    Componenet: () => <div>Submit</div>
  }]
  const [value, setvalue] = useState(data)
  const [completed, setCompleted] = useState(false)
  const [searchedItems, setSearchedItems] = useState([])
  const [selected, setSelected] = useState(0)
  const refs = useRef([])
  const ActiveComponent = () => value[selected].Componenet()

  const calcMargin = () => {
    console.log()
    return Math.min(
      (selected / (data.length - 1)) * 100,
      100
    )
  }

  // useEffect(() => {
  //   calcMargin()
  // }, [selected])
  return (

    <div className='container' >
      <div className='stepper'>
        {value.map((items, idx) => (
          <div ref={(e) => (refs.current[idx] = e)} key={idx + 'step'} className={`step ${selected === idx && 'selected'} ${idx < selected && 'completed'}`}>
            {idx < selected ? '✔️' : items.step}
          </div>
        ))}
        <div className='progress'></div>
        {<div className='progress-complete' style={{ width: `${calcMargin()}%` }}></div>}
      </div>

      {selected < value.length && <ActiveComponent />}
      {!completed && <button onClick={() => { if (selected == value.length - 1) { setCompleted(true); } setSelected(p => p + 1); }}>{selected === value.length - 1 ? 'Finish' : 'Next'}</button>}
    </div >


  )
}

export default App
