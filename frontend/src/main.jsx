import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
axios.defaults.withCredentials = true
axios.interceptors.response.use(response =>{
  return response
}, error =>{
  if (error.response.status === 401) {
    if (location.pathname !== "/login" && location.pathname !== "/register") {
      location.href = "/login"
    }
  }

  return Promise.reject(error)
})



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
