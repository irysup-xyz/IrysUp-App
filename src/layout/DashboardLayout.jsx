import React, { useState, useEffect } from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import LoginReminderOverlay from'../component/LoginReminderOverlay';
import './DashboardLayout.css';

export const Dashboard = ({ children }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerHeight = scrolled ? 3 : 0;

    return (
        <div className="dashboard-layout">
            <Header />
            <main
                className="dashboard-main"
                style={{
                    paddingTop: headerHeight,
                }}
            >
                <section className="dashboard-content">
                    {children}
                </section>
            </main>
            <Footer />
            <LoginReminderOverlay />
        </div>
    );
};