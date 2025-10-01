import React, { useEffect, useState } from 'react'

const Clock = () => {
    const [angle, setAngle] = useState({
        seconds: 0,
        mins: 0,
        hour: 0
    })

    // useEffect(() => {
    //     const id = setInterval(() => {
    //         const now = new Date()
    //         const seconds = now.getSeconds() * 6
    //         const mins = now.getMinutes() * 6 + seconds * 0.1
    //         const hour = now.getHours() % 12

    //         setAngle({
    //             seconds: seconds,
    //             mins: mins,
    //             hour: hour * 30
    //         })
    //     }, 1000)
    //     return () => clearInterval(id)
    // }, [])
    useEffect(() => {
        let frameId;

        const update = () => {
            const now = new Date()
            const seconds = now.getSeconds() + now.getMilliseconds() / 1000
            const mins = now.getMinutes() + seconds / 60
            const hour = now.getHours() % 12 + mins / 60

            setAngle({
                seconds: seconds * 6,   // 360 / 60
                mins: mins * 6,         // smooth minutes
                hour: hour * 30         // smooth hours
            })

            frameId = requestAnimationFrame(update)
        }

        update()
        return () => cancelAnimationFrame(frameId)
    }, [])
    return (
        <div style={{ position: 'relative', width: '300px', height: '300px' }}>
            <img style={{}} src="/clock-img.jpeg" alt="clock" width={300} height={300} />
            <div className='hour-needle' style={{ position: 'absolute', borderRadius: '2px', height: '60%', top: '50%', left: '50%', transform: `translate(-50%,-50%) rotate(${angle.hour}deg)` }}></div>
            <div className='min-needle' style={{ position: 'absolute', borderRadius: '2px', height: '70%', top: '50%', left: '50%', transform: `translate(-50%,-50%) rotate(${angle.mins}deg)` }}></div>
            <div className='secs-needle' style={{ position: 'absolute', borderRadius: '2px', height: '80%', top: '50%', left: '50%', transform: `translate(-50%,-50%) rotate(${angle.seconds}deg)` }}></div>
        </div>
    )
}

export default Clock