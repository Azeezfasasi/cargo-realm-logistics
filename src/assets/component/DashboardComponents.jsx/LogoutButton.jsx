// components/LogoutButton.jsx
import React from 'react';
import { useProfile } from '@/assets/context-api/ProfileContext';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { logout } = useProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
