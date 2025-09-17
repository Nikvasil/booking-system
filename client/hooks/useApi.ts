'use client';

import { useState, useCallback } from 'react';

const API_URL = 'http://localhost:3001/api';

export const useApi = (token: string | null) => {
    const [error, setError] = useState<string | null>(null);

    const apiFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
        setError(null);
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...options.headers,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Request failed with status ${response.status}`);
            }
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    return { apiFetch, error, setError };
};