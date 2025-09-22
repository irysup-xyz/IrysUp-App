import { useState, useCallback } from 'react';
import axios from 'axios';

const baseApiUrl = 'https://api.irysup.xyz';

const apiClient = axios.create({
    baseURL: baseApiUrl,
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const useCreatorApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetState = useCallback(() => {
        setError(null);
        setLoading(false);
    }, []);

    const uploadImage = useCallback(async (imageFile, fileInfo) => {
        resetState();
        setLoading(true);

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('metadata', JSON.stringify(fileInfo));

        try {
            const response = await apiClient.post('/creator/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to upload image');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const uploadFont = useCallback(async (fontFile, creatorName, creatorIryId) => {
        resetState();
        setLoading(true);

        const formData = new FormData();
        formData.append('font', fontFile);
        formData.append('creator_name', creatorName);
        formData.append('creator_irysId', creatorIryId);

        try {
            const response = await apiClient.post('/creator/fonts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to upload font');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const getAllImages = useCallback(async () => {
        resetState();
        setLoading(true);

        try {
            const response = await apiClient.get('/creator/all/images');
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch image list');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const getAllFonts = useCallback(async () => {
        resetState();
        setLoading(true);

        try {
            const response = await apiClient.get('/creator/all/fonts');
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch font list');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const searchImages = useCallback(async (filters) => {
        resetState();
        setLoading(true);

        try {
            const response = await apiClient.post('/creator/search', filters);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to search images');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const deleteImage = useCallback(async (filename) => {
        resetState();
        setLoading(true);

        try {
            const response = await apiClient.delete(`/creator/images/${filename}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to delete image');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const deleteResult = useCallback(async (filename) => {
        resetState();
        setLoading(true);

        try {
            const response = await apiClient.delete(`/creator/result/${filename}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to delete result image');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const deleteFont = useCallback(async (filename) => {
        resetState();
        setLoading(true);

        try {
            const response = await apiClient.delete(`/creator/fonts/${filename}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to delete font');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const uploadResultImage = useCallback(async (designId, finalImage) => {
        resetState();
        setLoading(true);

        const designData = {
            designId,
            finalImage,
        };

        try {
            const response = await apiClient.post('/creator/result', designData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to upload result image');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const useImage = useCallback(async (user_irysId, imageId, imageUserId, imageName) => {
        resetState();
        setLoading(true);

        try {
            const response = await apiClient.post('/creator/use/images', {
                user_irysId,
                imageId,
                imageUserId,
                imageName,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to use image');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const uploadFile = useCallback(async (imageName, creator_name, creator_irysId, imageData) => {
        resetState();
        setLoading(true);

        const payload = {
            imageName: imageName.trim(),
            creator_name,
            creator_irysId,
            imageData,
        };

        try {
            const response = await apiClient.post('/creator/upload', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to upload file');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    const deleteImageFromUserCollection = useCallback(async (imageName) => {
        resetState();
        setLoading(true);

        try {
            const response = await apiClient.delete(`/creator/delete/${imageName}`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to delete image from collection');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [resetState]);

    return {
        loading,
        error,
        uploadImage,
        uploadFont,
        getAllImages,
        getAllFonts,
        searchImages,
        deleteImage,
        deleteFont,
        deleteResult,
        uploadResultImage,
        useImage,
        uploadFile,
        deleteImageFromUserCollection,
        resetState,
    };
};