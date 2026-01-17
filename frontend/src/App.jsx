// App.jsx
// Top-level router plus a shared layout with navigation and auth controls.
import { useContext } from 'react';
import { Routes, Route, Outlet, Link, useNavigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Converter from './pages/Converter';
import History from './pages/History';
import { AuthContext } from './context/AuthContext';

function AppLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex gap-4 text-sm font-medium">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Convert</Link>
            <Link to="/history" className="text-gray-700 hover:text-blue-600">History</Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {user?.email && <span className="text-gray-500">{user.email}</span>}
            {user ? (
              <button onClick={handleLogout} className="text-blue-600 hover:underline">
                Logout
              </button>
            ) : (
              <Link to="/auth" className="text-blue-600 hover:underline">Login</Link>
            )}
          </div>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Converter />} />
        <Route path="/history" element={<History />} />
      </Route>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}
