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
    const [status, setStatus] = useState('');

    const swapUnits = () => {
        setFrom(to);
        setTo(from);
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');

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
            if (res.data.savedId) {
                setStatus('Conversion saved to your history.');
            } else if (user) {
                setStatus('Converted — sign in again if you expected this to save.');
            } else {
                setStatus('Converted — create an account to save results automatically.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Build options for selected category
    const unitOptions = DEFAULT_UNITS[category] || [];

    return (
        <form onSubmit={submit} className="space-y-6 rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-2xl backdrop-blur">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Convert units</h2>
                <p className="mt-1 text-sm text-gray-500">Choose a category, enter a value, and we will keep track of it for you.</p>
            </div>

            {error && <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            {status && !error && <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</p>}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
                <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Value</label>
                    <input
                        type="number"
                        step="any"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="e.g. 120"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-gray-900 shadow-sm transition focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        aria-label="Value"
                    />
                </div>

                <div className="md:col-span-3">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {Object.keys(DEFAULT_UNITS).map(cat => {
                            const isActive = cat === category;
                            return (
                                <button
                                    type="button"
                                    key={cat}
                                    onClick={() => {
                                        setCategory(cat);
                                        const first = DEFAULT_UNITS[cat]?.[0] || '';
                                        setFrom(first);
                                        setTo(DEFAULT_UNITS[cat]?.[1] || first);
                                    }}
                                    className={`rounded-full border px-4 py-2 text-sm font-medium transition whitespace-nowrap ${isActive ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-sm' : 'border-slate-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600'}`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="md:col-span-5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Units</label>
                    <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center">
                        <select
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <button
                            type="button"
                            onClick={swapUnits}
                            className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-base text-blue-600 transition hover:bg-blue-100"
                            aria-label="Swap units"
                            title="Swap units"
                        >
                            ↔
                        </button>
                        <select
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60"
            >
                {loading ? 'Converting…' : 'Convert now'}
            </button>

            {!user && (
                <p className="text-xs text-center text-gray-500">
                    Sign in to automatically save every result to your history.
                </p>
            )}
        </form>
    );
}
