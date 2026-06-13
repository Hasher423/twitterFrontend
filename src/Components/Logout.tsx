import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setInMemoryToken } from '../api'; // Adjust path to your api.ts file

interface LogoutButtonProps {
  setAccessToken: (token: string | null) => void;
}

export default function LogoutButton({ setAccessToken }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed, proceeding to clear local session.', err);
    } finally {
      // Always wipe local session states even if the network call fails
      setInMemoryToken(null);
      setAccessToken(null);
      
      // Redirect to registration/login
      navigate('/register');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100"
    >
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  );
}