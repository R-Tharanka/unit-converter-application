// pages/Converter.jsx
// Page wrapper for ConverterForm. Shows the result below the form when a conversion happens.

import { useState } from 'react';
import ConverterForm from '../components/ConverterForm';

export default function Converter() {
    const [latest, setLatest] = useState(null);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">Unit Converter</h1>
                <p className="text-sm text-gray-600 mt-1">Fast, accurate conversions across common units.</p>
            </div>
            <div className="max-w-2xl mx-auto">
                <ConverterForm onResult={(data) => setLatest(data)} />
                {latest && (
                    <div className="mt-6 p-5 border rounded-xl bg-white shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Result</p>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">
                            {latest.value} {latest.from} → {latest.result} {latest.to}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Category: {latest.category}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
