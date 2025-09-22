import { useState, useEffect } from 'react';
import userApi from './useUserApi';

const SEARCH_KEY = 'searchableUsers';
const CACHE_DURATION = 30 * 60 * 1000;

export const useSearchableUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getAllUsers } = userApi();

    const loadFromSession = () => {
        const cached = sessionStorage.getItem(SEARCH_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                const now = Date.now();
                if (now - parsed.timestamp < CACHE_DURATION) {
                    return parsed.users || [];
                } else {
                    sessionStorage.removeItem(SEARCH_KEY);
                }
            } catch (e) {
                console.error('Failed to parse cached users:', e);
                sessionStorage.removeItem(SEARCH_KEY);
            }
        }
        return null;
    };

    const fetchAndCache = async () => {
        try {
            const response = await getAllUsers();

            if (response.success && Array.isArray(response.data)) {
                const userArray = response.data
                    .filter(user => user.name && user.irysId)
                    .map(user => ({
                        name: user.name,
                        irysId: user.irysId,
                        role: user.role || '',
                        aboutMe: user.aboutMe || '',
                        profilUrl: user.profilUrl || '',
                        evmAddress: user.evmAddress || '',
                        irysAddress: user.irysAddress || '',
                        x: user.x || '',
                        discord: user.discord || '',
                        irysMail: user.irysMail || '',
                        irysGit: user.irysGit || '',
                    }));

                setUsers(userArray);
                sessionStorage.setItem(
                    SEARCH_KEY,
                    JSON.stringify({
                        users: userArray,
                        timestamp: Date.now(),
                    })
                );
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cachedUsers = loadFromSession();
        if (cachedUsers) {
            setUsers(cachedUsers);
            setLoading(false);
        } else {
            fetchAndCache();
        }

        const intervalId = setInterval(() => {
            const cached = sessionStorage.getItem(SEARCH_KEY);
            if (cached) {
                try {
                    const { timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp >= CACHE_DURATION) {
                        fetchAndCache();
                    }
                } catch (e) {
                    console.error('Error checking cache timestamp:', e);
                    fetchAndCache();
                }
            } else {
                fetchAndCache();
            }
        }, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [getAllUsers]);

    const search = (query) => {
        if (!query.trim()) return users;
        const lowerQuery = query.toLowerCase().trim();
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(lowerQuery) ||
                user.irysId.toLowerCase().includes(lowerQuery)
        );
    };

    return {
        users,
        loading,
        error,
        search,
    };
};