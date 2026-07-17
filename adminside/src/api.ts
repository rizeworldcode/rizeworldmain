// Easily change this URL if your backend changes
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const BASE_URL: string = isLocal ? 'http://localhost:45000/api' : 'https://rizeworldmain.onrender.com/api';

// Helper function to make API calls
async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const token = localStorage.getItem('adminToken');
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();
    return result as T;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Dashboard Endpoints
export const getDashboardStats = () => apiRequest('/dashboard/stats');
export const getRevenueAnalytics = (period?: string) => apiRequest(`/dashboard/revenue-analytics?period=${period || 'month'}`);

// Staff Endpoints
export const getAllStaff = () => apiRequest('/staff');
export const markStaffLeave = (staffIds: string[], startDate: string, endDate: string, type: string) =>
  apiRequest('/staff/mark-leave', {
    method: 'POST',
    body: JSON.stringify({ staffIds, startDate, endDate, type }),
  });

// Clients Endpoints
export const getAllClients = () => apiRequest('/clients');
export const addClient = (clientData: any) =>
  apiRequest('/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
export const updateClient = (clientId: string | number, clientData: any) =>
  apiRequest(`/clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
export const deleteClient = (clientId: string | number) =>
  apiRequest(`/clients/${clientId}`, {
    method: 'DELETE',
  });

// Old Clients Endpoints
export const getAllOldClients = () => apiRequest('/old-clients');
export const updateOldClient = (oldClientId: string | number, clientData: any) =>
  apiRequest(`/old-clients/${oldClientId}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });

// Projects Endpoints
export const addProject = (projectData: any) =>
  apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
export const updateProject = (projectId: string | number, projectData: any) =>
  apiRequest(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });

// Payments Endpoints
export const addPayment = (paymentData: any) =>
  apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });

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

export const adminLogout = () =>
  apiRequest('/admin_logout', {
    method: 'POST',
  });

// Wallet Endpoints
export const getWalletTransactions = (type?: string) => {
  const url = type && type !== 'all' ? `/transactions?type=${type}` : '/transactions';
  return apiRequest(url);
};
export const addWalletTransaction = (transactionData: any) =>
  apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
export const updateWalletTransaction = (id: string, transactionData: any) =>
  apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  });
export const deleteWalletTransaction = (id: string) =>
  apiRequest(`/transactions/${id}`, {
    method: 'DELETE',
  });

export const toggleStaffTask = (staffId: string, taskIndex: number) =>
  apiRequest(`/staff/${staffId}/toggle-task`, {
    method: 'PATCH',
    body: JSON.stringify({ taskIndex }),
  });

export const addStaffExtraTask = (staffId: string, taskName: string) =>
  apiRequest(`/staff/${staffId}/add-extra-task`, {
    method: 'POST',
    body: JSON.stringify({ taskName }),
  });

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

export const getLiveLocations = () => apiRequest('/location/live');
export const getLocationHistory = (employeeId: string, date?: string) =>
  apiRequest(`/location/history/${employeeId}${date ? `?date=${date}` : ''}`);
export const getLocationPhotos = () => apiRequest('/location/photos');
export const getAllVisitingCards = () => apiRequest('/visiting-card/all');

export default {
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
};
