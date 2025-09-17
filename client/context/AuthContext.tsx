'use client';

import { createContext, useState, useEffect, useContext, ReactNode, FC } from 'react';

const API_URL = 'http://localhost:3001/api';

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Login failed');
        }
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isLoading }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};