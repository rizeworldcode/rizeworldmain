// Easily change this URL if your backend changes
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const BASE_URL: string = isLocal ? 'http://localhost:45000/api' : 'https://rizeworldmain.onrender.com/api';

// In-Memory Client Cache & Single-Flight In-Flight Request Tracking
const cacheStore = new Map<string, { timestamp: number; data: any }>();
const inFlightRequests = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 15000; // 15 seconds client-side cache for fast tab navigation

export const clearApiCache = (prefix?: string) => {
  if (!prefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.includes(prefix)) {
      cacheStore.delete(key);
    }
  }
};

// Helper function to make API calls with deduplication and optional caching
async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}, 
  useCache: boolean = false
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const cacheKey = `${method}:${endpoint}`;

  // Check client-side memory cache if enabled
  if (useCache && method === 'GET') {
    const cached = cacheStore.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return Promise.resolve(cached.data as T);
    }
  }

  // Request deduplication for GET requests in flight
  if (method === 'GET' && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey) as Promise<T>;
  }

  const promise = (async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = new Headers(options.headers);
      if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }
      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Handle both absolute and relative endpoints
      const url = endpoint.startsWith('http') 
        ? endpoint 
        : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const result = await response.json();

      if (useCache && method === 'GET' && result && result.success !== false) {
        cacheStore.set(cacheKey, { timestamp: Date.now(), data: result });
      }

      return result as T;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    } finally {
      if (method === 'GET') {
        inFlightRequests.delete(cacheKey);
      }
    }
  })();

  if (method === 'GET') {
    inFlightRequests.set(cacheKey, promise);
  }

  return promise;
}

// Dashboard Endpoints
export const getDashboardStats = () => apiRequest('/dashboard/stats', {}, true);
export const getRevenueAnalytics = (period?: string) => apiRequest(`/dashboard/revenue-analytics?period=${period || 'month'}`, {}, true);

// Staff Endpoints
export const getAllStaff = (useCache: boolean = true) => apiRequest('/staff', {}, useCache);
export const markStaffLeave = (staffIds: string[], startDate: string, endDate: string, type: string) => {
  clearApiCache('staff');
  return apiRequest('/staff/mark-leave', {
    method: 'POST',
    body: JSON.stringify({ staffIds, startDate, endDate, type }),
  });
};

// Clients Endpoints
export const getAllClients = (params?: { limit?: number; search?: string; select?: string }, useCache: boolean = true) => {
  let queryStr = '';
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.append('limit', String(params.limit));
    if (params.search) searchParams.append('search', params.search);
    if (params.select) searchParams.append('select', params.select);
    queryStr = `?${searchParams.toString()}`;
  }
  return apiRequest(`/clients${queryStr}`, {}, useCache);
};

