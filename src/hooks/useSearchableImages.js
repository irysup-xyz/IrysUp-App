import { useState, useEffect } from 'react';
import { useCreatorApi } from './useCreatorApi';

const SEARCH_KEY = 'searchableImages';
const CACHE_DURATION = 30 * 60 * 1000;

export const useSearchableImages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { searchImages } = useCreatorApi();

    const loadFromSession = () => {
        const cached = sessionStorage.getItem(SEARCH_KEY);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                const now = Date.now();
                if (now - parsed.timestamp < CACHE_DURATION) {
                    setImages(parsed.images || []);
                    setLoading(false);
                    return parsed;
                } else {
                    sessionStorage.removeItem(SEARCH_KEY);
                }
            } catch (error) {
                console.error('Failed to parse cached images:', error);
                sessionStorage.removeItem(SEARCH_KEY);
            }
        }
        return null;
    };

    const fetchAndCache = async () => {
        try {
            setLoading(true);
            const response = await searchImages({});

            if (response.success && response.data) {
                const imageArray = Object.values(response.data).filter(
                    (item) => item.imageName || item.creator_name || item.creator_irysId
                );
                setImages(imageArray);
                sessionStorage.setItem(
                    SEARCH_KEY,
                    JSON.stringify({
                        images: imageArray,
                        timestamp: Date.now(),
                    })
                );
            } else {
                throw new Error('Failed to fetch images');
            }
        } catch (err) {
            setError(err.message);
            window.location.href = ('/maintenance');
            console.error('Error fetching images:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cached = loadFromSession();
        if (!cached) {
            fetchAndCache();
        }

        const intervalId = setInterval(() => {
            const cached = sessionStorage.getItem(SEARCH_KEY);
            if (cached) {
                try {
                    const { timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp >= CACHE_DURATION) {
                        fetchAndCache();
                    }
                } catch (e) {
                    console.error('Error checking cache timestamp:', e);
                    fetchAndCache();
                }
            } else {
                fetchAndCache();
            }
        }, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [searchImages]);

    const search = (query) => {
        if (!query.trim()) return images;

        const lowerQuery = query.toLowerCase().trim();
        return images.filter(
            (image) =>
                image.imageName?.toLowerCase().includes(lowerQuery) ||
                image.creator_name?.toLowerCase().includes(lowerQuery) ||
                image.creator_irysId?.toLowerCase().includes(lowerQuery)
        );
    };

    return {
        images,
        loading,
        error,
        search,
    };
};