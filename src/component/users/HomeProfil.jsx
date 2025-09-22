import React, { useState } from 'react';
import { BsBoxArrowInDown, BsBoxArrowInUp, BsSave } from 'react-icons/bs';
import { FaLink, FaUnlink, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { AiOutlineEdit } from 'react-icons/ai';
import { ethers } from 'ethers';
import { execToIrysAddr } from '@irys/js/common/utils';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useApiConfig } from '../../context/ApiConfigContext.jsx';
import useUserApi from '../../hooks/useUserApi.js';
import './HomeProfil.css';

const HomeProfil = () => {
    const [toggleOne, setToggleOne] = useState(false);
    const [toggleTwo, setToggleTwo] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { baseApiUrl } = useApiConfig();

    const { profileData, updateProfile, loading } = useProfile();
    const { updateData, loading: apiLoading, error: updateError } = useUserApi();

    const walletStatus = profileData.evmVerified ? 'verified' : profileData.evmAddress ? 'address-saved' : 'unconnected';
    const account = profileData.evmAddress || '';

    const handleToggleOne = () => setToggleOne(!toggleOne);
    const handleToggleTwo = () => setToggleTwo(!toggleTwo);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            updateProfile({ profilUrl: previewUrl });
        }
    };

    const handleUpdateProfile = async () => {
        if (!profileData.irysId) {
            alert('Irys ID not found. Cannot update.');
            return;
        }

        const formData = new FormData();
        if (selectedFile) formData.append('image', selectedFile);

        const keysToPatch = ['name', 'aboutMe', 'evmAddress', 'irysAddress', 'x', 'discord', 'irysMail', 'irysGit'];
        const updateFields = keysToPatch.reduce((acc, key) => {
            const value = profileData[key];
            if (value !== undefined && value !== null && value !== '') acc[key] = value;
            return acc;
        }, {});

        try {
            let result;
            if (selectedFile) {
                const token = localStorage.getItem('userToken') || localStorage.getItem('token') || localStorage.getItem('loginToken');
                const response = await fetch(`${baseApiUrl}/user/update/profil/${profileData.irysId}`, {
                    method: 'PATCH',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                result = await response.json();

                if (result.success && result.data?.imageUrl) {
                    updateProfile({ profilUrl: result.data.imageUrl });
                    setSelectedFile(null);
                }
            } else {
                result = await updateData(profileData.irysId, updateFields);
            }

            if (result.success) {
                alert('Profile updated successfully!');
                if (updateFields.name && !selectedFile) {
                    const initials = updateFields.name
                        .split(' ')
                        .map(part => part[0]?.toUpperCase())
                        .filter(Boolean)
                        .slice(0, 2)
                        .join('');
                    updateProfile({ profileInitials: initials || '??' });
                }
            } else {
                alert('Failed to update profile: ' + (result.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('An error occurred while updating the profile.');
        }
    };

    const startEditName = () => setIsEditingName(true);
    const saveEditName = () => {
        setIsEditingName(false);
        updateProfile({ name: profileData.name });
    };

    const startEditBio = () => setIsEditingBio(true);
    const saveEditBio = () => {
        setIsEditingBio(false);
        updateProfile({ aboutMe: profileData.aboutMe });
    };

    const cancelEdit = () => {
        setIsEditingName(false);
        setIsEditingBio(false);
    };

    const handleLinkSocial = async (field, value) => {
        if (field === 'x' && value && !value.startsWith('@')) {
            alert('X handle must start with @ (e.g., @username)');
            return;
        }

        if (!value || value === 'x' || value === 'discord' || value === 'irysMail' || value === 'irysGit') {
            const result = await updateData(profileData.irysId, { [field]: null });
            if (result.success) {
                alert(`Successfully unlinked ${field}`);
                updateProfile({ [field]: null });
            } else {
                alert('Failed to unlink: ' + result.message);
            }
            return;
        }

        const result = await updateData(profileData.irysId, { [field]: value });
        if (result.success) {
            alert(`Successfully linked ${field}: ${value}`);
            updateProfile({ [field]: value });
        } else {
            alert('Failed to link: ' + result.message);
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('MetaMask not found. Please install MetaMask.');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const irysAddress = execToIrysAddr(address);

            updateProfile({
                evmAddress: address,
                irysAddress,
                evmVerified: false,
            });

            alert(`✅ Wallet connected: ${address}\n\nIrys Address: ${irysAddress}\nClick "Verify Wallet" to confirm ownership.`);
        } catch (err) {
            alert('Failed to connect wallet: ' + err.message);
        }
    };

    const verifyWallet = async () => {
        if (walletStatus !== 'address-saved') {
            alert('Please connect your wallet first.');
            return;
        }

        setIsSigning(true);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const evmAddress = await signer.getAddress();
            const irysAddress = execToIrysAddr(evmAddress);

            const message = `I am verifying ownership of this wallet for my IrysUp profile.
IrysID: ${profileData.irysId}
EVM Address: ${evmAddress}
Irys Address: ${irysAddress}
Timestamp: ${Date.now()}`;

            const signature = await signer.signMessage(message);

            const response = await fetch(`${baseApiUrl}/user/verify-signature`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('userToken') || localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    irysId: profileData.irysId,
                    address: evmAddress,
                    irysAddress,
                    signature,
                    message,
                }),
            });

            const result = await response.json();

            if (result.success) {
                updateProfile({ evmVerified: true });
                alert('✅ Wallet successfully verified!');
            } else {
                alert('❌ Failed: ' + result.message);
            }
        } catch (err) {
            alert('Verification failed: ' + err.message);
        } finally {
            setIsSigning(false);
        }
    };

    const unlinkWallet = async () => {
        if (walletStatus !== 'verified') return;

        setIsSigning(true);

        try {
            const result = await updateData(profileData.irysId, {
                evmAddress: null,
                irysAddress: null,
                evmVerified: false,
            });

            if (result.success) {
                updateProfile({
                    evmAddress: '',
                    irysAddress: '',
                    evmVerified: false,
                });
                alert('✅ Wallet successfully unlinked.');
            } else {
                alert('❌ Failed to unlink: ' + result.message);
            }
        } catch (err) {
            alert('Failed to unlink: ' + err.message);
        } finally {
            setIsSigning(false);
        }
    };

    const getIrysAddressFromEvm = (evmAddress) => {
        if (!evmAddress) return '';
        try {
            return execToIrysAddr(evmAddress);
        } catch (err) {
            return '';
        }
    };

    const isLinked = (value) => {
        return value && value !== 'x' && value !== 'discord' && value !== 'irysMail' && value !== 'irysGit';
    };

    const handleLogout = () => {
        const localKeys = [
            'userData',
            'userToken',
        ];

        const sessionKeys = [
            'searchableImages',
            'searchableUsers',
        ];

        localKeys.forEach(key => {
            localStorage.removeItem(key);
        });

        sessionKeys.forEach(key => {
            sessionStorage.removeItem(key);
        });

        updateProfile({
            name: '',
            aboutMe: '',
            evmAddress: '',
            irysAddress: '',
            evmVerified: false,
            irysId: '',
            profilUrl: '',
            profileInitials: '??',
            x: '',
            discord: '',
            irysMail: '',
            irysGit: '',
            role: '',
        });

        window.location.href = '/welcome';
    };

    return (
        <div className="right-dashboard-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h1 className="profile-title">Profile</h1>
                </div>

                <div className="profile-avatar">
                    {profileData.profilUrl ? (
                        <img src={profileData.profilUrl} alt="Profile" className="avatar-image" />
                    ) : (
                        <div className="avatar-placeholder">{profileData.profileInitials}</div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="avatar-upload-input"
                        style={{ display: 'none' }}
                    />
                    <label
                        htmlFor="avatar-upload-input"
                        className="avatar-edit-btn"
                        title={selectedFile ? "Save avatar" : "Edit avatar"}
                        onClick={(e) => {
                            if (selectedFile) {
                                e.preventDefault();
                                handleUpdateProfile();
                            }
                        }}
                    >
                        {selectedFile ? <BsSave size={20} className="avatar-icon" /> : <AiOutlineEdit size={20} className="avatar-icon" />}
                    </label>
                </div>

                <div className="profile-info">
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        {isEditingName ? (
                            <>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => updateProfile({ name: e.target.value })}
                                    className="info-input"
                                    autoFocus
                                />
                                <div className="edit-actions">
                                    <button onClick={saveEditName} className="action-btn confirm"><FaCheck size={14} /></button>
                                    <button onClick={cancelEdit} className="action-btn cancel"><FaTimes size={14} /></button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="info-value">{profileData.name || '—'}</span>
                                <button onClick={startEditName} className="action-btn edit"><FaEdit size={14} /></button>
                            </>
                        )}
                    </div>

                    <div className="info-item">
                        <span className="info-label">About Me:</span>
                        {isEditingBio ? (
                            <>
                                <textarea
                                    value={profileData.aboutMe}
                                    onChange={(e) => updateProfile({ aboutMe: e.target.value })}
                                    className="info-textarea"
                                    rows="2"
                                    autoFocus
                                />
                                <div className="edit-actions">
                                    <button onClick={saveEditBio} className="action-btn confirm"><FaCheck size={14} /></button>
                                    <button onClick={cancelEdit} className="action-btn cancel"><FaTimes size={14} /></button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="info-value">{profileData.aboutMe}</span>
                                <button onClick={startEditBio} className="action-btn edit"><FaEdit size={14} /></button>
                            </>
                        )}
                    </div>

                    <div className="info-item">
                        <span className="info-label">IrysUpID:</span>
                        <span className="info-value">{profileData.irysId}</span>
                    </div>

                    <div className="info-item">
                        <span className="info-label">Role:</span>
                        <span className="info-value">{profileData.role}</span>
                    </div>
                </div>

                <div className="toggle-section">
                    <div className="divider-line"></div>
                    <button className="toggle-btn" onClick={handleToggleOne}>
                        {toggleOne ? <BsBoxArrowInUp /> : <BsBoxArrowInDown />}
                    </button>
                    <div className="divider-line"></div>
                </div>

                {toggleOne && (
                    <div className="toggle-content">
                        <div className="section-title">Wallet & Addresses</div>
                        <div className="wallet-section">
                            <div className="info-item">
                                <span className="info-label">EVM Address</span>
                                <input
                                    type="text"
                                    value={account || 'Not connected'}
                                    readOnly
                                    className="info-input"
                                    style={{
                                        backgroundColor: walletStatus === 'verified' ? '#f8f8f8' : walletStatus === 'address-saved' ? '#fafafa' : '#fff',
                                        color: walletStatus === 'verified' ? '#111' : walletStatus === 'address-saved' ? '#333' : '#666',
                                    }}
                                />
                                <span
                                    className="info-icon"
                                    onClick={() => {
                                        if (walletStatus === 'verified') unlinkWallet();
                                        else connectWallet();
                                    }}
                                    title={walletStatus === 'verified' ? 'Unlink Wallet' : 'Connect Wallet'}
                                >
                                    {walletStatus === 'verified' ? <FaUnlink /> : <FaLink />}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">Irys Address</span>
                                <input
                                    type="text"
                                    value={getIrysAddressFromEvm(account) || (profileData.irysAddress || 'Not connected')}
                                    readOnly
                                    className="info-input"
                                    style={{
                                        backgroundColor: walletStatus === 'verified' ? '#f8f8f8' : walletStatus === 'address-saved' ? '#fafafa' : '#fff',
                                        color: walletStatus === 'verified' ? '#111' : walletStatus === 'address-saved' ? '#333' : '#666',
                                    }}
                                />
                                <span className="info-icon" style={{ visibility: 'hidden' }}></span>
                            </div>

                            <div className="wallet-action-buttons">
                                {walletStatus === 'unconnected' && (
                                    <button onClick={connectWallet} className="action-btn link">Connect Wallet</button>
                                )}
                                {walletStatus === 'address-saved' && (
                                    <button onClick={verifyWallet} disabled={isSigning} className="action-btn verify">
                                        {isSigning ? 'Verifying...' : 'Verify Wallet'}
                                    </button>
                                )}
                                {walletStatus === 'verified' && (
                                    <button onClick={unlinkWallet} disabled={isSigning} className="action-btn unlink">Unlink Wallet</button>
                                )}
                            </div>
                        </div>

                        <div className="section-title">Social Media</div>
                        <div className="social-section">
                            <div className="info-item">
                                <span className="info-label">X</span>
                                <input
                                    type="text"
                                    value={isLinked(profileData.x) ? profileData.x : ''}
                                    onChange={(e) => updateProfile({ x: e.target.value })}
                                    className="info-input"
                                    placeholder="@username"
                                />
                                <span
                                    className="info-icon"
                                    onClick={() => handleLinkSocial('x', profileData.x)}
                                    title={isLinked(profileData.x) ? "Unlink" : "Link"}
                                >
                                    {isLinked(profileData.x) ? <FaUnlink /> : <FaLink />}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">Discord</span>
                                <input
                                    type="text"
                                    value={isLinked(profileData.discord) ? profileData.discord : ''}
                                    onChange={(e) => updateProfile({ discord: e.target.value })}
                                    className="info-input"
                                    placeholder="username#1234"
                                />
                                <span
                                    className="info-icon"
                                    onClick={() => handleLinkSocial('discord', profileData.discord)}
                                    title={isLinked(profileData.discord) ? "Unlink" : "Link"}
                                >
                                    {isLinked(profileData.discord) ? <FaUnlink /> : <FaLink />}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">IrysMail</span>
                                <input
                                    type="email"
                                    value={isLinked(profileData.irysMail) ? profileData.irysMail : ''}
                                    onChange={(e) => updateProfile({ irysMail: e.target.value })}
                                    className="info-input"
                                    placeholder="you@irysmail.com"
                                />
                                <span
                                    className="info-icon"
                                    onClick={() => handleLinkSocial('irysMail', profileData.irysMail)}
                                    title={isLinked(profileData.irysMail) ? "Unlink" : "Link"}
                                >
                                    {isLinked(profileData.irysMail) ? <FaUnlink /> : <FaLink />}
                                </span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">IrysGit</span>
                                <input
                                    type="text"
                                    value={isLinked(profileData.irysGit) ? profileData.irysGit : ''}
                                    onChange={(e) => updateProfile({ irysGit: e.target.value })}
                                    className="info-input"
                                    placeholder="github.com/username"
                                />
                                <span
                                    className="info-icon"
                                    onClick={() => handleLinkSocial('irysGit', profileData.irysGit)}
                                    title={isLinked(profileData.irysGit) ? "Unlink" : "Link"}
                                >
                                    {isLinked(profileData.irysGit) ? <FaUnlink /> : <FaLink />}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={apiLoading}
                            className="update-btn"
                        >
                            {apiLoading ? 'Saving...' : 'Logout'}
                        </button>
                        {updateError && <p className="error-text">{updateError}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeProfil;