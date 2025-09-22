import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSearchableUsers } from '../../hooks/useSearchableUsers';
import { useSearchableImages } from '../../hooks/useSearchableImages';
import useUserApi from '../../hooks/useUserApi';
import styles from './PublicContentCard.module.css';

const PublicContentCard = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const irysId = (searchParams.get('irysId') || '').trim();

    const { users, loading: usersLoading, error: usersError } = useSearchableUsers();
    const { images, loading: imagesLoading, error: imagesError } = useSearchableImages();

    const { getUserCollection } = useUserApi();

    const [collectionItems, setCollectionItems] = useState([]);
    const [collectionsLoading, setCollectionsLoading] = useState(true);
    const [collectionsError, setCollectionsError] = useState(null);

    const targetUser = useMemo(() => {
        if (!Array.isArray(users) || !irysId) return null;
        return users.find(u => u.irysId?.trim() === irysId);
    }, [users, irysId]);

    const isCreator = useMemo(() => {
        if (!targetUser) return false;
        return ['creator', 'irysUp'].includes(targetUser.role);
    }, [targetUser]);

    const filteredImages = useMemo(() => {
        if (!isCreator || !targetUser?.name) return [];

        const creatorName = targetUser.name.toLowerCase();
        return images.filter(
            asset =>
                asset.creator_name?.toLowerCase() === creatorName ||
                asset.creator_irysId?.toLowerCase() === creatorName
        );
    }, [images, isCreator, targetUser?.name]);

    useEffect(() => {
        if (!irysId) {
            setCollectionsLoading(false);
            return;
        }

        const fetchCollectionItems = async () => {
            try {
                setCollectionsLoading(true);
                setCollectionsError(null);
                const data = await getUserCollection(irysId);

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
                setCollectionsError('Failed to load collection.');
            } finally {
                setCollectionsLoading(false);
            }
        };

        fetchCollectionItems();
    }, [irysId, getUserCollection]);

    const ITEMS_PER_PAGE = 6;

    const usePagination = (items) => {
        const [currentPage, setCurrentPage] = useState(1);
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

        const goToPage = useCallback((page) => {
            if (page < 1) return setCurrentPage(1);
            if (page > totalPages) return setCurrentPage(totalPages);
            setCurrentPage(page);
        }, [totalPages]);

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const currentItems = useMemo(() => {
            return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
        }, [items, startIndex]);

        return {
            currentItems,
            currentPage,
            totalPages,
            goToPage,
        };
    };

    const creatorPagination = usePagination(filteredImages);
    const collectionPagination = usePagination(collectionItems);

    if (usersLoading || imagesLoading) {
        return <div className={styles.loading}>Loading profile content...</div>;
    }

    if (usersError || imagesError) {
        return <div className={styles.error}>Error loading data: {usersError || imagesError}</div>;
    }

    if (!targetUser) {
        return (
            <div className={styles.notFound}>
                User with Irys ID "{irysId}" not found.
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (!isCreator) {
        return (
            <div className={styles.container}>
                <div className={styles.nonCreatorBanner}>
                    <p><strong>{targetUser.name}</strong> is not a creator.</p>
                </div>

                {collectionsLoading ? (
                    <div className={styles.collectionLoading}>
                        <div className={styles.loading}>Loading collection...</div>
                    </div>
                ) : collectionsError ? (
                    <div className={styles.collectionLoading}>
                        <div className={styles.error}>{collectionsError}</div>
                    </div>
                ) : collectionPagination.currentItems.length > 0 ? (
                    <>
                        <h3 className={styles.sectionTitle}>Collection</h3>
                        <div className={styles.cardsGrid}>
                            {collectionPagination.currentItems.map((item) => (
                                <CollectionAssetItem key={item.id} item={item} formatDate={formatDate} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={collectionPagination.currentPage}
                            totalPages={collectionPagination.totalPages}
                            onPageChange={collectionPagination.goToPage}
                        />
                    </>
                ) : (
                    <div className={styles.collectionLoading}>
                        <h3 className={styles.sectionTitle}>Collection</h3>
                        <p className={styles.emptyState}>This user hasn’t added any assets to their collection yet.</p>
                    </div>
                )}
            </div>
        );
    }

    if (collectionsLoading) {
        return <div className={styles.loading}>Loading collection...</div>;
    }

    if (collectionsError) {
        return <div className={styles.error}>{collectionsError}</div>;
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Creations by {targetUser.name}</h3>
            <div className={styles.cardsGrid}>
                {creatorPagination.currentItems.length === 0 ? (
                    <div className={styles.emptyStateFull}>
                        <p>No creations found yet.</p>
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

            <h3 className={styles.sectionTitle}>Collection</h3>
            <div className={styles.cardsGrid}>
                {collectionPagination.currentItems.length === 0 ? (
                    <div className={styles.emptyStateFull}>
                        <p>This user hasn’t added any assets to their collection yet.</p>
                    </div>
                ) : (
                    collectionPagination.currentItems.map((item) => (
                        <CollectionAssetItem key={item.id} item={item} formatDate={formatDate} />
                    ))
                )}
            </div>
            <Pagination
                currentPage={collectionPagination.currentPage}
                totalPages={collectionPagination.totalPages}
                onPageChange={collectionPagination.goToPage}
            />
        </div>
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
        <div
            ref={cardRef}
            className={styles.assetCard}
        >
            <div className={styles.assetHeader}>
                <span className={styles.assetCreator}>
                    {asset.creator_name || 'Anonymous'}
                </span>
                <span className={styles.assetIrysId}>#{asset.creator_irysId}</span>
            </div>

            <div className={styles.assetImageContainer} onClick={handleClick}>
                <img
                    src={isVisible ? asset.imageData?.imageUrl || '' : placeholder}
                    alt={asset.imageName || 'Untitled'}
                    className={`${styles.assetImage} ${isLoading ? styles.assetImageLoading : ''}`}
                    onLoad={() => setIsLoading(false)}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/360x240?text=Image+Not+Found';
                        e.target.style.border = '1px dashed #ccc';
                    }}
                />
                <h3 className={styles.assetTitle}>
                    {asset.imageName || 'Untitled'}
                </h3>
            </div>

            <div className={styles.assetMetadata}>
                <span>{asset.imageStar || 0} downloads</span>
                <span>{formatDate(asset.imageData?.createdAt) || 'Unknown date'}</span>
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
            className={`${styles.collectionCard} ${isVisible ? styles.visible : ''}`}
        >
            <div className={styles.collectionHeader}>
                <span className={styles.collectionCount}>
                    {item.collectionCount > 1 ? `Collected (${item.collectionCount}x)` : 'Collected'}
                </span>
                <span className={styles.collectionIrysId}>#{item.id.split('-')[0]}</span>
            </div>

            <div className={styles.collectionImageContainer} onClick={handleClick}>
                <img
                    src={item.imageUrl}
                    alt={item.name || 'Collection item'}
                    className={styles.collectionImage}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/360x240?text=Image+Not+Found';
                        e.target.style.border = '1px dashed #ccc';
                    }}
                />
                <h3 className={styles.collectionTitle}>
                    {item.name || 'Untitled'}
                </h3>
            </div>

            <div className={styles.collectionMetadata}>
                <span>{formatDate(item.createdAt)}</span>
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
        <div className={styles.pagination}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationBtn}
            >
                {'<'}
            </button>

            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ''}`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationBtn}
            >
                {'>'}
            </button>
        </div>
    );
};

export default PublicContentCard;