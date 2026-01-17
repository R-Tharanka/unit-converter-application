// pages/History.jsx
// Shows authenticated user's conversion history with simple pagination.
// Requires user to be logged in (AuthContext provides user).

import { useEffect, useState, useContext } from 'react';
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
  }, [user, page, limit]);

  if (!user) {
    return (
      <div>
        Please <Link to="/auth" className="text-blue-600 underline">log in</Link> to view history.
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your history</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <ul className="space-y-3">
            {data.map(item => (
              <li key={item._id} className="p-3 bg-white border rounded">
                <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
                <div className="text-lg font-medium">
                  {item.value} {item.from} → {item.result} {item.to}
                </div>
                <div className="text-sm text-gray-600">Category: {item.category}</div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
