import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchableImages } from '../../hooks/useSearchableImages';
import './Content.css';

const Content = () => {
    const { images, loading, error, search } = useSearchableImages();
    const sortedImages = [...images].sort((a, b) => (b.imageStar || 0) - (a.imageStar || 0));
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(sortedImages.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentGalleryItems = sortedImages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = useCallback((page) => {
        if (page < 1) return setCurrentPage(1);
        if (page > totalPages) return setCurrentPage(totalPages);
        setCurrentPage(page);
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [sortedImages.length]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sortedImages.length);
        }, 3000);

        goToPage(1);

        return () => clearInterval(interval);
    }, [sortedImages.length, goToPage]);

    const formatUsers = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return num.toString();
    };

    if (loading) {
        return (
            <div className="slider-and-gallery">
                <div className="main-image-container">
                    <div className="main-image-placeholder">Loading...</div>
                </div>

                <div className="gallery-container" >
                    <h3>Gallery</h3>
                    <div className="gallery-list">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="gallery-item loading">
                                <div className="gallery-thumbnail placeholder"></div>
                                <div className="text-content">
                                    <h4 className="title placeholder"></h4>
                                    <p className="creator placeholder"></p>
                                    <p className="users placeholder"></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="slider-and-gallery">
                <div className="main-image-container">
                    <div className="main-image-placeholder">Error: {error}</div>
                </div>
                <div className="gallery-container">
                    <h3>Gallery</h3>
                    <div className="gallery-list">
                        <p style={{ color: 'red' }}>Failed to load images. Please try again later.</p>
                    </div>
                </div>
            </div>
        );
    };

    if (sortedImages.length === 0) {
        return (
            <div className="slider-and-gallery">
                <div className="main-image-container">
                    <div className="main-image-placeholder">No images available.</div>
                </div>
                <div className="gallery-container">
                    <h3>Gallery</h3>
                    <div className="gallery-list">
                        <p>No images found. Perhaps no creations have been uploaded by other users yet.</p>
                    </div>
                </div>
            </div>
        );
    };

    const currentImage = sortedImages[currentImageIndex];

    const handleClick = () => {
        navigate(`/images?id=${encodeURIComponent(currentImage.imageName)}`);
    };

    const handleClickGalleryItem = (image) => {
        navigate(`/images?id=${encodeURIComponent(image.imageName)}`);
    };

    return (
        <div className="slider-and-gallery">
            <div className="main-image-container" onClick={handleClick}>
                <img
                    src={currentImage.imageData.backgroundUrl}
                    alt={currentImage.imageName}
                    className="main-image"
                    onError={(e) => {
                        e.target.src = 'https://source.unsplash.com/random/800x600?nature';
                    }}
                />
                <div className="image-caption">
                    <h3>{currentImage.imageName || 'Untitled'}</h3>
                    <p>By {currentImage.creator_name || 'Unknown'}</p>
                </div>
            </div>

            <div className="gallery-container" >
                <h3>Gallery</h3>
                <div className="gallery-list">
                    {currentGalleryItems.map((image) => (
                        <div
                            key={image.imageId}
                            className={`gallery-item ${currentImageIndex === sortedImages.indexOf(image) ? 'active' : ''}`}
                            onClick={() => handleClickGalleryItem(image)}
                        >
                            <img
                                src={image.imageData.backgroundUrl}
                                alt={image.imageName}
                                className="gallery-thumbnail"
                                onError={(e) => {
                                    e.target.src = 'https://source.unsplash.com/random/400x300?nature';
                                }}
                            />
                            <div className="text-content">
                                <h4 className="title">{image.imageName || 'Untitled'}</h4>
                                <p className="creator">by {image.creator_name || 'Unknown'}</p>
                                <p className="users">{formatUsers(image.imageStar || 0)} stars</p>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <>
                        <div className="pagination-container">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                {'<'}
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                {'>'}
                            </button>
                        </div>
                        <p style={{ textAlign: 'center', color: 'var(--irysup-color-text-muted)', marginTop: '0.5rem' }}>
                            Page {currentPage} of {totalPages}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Content;