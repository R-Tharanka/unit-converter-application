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
    <div className="max-w-md w-full mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {isLogin ? 'Login' : 'Register'}
      </h2>

      {error && (
        <p className="mb-3 text-sm text-red-600 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        {isLogin ? 'No account?' : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 underline"
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
}
