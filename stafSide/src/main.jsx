import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global Fetch Interceptor to automatically attach staffToken
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

  if (url.includes('/api') || url.startsWith('/api') || url.includes('localhost:45000') || url.includes('onrender.com')) {
    const token = localStorage.getItem('staffToken');
    console.log(`[stafSide Fetch] Intercepting: ${url}, token found: ${!!token}`);
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
