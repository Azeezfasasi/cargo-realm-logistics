import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ProfileContext } from './ProfileContext';
import { API_BASE_URL } from '../../config/Api';

export const ProfileProvider = ({ children }) => {
  // const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
});


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { email, password } = credentials;
      const res = await axios.post(`${API_BASE_URL}/profile/login`, { email, password });
      const { token: receivedToken, user } = res.data; // Renamed to avoid confusion with state 'token'
      
      // --- START: CRITICAL LOGS FOR LOGIN SUCCESS ---
      console.log('--- ProfileContext Login Success ---');
      console.log('Received token from backend:', receivedToken);
      console.log('Type of received token:', typeof receivedToken);
      console.log('Length of received token:', receivedToken ? receivedToken.length : 'N/A');
      // --- END: CRITICAL LOGS FOR LOGIN SUCCESS ---

      localStorage.setItem('token', receivedToken); // Store the token
      setToken(receivedToken); // Update state
      setCurrentUser(user);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(user)); // <-- ADD THIS LINE

      console.log('Token stored in localStorage and state after login.');
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('ProfileContext Login Error:', errorMessage, err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/profile/register`, userData);
      const { token: receivedToken, user } = res.data; // Renamed
      
      // --- START: CRITICAL LOGS FOR REGISTER SUCCESS ---
      console.log('--- ProfileContext Register Success ---');
      console.log('Received token from backend:', receivedToken);
      console.log('Type of received token:', typeof receivedToken);
      console.log('Length of received token:', receivedToken ? receivedToken.length : 'N/A');
      // --- END: CRITICAL LOGS FOR REGISTER SUCCESS ---

      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setCurrentUser(user);
      
      console.log('Token stored in localStorage and state after registration.');
      return { success: true, message: res.data.message, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('ProfileContext Register Error:', errorMessage, err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token'); 
    setToken(null);
    setCurrentUser(null);
    setError(null);
    console.log("User logged out.");
  }, []);

  // --- checkAuthStatus function ---
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true); 
    setError(null);

    const currentTokenInLocalStorage = localStorage.getItem('token'); // Get fresh from localStorage
    
    // --- START: CRITICAL LOGS FOR CHECK AUTH STATUS ---
    console.log('--- ProfileContext checkAuthStatus ---');
    console.log('Token from localStorage for checkAuthStatus:', currentTokenInLocalStorage);
    console.log('Type of token:', typeof currentTokenInLocalStorage);
    console.log('Length of token:', currentTokenInLocalStorage ? currentTokenInLocalStorage.length : 'N/A');
    // --- END: CRITICAL LOGS FOR CHECK AUTH STATUS ---

    if (!currentTokenInLocalStorage) { 
      setCurrentUser(null);
      setIsLoading(false); 
      console.log('No token found in localStorage, skipping auth check.');
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${currentTokenInLocalStorage}`;
      const res = await axios.get(`${API_BASE_URL}/profile/me`);
      setCurrentUser(res.data.user);
      console.log('Auth check successful. User:', res.data.user.email);
    } catch (err) {
      console.error("Authentication check failed on refresh:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]); 

  // Set default Authorization header for Axios and initiate auth check
  useEffect(() => {
    const initialToken = localStorage.getItem('token');
    if (initialToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
      checkAuthStatus();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsLoading(false); 
    }
  }, [checkAuthStatus]); 

  const forgotPassword = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/profile/forgot-password`, { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userId, updates) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_BASE_URL}/edit/${userId}`, updates);
      setCurrentUser(res.data);
      return { success: true, message: 'Profile updated successfully!' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/all`);
      return { success: true, users: res.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch users.';
      setError(errorMessage);
      return { success: false, error: errorMessage, users: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userIdToDelete) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.delete(`${API_BASE_URL}/delete/${userIdToDelete}`);
      return { success: true, message: res.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete user.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableUser = useCallback(async (userIdToDisable) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_BASE_URL}/disable/${userIdToDisable}`);
      return { success: true, message: res.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to disable user.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const suspendUser = useCallback(async (userIdToSuspend) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_BASE_URL}/suspend/${userIdToSuspend}`);
      return { success: true, message: res.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to suspend user.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- NEW: Derived role flags ---
  const isClient = currentUser?.role === 'client';
  const isAdmin = currentUser?.role === 'admin';
  const isAgent = currentUser?.role === 'agent';
  const isEmployee = currentUser?.role === 'employee';

  const value = {
    currentUser,
    token,
    isAuthenticated: !!currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    updateProfile,
    fetchUsers,
    deleteUser,
    disableUser,
    suspendUser,
    clearError,
    isClient,
    isAgent,
    isEmployee,
    isAdmin,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
