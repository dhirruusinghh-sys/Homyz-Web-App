import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth/` : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/`;

// Create axios instance with credentials
const axiosInstance = axios.create({
  withCredentials: true
});

// Register user
const register = async (userData: any) => {
  const response = await axiosInstance.post(API_URL + 'register', userData);
  // Do NOT set user in localStorage because email verification is required
  return response.data;
};

// Login user
const login = async (userData: any) => {
  const response = await axiosInstance.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = async () => {
  await axiosInstance.post(API_URL + 'logout');
  localStorage.removeItem('user');
};

// Verify Email
const verifyEmail = async (token: string) => {
  const response = await axiosInstance.get(API_URL + `verify-email/${token}`);
  return response.data;
};

// Forgot Password
const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post(API_URL + 'forgot-password', { email });
  return response.data;
};

// Reset Password
const resetPassword = async (data: { token: string; password: string }) => {
  const response = await axiosInstance.put(API_URL + `reset-password/${data.token}`, { password: data.password });
  return response.data;
};

// Google Login
const googleLogin = async (token: string) => {
  const response = await axiosInstance.post(API_URL + 'google', { token });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Update profile
const updateProfile = async (userData: any) => {
  const response = await axiosInstance.put(API_URL + 'profile', userData);
  if (response.data) {
    // Merge new data with existing local storage
    const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...existingUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return response.data;
};

// Change password
const changePassword = async (passwordData: any) => {
  const response = await axiosInstance.put(API_URL + 'change-password', passwordData);
  return response.data;
};

// Toggle saved property
const toggleSavedProperty = async (propertyId: string) => {
  const response = await axiosInstance.put(API_URL + `profile/save-property/${propertyId}`);
  if (response.data && response.data.savedProperties) {
    // Update local storage user data
    const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...existingUser, savedProperties: response.data.savedProperties };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleLogin,
  updateProfile,
  changePassword,
  toggleSavedProperty,
};

export default authService;
