// pages/History.jsx
// Shows authenticated user's conversion history with simple pagination.
// Requires user to be logged in (AuthContext provides user).

import { useEffect, useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function HistoryPage() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/history?page=${page}&limit=${limit}`);
        if (!mounted) return;
        setData(res.data.data || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user, page, limit, refreshKey]);

  const numberFormatter = useMemo(() => new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 6,
  }), []);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">History is protected</h2>
          <p className="text-sm text-gray-600">
            Sign in to sync your conversions across devices and revisit them any time.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            Log in or register
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const emptyState = !loading && !error && data.length === 0;

  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-600">History</p>
            <h2 className="mt-1 text-3xl font-semibold text-gray-900">Your saved conversions</h2>
            <p className="mt-2 text-sm text-gray-600">
              Track what you converted and when. Keep exploring units and build your personal reference list.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRefreshKey(key => key + 1)}
            disabled={loading}
            className="inline-flex items-center gap-2 self-start rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 disabled:opacity-60"
          >
            Refresh
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <ul className="space-y-3">
            {skeletonItems.map((_, index) => (
              <li key={index} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-40 rounded bg-slate-200" />
              </li>
            ))}
          </ul>
        )}

        {emptyState && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              ⏳
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No conversions yet</h3>
            <p className="mt-2 text-sm text-gray-600">
              Convert a value to start building your history. Everything you convert while signed in will appear here.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
            >
              Go to converter
            </Link>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <ul className="space-y-4">
              {data.map(item => (
                <li key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 transition hover:border-blue-200 hover:bg-blue-50/60">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {item.category}
                    </span>
                  </div>
                  <div className="mt-3 text-xl font-semibold text-gray-900">
                    {numberFormatter.format(item.value)} {item.from} → {numberFormatter.format(item.result)} {item.to}
                  </div>
                  {item.note && (
                    <p className="mt-2 text-sm text-slate-600">{item.note}</p>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 disabled:opacity-50 sm:flex-none"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50 sm:flex-none"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
