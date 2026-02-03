// pages/Converter.jsx
// Page wrapper for ConverterForm. Shows the result below the form when a conversion happens.

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ConverterForm from '../components/ConverterForm';
import { AuthContext } from '../context/AuthContext';

export default function Converter() {
    const [latest, setLatest] = useState(null);
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 px-4 py-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row">
                <div className="flex-1 space-y-6">
                    <div className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-xl backdrop-blur">
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">Convert smarter</span>
                        <h1 className="mt-4 text-4xl font-semibold leading-tight text-gray-900">Instant unit conversions, beautifully organized.</h1>
                        <p className="mt-3 text-base text-gray-600">
                            Swap between length, mass, temperature, and volume without breaking your flow. Sign in to keep your history synced wherever you go.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row">
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                <span className="text-xl">⚡</span>
                                <div>
                                    <p className="font-semibold text-gray-900">Fast conversions</p>
                                    <p>Optimized API with saved preferences.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                <span className="text-xl">🗂️</span>
                                <div>
                                    <p className="font-semibold text-gray-900">Personal history</p>
                                    <p>Access every conversion on any device.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                            <Link
                                to="/history"
                                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                            >
                                View history
                            </Link>
                            {!user && (
                                <Link
                                    to="/auth"
                                    className="inline-flex items-center justify-center rounded-full border border-transparent bg-blue-50 px-5 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                                >
                                    Create an account
                                </Link>
                            )}
                        </div>
                    </div>

                    {latest && (
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Most recent result</p>
                            <p className="mt-3 text-3xl font-semibold text-gray-900">
                                {latest.value} {latest.from} → {latest.result} {latest.to}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">Category: {latest.category}</p>
                        </div>
                    )}
                </div>

                <div className="flex-1 lg:max-w-xl">
                    <ConverterForm onResult={(data) => setLatest(data)} />
                </div>
            </div>
        </div>
    );
}