export const addClient = (clientData: any) => {
  clearApiCache('clients');
  return apiRequest('/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
};

export const updateClient = (clientId: string | number, clientData: any) => {
  clearApiCache('clients');
  return apiRequest(`/clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
};

export const deleteClient = (clientId: string | number) => {
  clearApiCache('clients');
  return apiRequest(`/clients/${clientId}`, {
    method: 'DELETE',
  });
};

// Old Clients Endpoints
export const getAllOldClients = (useCache: boolean = true) => apiRequest('/old-clients', {}, useCache);
export const updateOldClient = (oldClientId: string | number, clientData: any) => {
  clearApiCache('old-clients');
  return apiRequest(`/old-clients/${oldClientId}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
};

// Projects Endpoints
export const addProject = (projectData: any) => {
  clearApiCache('clients');
  return apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
};

export const updateProject = (projectId: string | number, projectData: any) => {
  clearApiCache('clients');
  return apiRequest(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
};

// Payments Endpoints
export const addPayment = (paymentData: any) => {
  clearApiCache('clients');
  clearApiCache('transactions');
  return apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
};

// Staff Login Endpoints
export const staffLogin = (employeeId: string, password: string) =>
  apiRequest('/staff/login', {
    method: 'POST',
    body: JSON.stringify({ employeeId, password }),
  });

// Admin Login Endpoints
export const adminLogin = (email: string, password: string) =>
  apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const adminLoginNew = (frontend_email: string, frontend_password: string) =>
  apiRequest('/admin_login', {
    method: 'POST',
    body: JSON.stringify({ frontend_email, frontend_password }),
  });

export const sendOtpToAdmin = (email: string) =>
  apiRequest('/sendOtpTOadmin', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const verifyOtp = (email: string, otp: string) =>
  apiRequest('/verifyOtp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });

export const adminForgotPassword = (email: string, newPassword: string) =>
  apiRequest('/admin_forgatePassword', {
    method: 'POST',
    body: JSON.stringify({ email, newPassword }),
  });

export const adminLogout = () => {
  clearApiCache();
  return apiRequest('/admin_logout', { method: 'POST' });
};

// Wallet Endpoints
export const getWalletTransactions = (type?: string, useCache: boolean = true) => {
  const url = type && type !== 'all' ? `/transactions?type=${type}` : '/transactions';
  return apiRequest(url, {}, useCache);
};

export const addWalletTransaction = (transactionData: any) => {
  clearApiCache('transactions');
  return apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
};

export const updateWalletTransaction = (id: string, transactionData: any) => {
  clearApiCache('transactions');
  return apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  });
};

export const deleteWalletTransaction = (id: string) => {
  clearApiCache('transactions');
  return apiRequest(`/transactions/${id}`, {
    method: 'DELETE',
  });
};

export const toggleStaffTask = (staffId: string, taskIndex: number) => {
  clearApiCache('staff');
  return apiRequest(`/staff/${staffId}/toggle-task`, {
    method: 'PATCH',
    body: JSON.stringify({ taskIndex }),
  });
};

export const addStaffExtraTask = (staffId: string, taskName: string) => {
  clearApiCache('staff');
  return apiRequest(`/staff/${staffId}/add-extra-task`, {
    method: 'POST',
    body: JSON.stringify({ taskName }),
  });
};

export const submitStaffReport = (staffId: string) =>
  apiRequest(`/staff/${staffId}/submit-report`, {
    method: 'POST',
  });

export const submitAllStaffReports = () =>
  apiRequest('/staff/submit-all-reports', {
    method: 'POST',
  });

export const getStaffWorkReports = (date: string) =>
  apiRequest(`/staff/reports?date=${date}`);

export const getLiveLocations = () => apiRequest('/location/live', {}, true);
export const getLocationHistory = (employeeId: string, date?: string) =>
  apiRequest(`/location/history/${employeeId}${date ? `?date=${date}` : ''}`);
export const getLocationPhotos = () => apiRequest('/location/photos', {}, true);
export const getAllVisitingCards = () => apiRequest('/visiting-card/all', {}, true);

// Pre-fetch helper for navigation
export const prefetchAdminData = () => {
  if (typeof window === 'undefined') return;
  setTimeout(() => {
    getAllClients({ limit: 20 }, true).catch(() => {});
    getAllStaff(true).catch(() => {});
  }, 1000);
};

export default {
  BASE_URL,
  getDashboardStats,
  getAllStaff,
  markStaffLeave,
  getAllClients,
  addClient,
  updateClient,
  deleteClient,
  getAllOldClients,
  addProject,
  updateProject,
  addPayment,
  staffLogin,
  adminLogin,
  adminLoginNew,
  sendOtpToAdmin,
  verifyOtp,
  adminForgotPassword,
  adminLogout,
  getWalletTransactions,
  addWalletTransaction,
  updateWalletTransaction,
  deleteWalletTransaction,
  toggleStaffTask,
  addStaffExtraTask,
  submitStaffReport,
  submitAllStaffReports,
  getStaffWorkReports,
  getLiveLocations,
  getLocationHistory,
  getLocationPhotos,
  getAllVisitingCards,
  prefetchAdminData,
  clearApiCache,
};
