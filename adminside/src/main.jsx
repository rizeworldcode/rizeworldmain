import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Global Fetch Interceptor to automatically attach adminToken and rewrite backend URLs in production
const originalFetch = window.fetch;
window.fetch = async (input, init = {}) => {
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.href;
  } else if (input && typeof input === 'object' && 'url' in input) {
    url = input.url;
  }

  // Rewrite localhost backend URL to production backend URL when running on production host (like admin.rizeworld.in)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const targetBase = 'https://rizeworldmain.onrender.com';
    if (url.includes('localhost:45000')) {
      url = url.replace(/https?:\/\/localhost:45000/g, targetBase);
      if (typeof input === 'string') {
        input = url;
      } else if (input instanceof URL) {
        input = new URL(url);
      } else if (input && typeof input === 'object' && 'url' in input) {
        try {
          input = new Request(url, input);
        } catch (e) {
          input.url = url;
        }
      }
    }
  }

  if (url.includes('/api') || url.startsWith('/api') || url.includes('localhost:45000') || url.includes('onrender.com')) {
    const token = localStorage.getItem('adminToken');
    if (token) {
      if (!init.headers) {
        init.headers = {};
      }
      
      if (init.headers instanceof Headers) {
        if (!init.headers.has('Authorization')) {
          init.headers.set('Authorization', `Bearer ${token}`);
        }
      } else if (Array.isArray(init.headers)) {
        const hasAuth = init.headers.some(([key]) => key.toLowerCase() === 'authorization');
        if (!hasAuth) {
          init.headers.push(['Authorization', `Bearer ${token}`]);
        }
      } else {
        if (!init.headers['Authorization'] && !init.headers['authorization']) {
          init.headers = {
            ...init.headers,
            'Authorization': `Bearer ${token}`
          };
        }
      }
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
