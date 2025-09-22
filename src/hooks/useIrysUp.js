import { useState, useCallback } from 'react';
import { useApiConfig } from '../context/ApiConfigContext';

const useIrysUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const { baseApiUrl } = useApiConfig();

    const reset = () => {
        setLoading(false);
        setError(null);
        setData(null);
    };

    const request = useCallback(async (url, options = {}) => {
        reset();
        setLoading(true);

        try {
            const token = localStorage.getItem('userToken') || localStorage.getItem('token') || localStorage.getItem('loginToken');

            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            };

            if (token && !options.skipAuth) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${baseApiUrl}/irysup${url}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP Error: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const registerCreator = useCallback(async (userData) => {
        return request('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }, [request]);

    const successRegist = useCallback(async (userData) => {
        return request('/success', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }, [request]);

    const getAllRegist = useCallback(async () => {
        return request('/all', { method: 'GET' });
    }, [request]);

    return {
        loading,
        error,
        data,
        registerCreator,
        successRegist,
        getAllRegist,
        reset,
    };
};

export default useIrysUp;