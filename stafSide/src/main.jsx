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

  const isLocalApi = url.startsWith('/api') || url.startsWith('api/');
  const isBackendDomain = 
    url.includes(':45000') || 
    url.includes('localhost') || 
    url.includes('rizeworld') || 
    url.includes('onrender.com') ||
    url.includes('192.168.') ||
    url.includes('10.');
  const isExternalApi = url.includes('api.ocr.space') || url.includes('unpkg.com');

  if ((isLocalApi || isBackendDomain) && !isExternalApi) {
    const token = localStorage.getItem('staffToken');
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Portal error caught by ErrorBoundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', color: '#1e293b', textAlign: 'center' }}>
          <div style={{ maxWidth: '400px', background: '#ffffff', padding: '28px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Rizeworld Employee Portal</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              We detected an issue loading your session. Tap below to refresh your connection.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('staffToken');
                localStorage.removeItem('staffInfo');
                window.location.href = '/';
              }}
              style={{ width: '100%', padding: '12px 20px', background: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
