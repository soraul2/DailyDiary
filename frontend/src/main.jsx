import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import './AppleDesign.css'
import axios from "axios";  // <--- ★ 여기에 추가하면 모든 곳에서 자동 적용!


axios.defaults.withCredentials = true;


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </StrictMode>,
)
