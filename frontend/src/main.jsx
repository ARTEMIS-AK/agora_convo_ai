import React from 'react'
import ReactDOM from 'react-dom/client'
import AgoraAIChat from './AgoraAIChat.jsx' // Changed from App.jsx
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AgoraAIChat />
  </React.StrictMode>,
)