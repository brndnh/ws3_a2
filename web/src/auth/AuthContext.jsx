import { createContext, useContext, useState } from 'react';

// keeps auth state + helpers in one place

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    });

    // login: save token + user
    const login = ({ token, user }) => {
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    // logout: clear everything
    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // optional: wrapper that adds auth header for fetch
    const authFetch = (url, options = {}) => {
        const headers = new Headers(options.headers || {});
        if (token) headers.set('authorization', `Bearer ${token}`);
        return fetch(url, { ...options, headers });
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, authFetch, isAuthed: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
