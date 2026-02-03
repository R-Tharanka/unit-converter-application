// components/AuthForm.jsx
// Login / Register form. On success calls AuthContext.login(payload) which persists token+email.
// After login/register we navigate to the app home.

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AuthForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      return setError('Email and password are required');
    }

    try {
      setLoading(true);

      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, { email, password });

      // backend returns { token, user }
      login(res.data);

      // redirect user to main page (or history)
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-blue-100 bg-white/95 p-8 shadow-2xl backdrop-blur">
      <div className="mb-8 text-center">
        <div className="inline-flex rounded-full bg-blue-50 p-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
          {isLogin ? 'Welcome back' : 'Join the community'}
        </div>
        <h2 className="mt-4 text-3xl font-semibold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your free account'}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {isLogin
            ? 'Access your conversion history and continue where you left off.'
            : 'Unlock saved conversions and synced history across every device.'}
        </p>
      </div>

      <div className="mb-6 flex items-center justify-center gap-2 rounded-full bg-slate-100 p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`flex-1 rounded-full px-4 py-2 transition ${isLogin ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-blue-600'}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`flex-1 rounded-full px-4 py-2 transition ${!isLogin ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-blue-600'}`}
        >
          Register
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="password">
            Password
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter a strong password"
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="text-xs font-semibold uppercase tracking-wide text-blue-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {!isLogin && (
            <p className="mt-2 text-xs text-gray-500">Use at least 8 characters. You can change this later from your profile.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60"
        >
          {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? 'Need an account?' : 'Already registered?'}{' '}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="font-medium text-blue-600 hover:underline"
        >
          {isLogin ? 'Register for free' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
