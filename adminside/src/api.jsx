// Base API URL
const BASE_URL = 'http://localhost:45000/api';

// Helper function to make API calls
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Dashboard Endpoints
export const getDashboardStats = () => apiRequest('/dashboard/stats');
export const getRevenueAnalytics = (period) => apiRequest(`/dashboard/revenue-analytics?period=${period || 'month'}`);

// Staff Endpoints
export const getAllStaff = () => apiRequest('/staff');
export const markStaffLeave = (staffIds, startDate, endDate, type) => 
  apiRequest('/staff/mark-leave', {
    method: 'POST',
    body: JSON.stringify({ staffIds, startDate, endDate, type }),
  });

// Clients Endpoints
export const getAllClients = () => apiRequest('/clients');
export const addClient = (clientData) => 
  apiRequest('/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  });
export const updateClient = (clientId, clientData) => 
  apiRequest(`/clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  });
export const deleteClient = (clientId) => 
  apiRequest(`/clients/${clientId}`, {
    method: 'DELETE',
  });

// Old Clients Endpoints
export const getAllOldClients = () => apiRequest('/old-clients');

// Projects Endpoints
export const addProject = (projectData) => 
  apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
export const updateProject = (projectId, projectData) => 
  apiRequest(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });

// Payments Endpoints
export const addPayment = (paymentData) => 
  apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });

// Staff Login Endpoints
export const staffLogin = (employeeId, password) => 
  apiRequest('/staff/login', {
    method: 'POST',
    body: JSON.stringify({ employeeId, password }),
  });

// Admin Login Endpoints
export const adminLogin = (email, password) => 
  apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// Wallet Endpoints
export const getWalletTransactions = () => apiRequest('/wallet/transactions');
export const addWalletTransaction = (transactionData) => 
  apiRequest('/wallet/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });

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
  getWalletTransactions,
  addWalletTransaction,
};
