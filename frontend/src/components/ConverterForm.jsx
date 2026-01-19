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

    const swapUnits = () => {
        setFrom(to);
        setTo(from);
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');

        const numericValue = Number(value);

        if (value === '' || Number.isNaN(numericValue)) {
            setError('Please enter a numeric value.');
            return;
        }

        if (category !== 'temperature' && numericValue < 0) {
            setError('Negative values are only allowed for temperature conversions.');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/convert', {
                value: numericValue,
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
        <form onSubmit={submit} className="space-y-5 bg-white p-6 rounded-xl shadow">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Convert units</h2>
                <p className="text-sm text-gray-500">Choose a category, units, and enter a value.</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end">
                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Value</label>
                    <input
                        type="number"
                        step="any"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Enter value"
                        className="w-full p-2 border rounded"
                        aria-label="Value"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Category</label>
                    <select
                        value={category}
                        onChange={e => {
                            setCategory(e.target.value);
                            // reset units when category changes
                            const first = DEFAULT_UNITS[e.target.value]?.[0] || '';
                            setFrom(first);
                            setTo(DEFAULT_UNITS[e.target.value]?.[1] || first);
                        }}
                        className="w-full p-2 border rounded"
                    >
                        {Object.keys(DEFAULT_UNITS).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-sm text-gray-600">Units</label>
                    <div className="flex items-center gap-2">
                        <select value={from} onChange={e => setFrom(e.target.value)} className="flex-1 p-2 border rounded">
                            {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <button
                            type="button"
                            onClick={swapUnits}
                            className="px-3 py-2 rounded border text-gray-600 hover:bg-gray-50"
                            aria-label="Swap units"
                            title="Swap units"
                        >
                            ⇄
                        </button>
                        <select value={to} onChange={e => setTo(e.target.value)} className="flex-1 p-2 border rounded">
                            {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
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
