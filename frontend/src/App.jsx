// App.jsx
// Top-level router plus a shared layout with navigation and auth controls.
import { useContext, useMemo } from 'react';
import { Routes, Route, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Converter from './pages/Converter';
import History from './pages/History';
import { AuthContext } from './context/AuthContext';

function AppLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = useMemo(() => ([
    { to: '/', label: 'Converter' },
    { to: '/history', label: 'History' },
  ]), []);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" aria-hidden="true" />
        <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white shadow-lg">U</span>
            <span className="hidden text-gray-900 sm:block tracking-[0.4em]">UnitFlow</span>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-gray-600 shadow-sm sm:flex">
            {navItems.map(item => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-4 py-2 transition ${isActive ? 'bg-blue-600 text-white shadow' : 'hover:text-blue-600'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-gray-600 sm:flex">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">{userInitial}</span>
                  <span className="max-w-[10rem] truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow hover:bg-blue-100"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
        <div className="sm:hidden">
          <div className="mx-4 mb-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-gray-600 shadow-sm">
            {navItems.map(item => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex-1 rounded-xl px-3 py-2 text-center transition ${isActive ? 'bg-blue-600 text-white shadow' : 'hover:text-blue-600'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
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
