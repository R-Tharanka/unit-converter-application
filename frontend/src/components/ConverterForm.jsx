import { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ConverterForm({ onResult }) {
    const { user } = useContext(AuthContext);
    const [value, setValue] = useState('');
    const [from, setFrom] = useState('m');
    const [to, setTo] = useState('km');
    const [category, setCategory] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        // client-side validation
        if (value === '' || isNaN(Number(value))) return alert('Enter a number');

        try {
            const res = await api.post('/convert', { value: Number(value), from, to, category, save: !!user });
            onResult(res.data);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <input value={value} onChange={e => setValue(e.target.value)} placeholder="Value" className="input" />
            {/* select for from/to, category optional */}
            <div className="flex gap-2">
                <select value={from} onChange={e => setFrom(e.target.value)}>{/* options */}</select>
                <select value={to} onChange={e => setTo(e.target.value)}>{/* options */}</select>
            </div>
            <button className="btn">Convert</button>
        </form>
    );
}
