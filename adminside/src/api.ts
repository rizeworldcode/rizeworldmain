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

      if (response.status === 401 && !endpoint.includes('login') && !endpoint.includes('verifyOtp')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminPermissions');
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }

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
export const getStaffById = (id: string, useCache: boolean = false) => apiRequest(`/staff/${id}`, {}, useCache);
export const markStaffLeave = (staffIds: string[], startDate: string, endDate: string, type: string) => {
  clearApiCache('staff');
  return apiRequest('/staff/mark-leave', {
    method: 'POST',
    body: JSON.stringify({ staffIds, startDate, endDate, type }),
  });
};
export const clockOutAllStaff = (clockOutTime?: string, staffIds?: string[]) => {
  clearApiCache('staff');
  return apiRequest('/staff/clock-out-all', {
    method: 'PATCH',
    body: JSON.stringify({ clockOutTime, staffIds }),
  });
};
export const updateStaff = (id: string, staffData: any) => {
  clearApiCache('staff');
  return apiRequest(`/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(staffData),
  });
};
export const updateStaffAccess = (id: string, accessData: { permissions?: string[]; password?: string }) => {
  clearApiCache('staff');
  return apiRequest(`/staff/${id}/access`, {
    method: 'PATCH',
    body: JSON.stringify(accessData),
  });
};
export const addStaffAdvance = (id: string, advanceData: any) => {
  clearApiCache('staff');
  clearApiCache('transactions');
  return apiRequest(`/staff/${id}/advance`, {
    method: 'POST',
    body: JSON.stringify(advanceData),
  });
};
export const deleteStaffAdvance = (id: string, advanceId: string) => {
  clearApiCache('staff');
  clearApiCache('transactions');
  return apiRequest(`/staff/${id}/advance/${advanceId}`, {
    method: 'DELETE',
  });
};
export const updateStaffAdvance = (id: string, advanceId: string, data: any) => {
  clearApiCache('staff');
  return apiRequest(`/staff/${id}/advance/${advanceId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
export const getRemovedStaff = (useCache: boolean = true) => apiRequest('/staff/removed', {}, useCache);
export const rejoinStaff = (id: string, rejoinData: any) => {
  clearApiCache('staff');
  return apiRequest(`/staff/rejoin/${id}`, {
    method: 'POST',
    body: JSON.stringify(rejoinData),
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

export const approveAllStaffTasks = (staffIds?: string[]) => {
  clearApiCache('staff');
  return apiRequest('/staff/approve-all-tasks', {
    method: 'POST',
    body: JSON.stringify({ staffIds }),
  });
};

export const approveStaffTasks = (staffId: string) => {
  clearApiCache('staff');
  return apiRequest(`/staff/${staffId}/approve-all-tasks`, {
    method: 'PATCH',
  });
};

export const getStaffWorkReports = (date: string) =>
  apiRequest(`/staff/reports?date=${date}`);

export const getLiveLocations = () => apiRequest('/location/live', {}, true);
export const getLocationHistory = (employeeId: string, date?: string) =>
  apiRequest(`/location/history/${employeeId}${date ? `?date=${date}` : ''}`);
export const getLocationPhotos = () => apiRequest('/location/photos', {}, true);
export const getAllVisitingCards = () => apiRequest('/visiting-card/all', {}, true);

// Sub-admin management (Super Admin)
export const getAllSubAdmins = () => apiRequest('/admin-users', {}, false);
export const createSubAdmin = (data: { email: string; password?: string; name?: string; permissions?: string[] }) =>
  apiRequest('/admin-users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateSubAdmin = (id: string, data: { email?: string; password?: string; name?: string; permissions?: string[]; isActive?: boolean }) =>
  apiRequest(`/admin-users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteSubAdmin = (id: string) =>
  apiRequest(`/admin-users/${id}`, {
    method: 'DELETE',
  });

// Change logged-in admin password (invalidates other sessions)
export const changeAdminPassword = (data: { currentPassword?: string; newPassword: string }) =>
  apiRequest('/admin/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Pre-fetch helper disabled per user request (only fetch data for the active page)
export const prefetchAdminData = () => {};

// Hiring / Job Openings APIs
export const getHearings = () => apiRequest('/getHearing');
export const addHearing = (data: any) =>
  apiRequest('/addHearing', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateHearing = (id: string, data: any) =>
  apiRequest(`/updateHearing/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteHearing = (id: string) =>
  apiRequest(`/deleteHearing/${id}`, {
    method: 'DELETE',
  });
export const updateApplicationStatus = (hearingId: string, appId: string, status: string) =>
  apiRequest(`/hearing/${hearingId}/applications/${appId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
export const deleteApplication = (hearingId: string, appId: string) =>
  apiRequest(`/hearing/${hearingId}/applications/${appId}`, {
    method: 'DELETE',
  });

export const updateStaffAttendance = (staffId: string, data: { status: string; date?: string | Date }) =>
  apiRequest(`/staff/${staffId}/attendance`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export default {
  BASE_URL,
  getDashboardStats,
  getAllStaff,
  markStaffLeave,
  clockOutAllStaff,
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
  changeAdminPassword,
  getWalletTransactions,
  addWalletTransaction,
  updateWalletTransaction,
  deleteWalletTransaction,
  toggleStaffTask,
  addStaffExtraTask,
  submitStaffReport,
  submitAllStaffReports,
  approveAllStaffTasks,
  approveStaffTasks,
  getStaffWorkReports,
  getLiveLocations,
  getLocationHistory,
  getLocationPhotos,
  getAllVisitingCards,
  getAllSubAdmins,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  prefetchAdminData,
  clearApiCache,
  addStaffAdvance,
  deleteStaffAdvance,
  updateStaffAdvance,
  getHearings,
  addHearing,
  updateHearing,
  deleteHearing,
};
