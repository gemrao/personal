
import { useEffect, useState } from 'react'
import './App.css'
export default function App() {

  const [seconds, setSeconds] = useState()
  const [minutes, setMinutes] = useState()
  const [hour, setHour] = useState()
  useEffect(() => {
  const id=  setInterval(() => {
      const d = new Date()
        const s = d.getSeconds();
  const m = d.getMinutes();
  const h = d.getHours() % 12;
      setSeconds(s * 6)
      setMinutes(m * 6 + s * 0.1)
      // const hourAngle = (Number(time.getHours()) - 12) * 36
      setHour(h * 30 + m * 0.5)
    }, 1000)
   return ()=>clearInterval(id)
  }, [])

  return (
    <div className='clock'>
      <h1>Indian Clock</h1>
      <div className='clock--div'>
        <img src="/clock-img.jpeg" alt="clock" width={300} height={300} />
        <div className='hand seconds' style={{ transform: `translate(-50%,-50%) rotate(${seconds}deg)` }}></div>
        <div className='hand minutes' style={{ transform: `translate(-50%,-50%) rotate(${minutes}deg)` }}></div>
        <div className='hand hour' style={{ transform: `translate(-50%,-50%) rotate(${hour}deg)` }}></div>
      </div>
    </div>
  )
}