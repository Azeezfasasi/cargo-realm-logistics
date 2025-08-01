import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../context-api/ProfileContext'; 

/**
 * PrivateRoute component to protect routes that require authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 * Shows a loading state while authentication status is being determined.
 *
 * @param {object} { children } - The child components (the protected content) to render if authenticated.
 */
function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useProfile();

  // 1. Show a loading indicator while authentication status is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter">
        <div className="text-center text-lg text-gray-700 flex items-center">
          <svg className="animate-spin h-6 w-6 text-orange-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading user data...
        </div>
      </div>
    );
  }

  // 2. If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    // The 'replace' prop ensures that the login page replaces the current entry in the history stack,
    // so the user can't just hit the back button to get back to the protected page.
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated, render the children (the protected content)
  return children;
}

export default PrivateRoute;
