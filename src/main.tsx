import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Add error logging
console.log('App starting...')

try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
    console.log('App rendered successfully')
} catch (error) {
    console.error('Failed to render app:', error)
    document.getElementById('root')!.innerHTML = `<div style="color:red;padding:20px;">Error: ${error}</div>`
}