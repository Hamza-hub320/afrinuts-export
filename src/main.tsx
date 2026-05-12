import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext';
import './index.css'
import App from './App'
import { HelmetProvider } from 'react-helmet-async';

// Add error logging
console.log('App starting...')

try {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <AuthProvider>
                <HelmetProvider>
                    <App />
                </HelmetProvider>
            </AuthProvider>
        </React.StrictMode>
    )
    console.log('App rendered successfully')
} catch (error) {
    console.error('Failed to render app:', error)
    document.getElementById('root')!.innerHTML = `<div style="color:red;padding:20px;">Error: ${error}</div>`
}