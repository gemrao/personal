import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [otps, setOtp] = useState(["", "", "", ""])
  const refs = useRef([])

  // const onSubmit = () => {

  // }

  const onInpChange = (e, idx) => {

    const val = e.target.value
    const newOtps = [...otps]
    if (/^[0-9]$/.test(val)) {
      newOtps[idx] = val
      setOtp(newOtps)

      if (idx < otps.length - 1) {
        refs.current[idx + 1].focus()
      }
    }
  }
  function onKeyDown(e, idx) {

    if (e.code === "Backspace") {
      if (e.target.value !== '') {
        const newOtps = [...otps]
        newOtps[idx] = ""
        setOtp(newOtps)
      }
      if (idx > 0)
        refs.current[idx - 1].focus()

    }
  }
  function onFocus(e, idx) {
    console.log(refs)
    refs.current[idx].style.height = '150px'
    refs.current[idx].style.width = '150px'
  }
  function onBlur(e, idx) {
    console.log(refs)
    refs.current[idx].style.height = '100px'
    refs.current[idx].style.width = '100px'
  }
  return (
    <>
      <div style={{ display: "flex", gap: '10px', alignItems: "center" }}>

        {otps.map((val, idx) =>
          <input
           
            className='otp'
            ref={(el) => refs.current[idx] = el}
            key={idx}
            value={val}
            // style={{ height: "100px", width: "100px", borderRadius: "2px", fontSize: "32px", color: "black" }}
            type='text'
            maxLength={1}
            onChange={(e) => onInpChange(e, idx)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            // onFocus={(e) => onFocus(e, idx)}
            // onBlur={(e) => onBlur(e, idx)}
          >
          </input>)}
      </div>
    </>
  )
}

export default App
