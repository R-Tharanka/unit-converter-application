import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        return token ? { token, email } : null;
    });

    const login = ({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', user.email);
        setUser({ token, email: user.email });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
