import React from 'react'
import { useState, useContext, createContext } from 'react'
import { AppContext } from './App'
const Toast = ({ data, close }) => {
    const user = useContext(AppContext)
    return (
        <div style={{ border: '1px solid black', width: '200px', height: '400px', display: 'flex', flexDirection: 'column', position: 'relative' }} >

            <button style={{ position: 'absolute', top: '5px', right: '5px' }} onClick={() => close(data.id)}>X</button>
            <div>{user}</div>
            <div>{data.content}</div>
        </div>
    )
}

export default Toast