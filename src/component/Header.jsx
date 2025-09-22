import React, { useState, useEffect, useRef } from 'react';
import { BiHomeAlt2 } from 'react-icons/bi';
import { LuImageUpscale } from 'react-icons/lu';
import { BsBoxes } from 'react-icons/bs';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { IoCreateOutline } from 'react-icons/io5';
import { useProfile } from '../context/ProfileContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearchableImages } from '../hooks/useSearchableImages';
import { useSearchableUsers } from '../hooks/useSearchableUsers';
import { FaUser } from 'react-icons/fa6';
import { AiOutlineFileImage } from 'react-icons/ai';
import { FaRegArrowAltCircleUp } from 'react-icons/fa';
import irysLogo from '../assets/irysUplogo.png';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { profileData, loading } = useProfile();

    const { images, loading: imagesLoading, error: imagesError, search: searchImages } = useSearchableImages();
    const { users, loading: usersLoading, error: usersError, search: searchUsers } = useSearchableUsers();

    const combinedSearch = (query) => {
        if (!query.trim()) return [];

        const imageResults = searchImages(query).map(item => ({
            type: 'image',
            ...item,
        }));

        const userResults = searchUsers(query).map(item => ({
            type: 'user',
            ...item,
            name: item.name || '',
            irysId: item.irysId || '',
            role: item.role || '',
            imageName: null,
            imageId: null,
            creator_name: item.name,
            creator_irysId: item.irysId,
        }));

        return [...imageResults, ...userResults];
    };

    const baseNavItems = [
        { id: 'home', label: 'Home', icon: <BiHomeAlt2 />, path: '/home' },
        { id: 'content', label: 'Content', icon: <BsBoxes />, path: '/content' },
        { id: 'storage', label: 'Irys Storage', icon: <LuImageUpscale />, path: '/storage' },
        { id: 'overview', label: 'Overview', icon: <HiOutlineViewGridAdd />, path: '/overview' },
        { id: 'creator', label: 'Creator', icon: <IoCreateOutline />, path: '/creator' },
        { id: 'irysup', label: 'IrysUp', icon: <FaRegArrowAltCircleUp />, path: '/irysUp' },
    ];

    const filteredNavItems = baseNavItems.filter(item => {
        if (item.id === 'creator') {
            return profileData?.role === 'creator' || profileData?.role === 'irysUp';
        }

        if (item.id === 'irysup') {
            return profileData?.role === 'irysUp';
        }

        return true;
    });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (path) => {
        navigate(path);
    };

    const [searchQuery, setSearchQuery] = useState('');
    const filteredResults = combinedSearch(searchQuery);
    const searchInputTopRef = useRef(null);
    const searchInputBottomRef = useRef(null);

    const [dropdownPositionTop, setDropdownPositionTop] = useState({ top: 0, left: 0, width: 0 });
    const [dropdownPositionBottom, setDropdownPositionBottom] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (!searchQuery) return;

        const activeInput = scrolled ? searchInputBottomRef.current : searchInputTopRef.current;
        if (!activeInput) return;

        const rect = activeInput.getBoundingClientRect();

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let calculatedTop;

        if (scrolled) {
            calculatedTop = rect.bottom + 4;
        } else {
            calculatedTop = rect.bottom + scrollTop + 4;
        }

        setDropdownPositionTop({
            top: calculatedTop,
            left: rect.left,
            width: rect.width,
        });

        setDropdownPositionBottom({
            top: calculatedTop,
            left: rect.left,
            width: rect.width,
        });
    }, [searchQuery, scrolled]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const activeInput = scrolled ? searchInputBottomRef.current : searchInputTopRef.current;
            const activeDropdown = scrolled
                ? document.querySelector('.search-results.small')
                : document.querySelector('.search-results');

            if (activeInput && !activeInput.contains(event.target) && activeDropdown && !activeDropdown.contains(event.target)) {
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchQuery, scrolled]);

    return (
        <>
            <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
                {!scrolled && (
                    <div className="header-top">
                        <div className="header-left">
                            <div className="header-logo">
                                <img src={irysLogo} alt="IrysUp Logo" className="header-logo-content" />
                            </div>
                            <div className="header-name">IrysUp</div>
                        </div>
                        <div className="header-right">
                            <div className="search-container">
                                <input
                                    ref={searchInputTopRef}
                                    type="text"
                                    placeholder="Search by image name, creator, or ID..."
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="header-nav-icons">
                                {filteredNavItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`nav-icon-item ${location.pathname === item.path ? 'active' : ''}`}
                                        onClick={() => handleNavClick(item.path)}
                                    >
                                        {item.icon}
                                    </div>
                                ))}
                            </div>
                            <div className="profil-images">
                                {profileData?.profilUrl ? (
                                    <img src={profileData.profilUrl} alt="Profile" className="profile-pic" />
                                ) : (
                                    <div className="profile-initials profile-pic">{profileData?.profileInitials}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <nav className="header-nav-bottom">
                <div className="nav-left">
                    {scrolled && (
                        <img src={irysLogo} alt="IrysUp" className="logo-scrolled" />
                    )}
                    <div className="nav-text-items">
                        {filteredNavItems.map((item) => (
                            <span
                                key={item.id}
                                className={`nav-text-item ${location.pathname === item.path ? 'active' : ''}`}
                                onClick={() => handleNavClick(item.path)}
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>
                {scrolled && (
                    <div className="nav-right">
                        <div className="search-container small">
                            <input
                                ref={searchInputBottomRef}
                                type="text"
                                placeholder="Search..."
                                className="search-input small"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {profileData?.profilUrl ? (
                            <img src={profileData.profilUrl} alt="Profile" className="profile-pic small" />
                        ) : (
                            <div className="profile-initials profile-pic small">{profileData?.profileInitials}</div>
                        )}
                    </div>
                )}
            </nav>

            {searchQuery && !scrolled && (
                <div
                    className="search-results"
                    style={{
                        position: 'fixed',
                        top: dropdownPositionTop.top,
                        left: dropdownPositionTop.left,
                        width: dropdownPositionTop.width,
                        zIndex: 1004,
                        margin: 0,
                        borderRadius: 'var(--irysup-radius-md)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                        backgroundColor: 'rgba(255, 255, 255, 0.96)',
                        backdropFilter: 'blur(8px)',
                        padding: '0',
                        overflowY: 'auto',
                        maxHeight: '300px',
                        border: 'none',
                        pointerEvents: 'auto',
                    }}
                >
                    {filteredResults.length > 0 ? (
                        filteredResults.slice(0, 5).map((item, index) => (
                            <div
                                key={index}
                                className="search-result-item"
                                onClick={() => {
                                    if (item.type === 'image') {
                                        navigate(`/images?id=${item.imageName}`);
                                    } else if (item.type === 'user') {
                                        navigate(`/profile?irysId=${item.irysId}`);
                                    }
                                    setSearchQuery('');
                                }}
                            >
                                <div>
                                    {item.type === 'image' ? <AiOutlineFileImage /> : <FaUser />}
                                    <strong>{item.imageName || item.name}</strong>
                                </div>
                                {item.type === 'image' ? (
                                    <>
                                        {item.imageId} • {item.creator_name} • {item.creator_irysId}
                                    </>
                                ) : (
                                    <>
                                        {item.irysId} • {item.role ? `(${item.role})` : ''}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="search-result-item">
                            {imagesLoading || usersLoading ? 'Searching...' : 'No results found'}
                        </div>
                    )}
                </div>
            )}

            {searchQuery && scrolled && (
                <div
                    className="search-results small"
                    style={{
                        position: 'fixed',
                        top: dropdownPositionBottom.top,
                        left: dropdownPositionBottom.left,
                        width: dropdownPositionBottom.width,
                        zIndex: 1004,
                        margin: 0,
                        borderRadius: 'var(--irysup-radius-md)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                        backgroundColor: 'rgba(255, 255, 255, 0.96)',
                        backdropFilter: 'blur(8px)',
                        padding: '0',
                        overflowY: 'auto',
                        maxHeight: '300px',
                        border: 'none',
                        pointerEvents: 'auto',
                    }}
                >
                    {filteredResults.length > 0 ? (
                        filteredResults.slice(0, 5).map((item, index) => (
                            <div
                                key={index}
                                className="search-result-item"
                                onClick={() => {
                                    if (item.type === 'image') {
                                        navigate(`/images?id=${item.imageId}`);
                                    } else if (item.type === 'user') {
                                        navigate(`/profile?irysId=${item.irysId}`);
                                    }
                                    setSearchQuery('');
                                }}
                            >
                                <div>
                                    {item.type === 'image' ? <AiOutlineFileImage /> : <FaUser />}
                                    <strong>{item.imageName || item.name}</strong>
                                </div>
                                {item.type === 'image' ? (
                                    <>
                                        {item.imageId} • {item.creator_name} • {item.creator_irysId}
                                    </>
                                ) : (
                                    <>
                                        {item.irysId} • {item.role ? `(${item.role})` : ''}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="search-result-item">
                            {imagesLoading || usersLoading ? 'Searching...' : 'No results found'}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Header;