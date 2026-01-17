// components/ConverterForm.jsx
// Minimal converter form with client-side validation.
// It calls POST /api/convert and passes save: !!user to let the backend decide whether to persist history.
// For the assignment a static set of units is included; expand as needed.

import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const DEFAULT_UNITS = {
    length: ['m', 'km', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'],
    mass: ['kg', 'g', 'mg', 'lb', 'oz', 'ton'],
    temperature: ['C', 'F', 'K'],
    volume: ['l', 'ml', 'm3', 'cup', 'tbsp', 'tsp', 'gal'],
};

export default function ConverterForm({ onResult }) {
    const { user } = useContext(AuthContext);
    const [value, setValue] = useState('');
    const [from, setFrom] = useState('m');
    const [to, setTo] = useState('km');
    const [category, setCategory] = useState('length');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setError('');

        if (value === '' || isNaN(Number(value))) {
            setError('Please enter a numeric value.');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/convert', {
                value: Number(value),
                from,
                to,
                category,
                save: !!user // save only if logged in
            });
            onResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Build options for selected category
    const unitOptions = DEFAULT_UNITS[category] || [];

    return (
        <form onSubmit={submit} className="space-y-4 bg-white p-4 rounded shadow">
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 items-center">
                <input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="Value"
                    className="col-span-1 sm:col-span-1 w-full p-2 border rounded"
                    aria-label="Value"
                />

                <select
                    value={category}
                    onChange={e => {
                        setCategory(e.target.value);
                        // reset units when category changes
                        const first = DEFAULT_UNITS[e.target.value]?.[0] || '';
                        setFrom(first);
                        setTo(DEFAULT_UNITS[e.target.value]?.[1] || first);
                    }}
                    className="p-2 border rounded"
                >
                    {Object.keys(DEFAULT_UNITS).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <select value={from} onChange={e => setFrom(e.target.value)} className="flex-1 p-2 border rounded">
                        {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <select value={to} onChange={e => setTo(e.target.value)} className="flex-1 p-2 border rounded">
                        {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Converting...' : 'Convert'}
            </button>
        </form>
    );
}
