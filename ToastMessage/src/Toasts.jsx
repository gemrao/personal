import React from 'react'
import { useState, useContext, createContext } from 'react'
import Toast from './Toast'
export const ToastContext = createContext()
export const Toasts = ({ children }) => {
    const [toasts, setToasts] = useState([])
    const addToast = (toast) => {
        setToasts(p => [...p, toast])
        setTimeout(() => {
            removeToast(toast.id)
        }, toast.duration)
    }
    const removeToast = (id) => {
        setToasts(p => p.filter(pp => pp.id !== id))
    }
    return (
        <ToastContext.Provider value={{ addToast }} >
            {children}
            {toasts.map((toast) =>
                <Toast key={toast.id} data={toast} close={() => removeToast(toast.id)} />
            )}
        </ToastContext.Provider>
    )
}
export const useToast = () => useContext(ToastContext)
