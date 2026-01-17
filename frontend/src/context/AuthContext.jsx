// context/AuthContext.jsx
// Provides a simple JWT auth context for the frontend.
// Stores token and email in localStorage.
// Exposes login() and logout() helpers for components.

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

/**
 * AuthProvider
 * - Stores { token, email } in state when logged in.
 * - login(payload) expects the backend response object: { token, user } or { token, user: { email, id } }.
 * - logout() clears localStorage and state.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        return token ? { token, email } : null;
    });

    // login helper - stores token and email (called after successful auth)
    const login = (payload) => {
        // payload may be { token, user } or token/user flattened depending on backend; handle safely
        const token = payload?.token || payload?.data?.token;
        const userObj = payload?.user || payload?.data?.user || {};
        const email = userObj?.email || userObj?.email || localStorage.getItem('email') || '';

        if (token) {
            localStorage.setItem('token', token);
        }
        if (email) {
            localStorage.setItem('email', email);
        }

        setUser(token ? { token, email } : null);
    };

    // logout helper - clears stored credentials
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setUser(null);
    };

    // Optional: you could validate token on mount by pinging /api/health; omitted for simplicity
    useEffect(() => {
        // keep this light: if token removed externally, sync state
        const handleStorage = () => {
            const token = localStorage.getItem('token');
            if (!token) setUser(null);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
