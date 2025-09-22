import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(true); 

    const checkTokenValidity = () => {
        try {
            const tokenExpRaw = localStorage.getItem('tokenExp');
            const userToken = localStorage.getItem('userToken');

            if (!userToken || !tokenExpRaw) {
                logout();
                return false;
            }

            const tokenExp = parseInt(tokenExpRaw, 10);
            const now = Date.now();

            if (now > tokenExp) {
                console.log('Token expired. Logging out...');
                logout();
                return false;
            }

            setIsLogin(true);
            return true;
        } catch (error) {
            console.error('Error checking token validity:', error);
            logout();
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('tokenExp');
        localStorage.removeItem('userData');
        setIsLogin(false);
    };

    useEffect(() => {
        setLoading(true);
        const isValid = checkTokenValidity();
        setLoading(false);

        const intervalId = setInterval(() => {
            checkTokenValidity();
        }, 30_000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            checkTokenValidity();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const value = {
        isLogin,
        loading,
        logout, 
        checkTokenValidity, 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};