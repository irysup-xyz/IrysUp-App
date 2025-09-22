import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchableUsers } from '../../hooks/useSearchableUsers';
import './PublicProfileCard.css';

const PublicProfileCard = () => {
    const [searchParams] = useSearchParams();
    const irysId = (searchParams.get('irysId') || '').trim();

    const { users, loading, error } = useSearchableUsers();

    let user = null;
    if (Array.isArray(users) && irysId) {
        user = users.find(u => u.irysId?.trim() === irysId);
    }

    React.useEffect(() => {
        console.log('🔍 URL Irys ID:', `"${irysId}"`);
        console.log('👥 Total Users:', Array.isArray(users) ? users.length : 'NOT ARRAY!');
        console.log('🎯 Found User:', user);
    }, [irysId, users]);

    if (loading) {
        return <div className="profile-card">Loading profile...</div>;
    }

    if (error) {
        return <div className="profile-card error">Error: {error}</div>;
    }

    if (!user) {
        return (
            <div className="profile-card not-found">
                <p>User with Irys ID <strong>{irysId}</strong> not found.</p>
                <button onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '8px 16px' }}>
                    Refresh Data
                </button>
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(part => part[0]?.toUpperCase())
            .filter(Boolean)
            .slice(0, 2)
            .join('');
    };

    const isLinked = (value) => {
        return value && !['x', 'discord', 'irysMail', 'irysGit'].includes(value);
    };

    const shortenEvmAddress = (address, startLength = 6, endLength = 4) => {
        if (!address) return '';
        if (address.length <= startLength + endLength) return address;
        return address.slice(0, startLength) + '...' + address.slice(-endLength);
    };

    return (
        <div className="profile-card public-profile">
            <div className="profile-header">
                <h1 className="profile-title">Public Profile</h1>
            </div>

            <div className="profile-avatar">
                {user.profilUrl ? (
                    <img src={user.profilUrl} alt={`${user.name}'s profile`} className="avatar-image" />
                ) : (
                    <div className="avatar-placeholder">{getInitials(user.name)}</div>
                )}
            </div>

            <div className="profile-info">
                <div className="info-item">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{user.name || '—'}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">About Me:</span>
                    <span className="info-value">{user.aboutMe || '—'}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">IrysUpID:</span>
                    <span className="info-value">{user.irysId}</span>
                </div>

                <div className="info-item">
                    <span className="info-label">Role:</span>
                    <span className="info-value">{user.role || '—'}</span>
                </div>
            </div>

            <div className="divider-line"></div>

            <div className="section-title">Wallet & Addresses</div>
            <div className="wallet-section">
                <div className="info-item">
                    <span className="info-label">EVM Address:</span>
                    <span className="info-value">
                        {user.evmAddress
                            ? shortenEvmAddress(user.evmAddress)
                            : 'Not connected'}
                    </span>
                </div>

                <div className="info-item">
                    <span className="info-label">Irys Address:</span>
                    <span className="info-value">{user.irysAddress || 'Not connected'}</span>
                </div>
            </div>

            <div className="section-title">Social Media</div>
            <div className="social-section">
                {[
                    { label: 'X:', value: user.x },
                    { label: 'Discord:', value: user.discord },
                    { label: 'IrysMail:', value: user.irysMail },
                    { label: 'IrysGit:', value: user.irysGit },
                ].map((social) => (
                    <div className="info-item" key={social.label}>
                        <span className="info-label">{social.label}</span>
                        <span className="info-value">
                            {isLinked(social.value) ? social.value : '—'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicProfileCard;