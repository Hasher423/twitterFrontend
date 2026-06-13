import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setAccessToken: (token: string) => void;
}

export default function Login({ setAccessToken }: LoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }); 

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }
      setAccessToken(data.accessToken);

      // Programmatically route to the protected dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#151515]_TEMP font-['Inter',sans-serif] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-zinc-800/60 bg-[#151515] p-8 shadow-sm">
        <div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-black_TEMP">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-xs text-gray-500 tracking-wide uppercase">
            MiniTwitter
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-zinc-800 p-4 text-xs text-black_TEMP border border-zinc-800">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg border border-zinc-800 bg-[#151515] px-3.5 py-2 text-black_TEMP placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black text-sm transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-lg border border-zinc-800 bg-[#151515] px-3.5 py-2 text-black_TEMP placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-[#151515]_TEMP py-2.5 px-4 text-sm font-medium text-black transition-all duration-150 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-300"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="h-4 w-4 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="font-semibold text-black_TEMP underline underline-offset-4 hover:text-gray-700 transition-colors">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}