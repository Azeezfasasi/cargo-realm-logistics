// export const BACKEND_URL = 'https://cargo-realm-backend.onrender.com';
// export const API_BASE_URL = 'https://cargo-realm-backend.onrender.com/api';

// Use localhost for development, Render for production
const isDevelopment = import.meta.env.DEV;
export const BACKEND_URL = isDevelopment 
  ? 'http://localhost:5000/api' 
  : 'https://cargo-realm-backend.onrender.com/api';
export const API_BASE_URL = BACKEND_URL;