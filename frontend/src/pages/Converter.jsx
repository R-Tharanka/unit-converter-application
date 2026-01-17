// pages/Converter.jsx
// Page wrapper for ConverterForm. Shows the result below the form when a conversion happens.

import { useState } from 'react';
import ConverterForm from '../components/ConverterForm';

export default function Converter() {
    const [latest, setLatest] = useState(null);

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Unit Converter</h1>
            <div className="max-w-xl mx-auto">
                <ConverterForm onResult={(data) => setLatest(data)} />
                {latest && (
                    <div className="mt-6 p-4 border rounded bg-white">
                        <p className="text-sm text-gray-600">Result</p>
                        <p className="text-xl font-medium">
                            {latest.value} {latest.from} → {latest.result} {latest.to}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
