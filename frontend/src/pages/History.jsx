import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function HistoryPage() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await api.get(`/history?page=${page}&limit=20`);
      setData(res.data.data);
    })();
  }, [user, page]);

  if (!user) return <div>Please log in to view history.</div>;

  return (
    <div>
      <h2>Your history</h2>
      <ul>{data.map(item => <li key={item._id}>{item.value} {item.from} → {item.result} {item.to}</li>)}</ul>
    </div>
  );
}
