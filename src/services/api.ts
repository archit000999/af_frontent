// API Configuration
const API_BASE_URL = 'https://applyfirst.onrender.com/api';

// Token management
export const tokenManager = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token: string) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  isAuthenticated: () => !!localStorage.getItem('authToken')
};

// Base API function with auth headers
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = tokenManager.getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      tokenManager.setToken(response.token);
    }
    
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      tokenManager.setToken(response.token);
    }
    
    return response;
  },

  logout: () => {
    // Clear all localStorage for better user experience
    localStorage.clear();
  },

  getProfile: async () => {
    return apiCall('/auth/profile');
  },

  updateProfile: async (profileData: any) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Copilot API
export const copilotAPI = {
  getAll: async () => {
    return apiCall('/copilot');
  },

  create: async (copilotData: any) => {
    // Use PATCH for both create and update operations
    return apiCall('/copilot', {
      method: 'PATCH',
      body: JSON.stringify(copilotData),
    });
  },

  get: async (id: string) => {
    return apiCall(`/copilot/${id}`);
  },

  update: async (id: string, data: any) => {
    // Use PATCH for updates
    return apiCall(`/copilot/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/copilot/${id}`, {
      method: 'DELETE',
    });
  },
};

// Application API
export const applicationAPI = {
  submit: async (applicationData: any) => {
    return apiCall('/application', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  getAll: async () => {
    return apiCall('/application');
  },

  get: async (id: string) => {
    return apiCall(`/application/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return apiCall(`/application/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: async (planType: string, billingPeriod: string) => {
    return apiCall('/payment/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ planType, billingPeriod }),
    });
  },

  confirmPayment: async (paymentIntentId: string) => {
    return apiCall('/payment/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    });
  },

  getPaymentHistory: async () => {
    return apiCall('/payment/history');
  },

  cancelSubscription: async () => {
    return apiCall('/payment/cancel-subscription', {
      method: 'POST',
    });
  },
};
