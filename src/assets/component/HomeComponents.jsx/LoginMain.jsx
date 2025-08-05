import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useProfile } from '../../context-api/ProfileContext';

function LoginMain() {
  const navigate = useNavigate();
  const { login, clearError, error: contextError } = useProfile();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); 
  const [localError, setLocalError] = useState(''); 
  const [successMessage, setSuccessMessage] = useState(''); 

  // Effect to clear messages when form fields change or component mounts
  useEffect(() => {
    setLocalError('');
    setSuccessMessage('');
    clearError();
  }, [email, password, clearError]); 

  // React Query useMutation hook for the login process
  const loginMutation = useMutation({
    mutationFn: login, 
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        setLocalError(''); 
        clearError();

        // Clear form fields on success
        setEmail('');
        setPassword('');
        setRememberMe(false); 

        // Redirect after a short delay
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 500);
      } else {
        setLocalError(data.error || 'Login failed due to an unexpected response.');
        setSuccessMessage('');
      }
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred during login.';
      setLocalError(errorMessage);
      setSuccessMessage('');
      clearError(); 
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(''); 
    setSuccessMessage('');
    clearError();

    // Basic client-side validation
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    // Call the mutate function from useMutation
    loginMutation.mutate({ email, password });
  };

  // Only show an error if there's no success message
  const displayError = successMessage ? null : (localError || contextError);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Error Message */}
          {displayError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
              <span className="block sm:inline">{displayError}</span>
            </div>
          )}
          {/* Display Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400 transition duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400 transition duration-200"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <Link to="/forgetpassword" className="text-sm font-medium text-green-600 hover:text-green-500 transition duration-200">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? ( // Use isPending for loading state
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500 transition duration-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginMain;
