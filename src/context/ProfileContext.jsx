import React, { createContext, useContext, useEffect, useState } from 'react';

const ProfileContext = createContext();
console.log('IrysUp v0.1.0 - Beta')
export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within ProfileProvider');
    }
    return context;
};

export const ProfileProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        name: '',
        profilUrl: '',
        profileInitials: '',
        irysId: '',
        role: '',
        aboutMe: '',
        evmAddress: '',
        evmVerified: false,
    });

    const [loading, setLoading] = useState(true);

    const loadUserData = () => {
        try {
            const userDataRaw = localStorage.getItem('userData');
            if (!userDataRaw) {
                setProfileData({
                    name: '',
                    profilUrl: '',
                    profileInitials: '',
                    irysId: '',
                    role: '',
                    aboutMe: '',
                    evmAddress: '',
                    evmVerified: false,
                });
                setLoading(false);
                return;
            }

            const userData = JSON.parse(userDataRaw);
            const data = userData?.data || {};

            let initials = '';
            if (!data.profilUrl) {
                initials = data.name
                    .split(' ')
                    .map(part => part[0]?.toUpperCase())
                    .filter(Boolean)
                    .slice(0, 2)
                    .join('');
                initials = initials || '';
            }

            setProfileData({
                name: data.name || '',
                profilUrl: data.profilUrl || '',
                profileInitials: initials,
                irysId: data.irysId || '',
                role: data.role || '',
                aboutMe: data.aboutMe || '',
                evmAddress: data.evmAddress || '',
                evmVerified: !!data.evmVerified,
            });
        } catch (error) {
            console.error('Error parsing userData:', error);
            setProfileData({
                name: '',
                profilUrl: '',
                profileInitials: '',
                irysId: '',
                role: '',
                aboutMe: '',
                evmAddress: '',
                evmVerified: false,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            loadUserData();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateProfile = (updates) => {
        try {
            const userDataRaw = localStorage.getItem('userData');
            const userData = userDataRaw ? JSON.parse(userDataRaw) : { data: {} };

            const updatedData = {
                ...userData.data,
                ...updates,
            };

            localStorage.setItem('userData', JSON.stringify({ ...userData, data: updatedData }));

            setProfileData(prev => ({
                ...prev,
                ...updates,
                profileInitials: !updates.profilUrl && updates.name
                    ? updates.name
                        .split(' ')
                        .map(part => part[0]?.toUpperCase())
                        .filter(Boolean)
                        .slice(0, 2)
                        .join('') || ''
                    : prev.profileInitials,
            }));
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const value = {
        profileData,
        updateProfile,
        loading,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};