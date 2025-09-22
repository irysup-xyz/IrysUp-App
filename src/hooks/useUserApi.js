import { useState, useCallback } from 'react';
import { useApiConfig } from '../context/ApiConfigContext';

const useUserApi = () => {
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

            const response = await fetch(`${baseApiUrl}${url}`, {
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

    const tryRegister = useCallback(async () => {
        return request('/user/request/register', { method: 'GET' });
    }, [request]);

    const register = useCallback(async (userData) => {
        return request('/user/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }, [request]);

    const requestLogin = useCallback(async (name) => {
        return request('/user/request/login', {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    }, [request]);

    const login = useCallback(async (credentials) => {
        return request('/user/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }, [request]);

    const updateData = useCallback(async (irysId, updateFields) => {
        return request(`/user/update/${irysId}`, {
            method: 'PATCH',
            body: JSON.stringify(updateFields),
        });
    }, [request]);

    const promotion = useCallback(async (irysId, role) => {
        return request('/user/promotion', {
            method: 'POST',
            body: JSON.stringify({
                irysId,
                role,
            }),
        });
    }, [request]);

    const deleteUser = useCallback(async (irysId) => {
        return request(`/user/delete/${irysId}`, {
            method: 'DELETE',
        });
    }, [request]);

    const deleteAvatar = useCallback(async (filename) => {
        return request(`/user/profil/${filename}`, {
            method: 'DELETE',
        });
    }, [request]);

    const getAllUsers = useCallback(async () => {
        return request('/user/all/users', { method: 'GET' });
    }, [request]);

    const getUserCollection = useCallback(async (irysId) => {
        return request(`/user/collection/${irysId}`, { method: 'GET' });
    }, [request]);

    const addFile = useCallback(async (data) => {
        return request('/user/irysup-storage', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }, [request]);

    const getUserFile = useCallback(async (irysId) => {
        return request(`/user/irysup-storage/${irysId}`, { method: 'GET' });
    }, [request]);

    return {
        loading,
        error,
        data,
        tryRegister,
        register,
        requestLogin,
        login,
        updateData,
        promotion,
        deleteUser,
        deleteAvatar,
        getAllUsers,
        getUserCollection,
        addFile,
        getUserFile,
        reset,
    };
};

export default useUserApi;