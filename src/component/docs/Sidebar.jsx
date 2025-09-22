import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { RiExpandLeftRightLine } from 'react-icons/ri';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

const Sidebar = () => {
    const navigate = useNavigate();
    const [openSections, setOpenSections] = useState({
        introduction: true,
        gettingStarted: true,
        guides: true,
        api: true,
        troubleshooting: true,
        roadmap: true,
        appendix: true,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState({});
    const [activeItem, setActiveItem] = useState(null);

    const itemToPathMap = {
        'What is IrysUp?': '/docs/introduction',
        'Why IrysUp?': '/docs/why-irysup',
        'System Used': '/docs/system-used',

        'Started User': '/docs/user',
        'Started Creator': '/docs/creator',
        'Authentication': '/docs/authentication',

        'Upload Images (Creator)': '/docs/upload-images',
        'Download Images & Edit': '/docs/download',
        'Upload File': '/docs/upload-file',

        'Base URL & Authentication': '/docs/api',
        'Endpoint: Post': '/docs/endpoint-post',
        'Endpoint: Get': '/docs/endpoint-get',
        'Error Codes & Response Format': '/docs/respon',

        'Technical FAQ': '/docs/technical',
        'Need Help?': '/docs/help',

        'Upcoming Features': '/docs/upcoming',
        'Latest Version': '/docs/latest',

        'Rate Limits': '/docs/limits',
        'Security': '/docs/security',
        'Terms & Service': '/docs/terms',
        'Pricing': '/docs/pricing',
    };

    const sections = useMemo(() => [
        {
            id: 'introduction',
            title: 'Introduction',
            items: ['What is IrysUp?', 'Why IrysUp?', 'System Used'],
        },
        {
            id: 'gettingStarted',
            title: 'Getting Started',
            items: ['Started User', 'Started Creator', 'Authentication'],
        },
        {
            id: 'guides',
            title: 'Guides',
            items: ['Upload Images (Creator)', 'Download Images & Edit', 'Upload File'],
        },
        {
            id: 'api',
            title: 'API Reference',
            items: [
                'Base URL & Authentication',
                'Endpoint: Post',
                'Endpoint: Get',
                'Error Codes & Response Format',
            ],
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            items: ['Technical FAQ', 'Need Help?'],
        },
        {
            id: 'roadmap',
            title: 'Roadmap',
            items: ['Upcoming Features', 'Latest Version'],
        },
        {
            id: 'appendix',
            title: 'Appendix',
            items: ['Rate Limits', 'Security', 'Terms & Service', 'Pricing'],
        },
    ], []);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredItems({});
            return;
        }

        const lowerQuery = searchQuery.toLowerCase().trim();
        const newFiltered = {};

        sections.forEach((section) => {
            newFiltered[section.id] = section.items.filter((item) =>
                item.toLowerCase().includes(lowerQuery)
            );
        });

        setFilteredItems(newFiltered);
    }, [searchQuery, sections]);

    const isSectionMatched = useMemo(() => {
        if (!searchQuery.trim()) return {};
        const matched = {};
        sections.forEach((section) => {
            matched[section.id] = filteredItems[section.id]?.length > 0;
        });
        return matched;
    }, [searchQuery, filteredItems, sections]);

    const handleItemClick = (itemText) => {
        setActiveItem(itemText);
        const path = itemToPathMap[itemText];
        if (path) {
            navigate(path);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">IrysUp Docs</h2>
                <span className="sidebar-version">v0.1.0</span>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {sections.map((section) => {
                const isSearching = !!searchQuery.trim();
                const hasMatches = isSearching && isSectionMatched[section.id];
                const shouldExpand = isSearching ? hasMatches : openSections[section.id];

                if (isSearching && !hasMatches) return null;

                return (
                    <div key={section.id} className="nav-section">
                        <button
                            className="nav-section-title"
                            onClick={() => !isSearching && toggleSection(section.id)}
                            aria-label={`Toggle ${section.title}`}
                            disabled={isSearching}
                            style={isSearching ? { cursor: 'default', opacity: 0.8 } : {}}
                        >
                            {section.title}
                            {!isSearching && (
                                shouldExpand ? (
                                    <RiExpandLeftRightLine className="toggle-icon expanded" size={18} />
                                ) : (
                                    <RiExpandLeftRightLine className="toggle-icon" size={18} />
                                )
                            )}
                        </button>
                        <ul
                            className={`nav-section-items ${shouldExpand ? 'expanded' : ''}`}
                        >
                            {section.items.map((item, idx) => {
                                const isHidden =
                                    isSearching && !item.toLowerCase().includes(searchQuery.toLowerCase());
                                return (
                                    <li
                                        key={idx}
                                        className={`nav-item ${isHidden ? 'hidden' : ''} ${activeItem === item ? 'active' : ''
                                            }`}
                                        onClick={() => handleItemClick(item)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {item}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}

            <div className="social-footer-docs">
                <a
                    href="https://github.com/irysup-xyz"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub"
                >
                    <FaGithub />
                </a>
                <a
                    href="https://github.com/irysupxyz"
                    target="_blank"
                    rel="noreferrer"
                    title="Twitter"
                >
                    <FaTwitter />
                </a>
                <a
                    href="https://discord.gg/irysupxyz"
                    target="_blank"
                    rel="noreferrer"
                    title="Discord"
                >
                    <FaDiscord />
                </a>
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=irysupxyz@gmail.com&su=Feedback%20for%20IrysUp&body=Hello%2C%0A%0AI%27d%20like%20to%20share%20some%20feedback%20about%20the%20IrysUp%20platform.%0A%0AThank%20you!"
                    target="_blank"
                    rel="noreferrer"
                    title="gmail"
                >
                    <FiMail />
                </a>
            </div>
            <div style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                <p>© 2025 IrysUp</p>
                <p>Built by the Community</p>
            </div>
        </div>
    );
};

export default Sidebar;