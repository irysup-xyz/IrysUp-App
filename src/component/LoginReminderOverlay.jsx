import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginReminderOverlay.css';

const LoginReminderOverlay = () => {
    const { isLogin, loading, logout } = useAuth();
    const [isVisible, setIsVisible] = useState(true);

    if (loading || isLogin || !isVisible) return null;

    const handleLoginClick = () => {
        logout();
        window.location.href = ('/welcome');
    };

    return (
        <div className="login-reminder-overlay">
            <div className="login-reminder-card">
                <button 
                    className="close-reminder-btn" 
                    onClick={() => setIsVisible(false)}
                    title="Tutup sementara"
                    aria-label="Tutup notifikasi"
                >
                    ❌
                </button>
                <p>You’re not logged in to IrysUp. Please log in to continue. </p>
                <button 
                    className="login-reminder-btn" 
                    onClick={handleLoginClick}
                    aria-label="Pergi ke halaman login"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginReminderOverlay;