import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useSearchableImages } from '../../hooks/useSearchableImages.js';
import useUserApi from '../../hooks/useUserApi.js';
import './HomeContent.css';
import { useNavigate } from 'react-router-dom';

const ContentCard = () => {
    const { profileData } = useProfile();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { images, loading: imagesLoading, error: imagesError } = useSearchableImages();

    const { getUserCollection } = useUserApi();

    const [collectionItems, setCollectionItems] = useState([]);
    const [collectionsLoading, setCollectionsLoading] = useState(true);
    const [collectionsError, setCollectionsError] = useState(null);

    const isCreator = profileData?.role === 'creator' || profileData?.role === 'irysUp';

    const filteredImages = useMemo(() => {
        if (!isCreator || !profileData?.name) return [];

        const creatorName = profileData.name.toLowerCase();
        return images.filter(
            asset =>
                asset.creator_name?.toLowerCase() === creatorName ||
                asset.creator_irysId?.toLowerCase() === creatorName
        );
    }, [images, isCreator, profileData?.name]);

    useEffect(() => {
        const fetchCollectionItems = async () => {
            if (!profileData?.irysId) {
                setCollectionsLoading(false);
                return;
            }

            try {
                setCollectionsLoading(true);
                setCollectionsError(null);
                const data = await getUserCollection(profileData.irysId);

                const rawItems = (data?.data || []).filter(item => {
                    if (!item.imageUserId) return false;
                    try {
                        const parsed = JSON.parse(item.imageUserId);
                        return parsed.imageUrl;
                    } catch (e) {
                        return false;
                    }
                });

                const uniqueItemsMap = new Map();

                rawItems.forEach(item => {
                    const parsed = JSON.parse(item.imageUserId);
                    const url = parsed.imageUrl;
                    const createdAt = parsed.use || parsed.timestamp || Date.now();

                    if (!uniqueItemsMap.has(url)) {
                        uniqueItemsMap.set(url, {
                            id: `${item.user_irysId}-${item.imageId}`,
                            name: item.imageName || 'Untitled',
                            imageUrl: url,
                            createdAt,
                            collectionCount: 1,
                        });
                    } else {
                        const existing = uniqueItemsMap.get(url);
                        existing.collectionCount += 1;
                        if (createdAt > existing.createdAt) {
                            uniqueItemsMap.set(url, {
                                ...existing,
                                id: `${item.user_irysId}-${item.imageId}`,
                                createdAt,
                            });
                        }
                    }
                });

                const deduplicatedItems = Array.from(uniqueItemsMap.values()).sort(
                    (a, b) => b.createdAt - a.createdAt
                );

                setCollectionItems(deduplicatedItems);
            } catch (err) {
                console.error('Failed to fetch collection items:', err);
                setCollectionsError('Failed to load your collection.');
            } finally {
                setCollectionsLoading(false);
            }
        };

        fetchCollectionItems();
    }, [profileData?.irysId, getUserCollection]);

    useEffect(() => {
        setLoading(imagesLoading);
        setError(imagesError);
    }, [imagesLoading, imagesError]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const ITEMS_PER_PAGE = 6;

    const paginate = (items) => {
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
        const [currentPage, setCurrentPage] = useState(1);

        const goToPage = (page) => {
            if (page < 1) return setCurrentPage(1);
            if (page > totalPages) return setCurrentPage(totalPages);
            setCurrentPage(page);
        };

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        return {
            currentItems,
            currentPage,
            totalPages,
            goToPage,
        };
    };

    const creatorPagination = paginate(filteredImages);
    const collectionPagination = paginate(collectionItems);

    if (!isCreator) {
        return (
            <div className="non-creator-container">
                <div className="non-creator-card">
                    <p className="non-creator-text">You are not a creator.</p>
                    <button
                        onClick={() => window.open('/become-creator', '_blank')}
                        className="become-creator-btn"
                    >
                        Become a Creator
                    </button>
                </div>

                {collectionsLoading ? (
                    <div className="asset-card-loading" style={{ marginTop: '3rem' }}>
                        Loading collection...
                    </div>
                ) : collectionsError ? (
                    <div className="asset-card-error" style={{ marginTop: '3rem' }}>
                        {collectionsError}
                    </div>
                ) : collectionPagination.currentItems.length > 0 ? (
                    <>
                        <h3 className="collection-section-title">My Collection</h3>
                        <div className="asset-cards-container">
                            {collectionPagination.currentItems.map((item) => (
                                <CollectionAssetItem
                                    key={item.id}
                                    item={item}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                        <Pagination
                            currentPage={collectionPagination.currentPage}
                            totalPages={collectionPagination.totalPages}
                            onPageChange={collectionPagination.goToPage}
                        />
                    </>
                ) : (
                    <div className="collection-empty-state" style={{ marginTop: '3rem' }}>
                        <h3 className="collection-section-title">My Collection</h3>
                        <p className="collection-empty-text">
                            You haven’t added any assets to your collection yet.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    if (loading) {
        return <div className="asset-card-loading">Loading assets...</div>;
    }

    if (error) {
        return <div className="asset-card-error">{error}</div>;
    }

    if (collectionsLoading) {
        return <div className="asset-card-loading">Loading collection...</div>;
    }

    if (collectionsError) {
        return <div className="asset-card-error">{collectionsError}</div>;
    }

    return (
        <>
            <h3 className="asset-card-title">My Creations</h3>
            <div className="asset-cards-container">
                {creatorPagination.currentItems.length === 0 ? (
                    <div className="asset-card-empty">
                        <p>No assets found yet. Upload your first creation!</p>
                    </div>
                ) : (
                    creatorPagination.currentItems.map((asset) => (
                        <AssetCardItem
                            key={`${asset.creator_irysId}-${asset.imageName}`}
                            asset={asset}
                            formatDate={formatDate}
                        />
                    ))
                )}
            </div>
            <Pagination
                currentPage={creatorPagination.currentPage}
                totalPages={creatorPagination.totalPages}
                onPageChange={creatorPagination.goToPage}
            />

            <h3 className="collection-section-title">My Collection</h3>
            <div className="asset-cards-container">
                {collectionPagination.currentItems.length === 0 ? (
                    <div className="asset-card-empty">
                        <p>You haven’t added any assets to your collection yet.</p>
                    </div>
                ) : (
                    collectionPagination.currentItems.map((item) => (
                        <CollectionAssetItem
                            key={item.id}
                            item={item}
                            formatDate={formatDate}
                        />
                    ))
                )}
            </div>
            <Pagination
                currentPage={collectionPagination.currentPage}
                totalPages={collectionPagination.totalPages}
                onPageChange={collectionPagination.goToPage}
            />
        </>
    );
};

const AssetCardItem = ({ asset, formatDate }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8//8/AAX+Av7czFnnAAAAAElFTkSuQmCC';

    const handleClick = () => {
        navigate(`/images?id=${encodeURIComponent(asset.imageName)}`);
    };

    return (
        <div ref={cardRef} className="asset-card">
            <div className="asset-header">
                <span className="asset-creator">{asset.creator_name || 'Anonymous'}</span>
                <span className="asset-irysid">#{asset.creator_irysId}</span>
            </div>

            <div className="asset-image-container" onClick={handleClick}>
                <img
                    src={isVisible ? asset.imageData.imageUrl || '' : placeholder}
                    alt={asset.imageName || 'Untitled'}
                    className="asset-image"
                    onLoad={() => setIsLoading(false)}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/360x240?text=Image+Not+Found';
                        e.target.style.border = '1px dashed #ccc';
                    }}
                    style={{
                        opacity: isLoading ? 0.3 : 1,
                        transition: 'opacity 0.3s ease',
                    }}
                />
                <h3 className="asset-title">{asset.imageName || 'Untitled'}</h3>
            </div>

            <div className="asset-metadata">
                <span className="asset-download-count">
                    {asset.imageStar || 0} downloads
                </span>
                <span className="asset-created-at">
                    {formatDate(asset.imageData.createdAt) || 'Unknown date'}
                </span>
            </div>
        </div>
    );
};

const CollectionAssetItem = ({ item, formatDate }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleClick = () => {
        navigate(`/images?id=${encodeURIComponent(item.name)}`);
    };

    return (
        <div
            ref={cardRef}
            className="asset-card"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
        >
            <div className="asset-header">
                <span className="asset-creator">
                    {item.collectionCount > 1 ? `Collected (${item.collectionCount}x)` : 'Collected'}
                </span>
                <span className="asset-irysid">#{item.id.split('-')[0]}</span>
            </div>

            <div className="asset-image-container" onClick={handleClick}>
                <img
                    src={item.imageUrl}
                    alt={item.name || 'Collection item'}
                    className="asset-image"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/360x240?text=Image+Not+Found';
                        e.target.style.border = '1px dashed #ccc';
                    }}
                />
                <h3 className="asset-title">{item.name || 'Untitled'}</h3>
            </div>

            <div className="asset-metadata">
                <span className="asset-created-at">
                    {formatDate(item.createdAt)}
                </span>
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination-container">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
            >
                {'<'}
            </button>

            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
            >
                {'>'}
            </button>
        </div>
    );
};

export default ContentCard;