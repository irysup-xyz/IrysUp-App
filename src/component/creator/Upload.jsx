import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatorApi } from '../../hooks/useCreatorApi';
import { FaRegFileImage, FaImage, FaCloudUploadAlt, FaTimes, FaSave } from 'react-icons/fa';
import { FaFileCirclePlus, FaFileCircleExclamation, FaFilePen, FaFileCircleCheck } from 'react-icons/fa6';
import { useProfile } from '../../context/ProfileContext';
import './Upload.css';

const Upload = ({ onImageUpload, onClear }) => {
    const {
        uploadImage,
        deleteImage,
        loading: apiLoading,
        error: apiError,
    } = useCreatorApi();

    const { profileData, loading: profileLoading } = useProfile();
    const [serverImageUrl, setServerImageUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState('');
    const [fileInfo, setFileInfo] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    if (profileLoading || !profileData.name || !profileData.irysId) {
        return <div>Loading profile...</div>;
    }

    const handleFileSelect = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage('Please select an image file');
            return;
        }

        setSelectedFile(file);
        setMessage('');

        const localPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(localPreviewUrl);

        const img = new Image();
        img.onload = () => {
            const fileInfoData = {
                name: file.name,
                size: file.size,
                type: file.type,
                width: img.width,
                height: img.height,
            };

            setFileInfo(fileInfoData);
            uploadFileToServer(file, fileInfoData, localPreviewUrl);
        };
        img.src = localPreviewUrl;
    };

    const uploadFileToServer = async (file, fileInfo, localPreviewUrl) => {
        setIsUploading(true);
        try {
            const result = await uploadImage(file, fileInfo);

            if (result && result.imageUrl && result.filename) {
                setServerImageUrl(result.imageUrl);
                setFileName(result.filename);
                setPreviewUrl(result.imageUrl);
                URL.revokeObjectURL(localPreviewUrl);

                if (onImageUpload) {
                    onImageUpload({
                        file,
                        imageUrl: result.imageUrl,
                        fileInfo,
                    });
                }

                setMessage('Upload successful!');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            setMessage('Upload failed: ' + (err.message || 'Unknown error'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const clearSelection = async () => {
        try {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            if (fileName && serverImageUrl) {
                const response = await deleteImage(fileName);
                console.log('Deleted from server:', response);
            }

            setPreviewUrl(null);
            setSelectedFile(null);
            setFileInfo(null);
            setServerImageUrl(null);
            setFileName(null);
            setMessage('');

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            if (onClear) {
                onClear();
            }
        } catch (error) {
            console.error('Error clearing selection:', error);
            setMessage('Failed to delete from server, but cleared locally.');
        }
    };

    const handleSave = async () => {
        navigate('/creator/text');
    };

    return (
        <div className="uc-container">
            <div className="uc-card">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                    accept="image/*"
                    className="uc-file-input"
                />

                <div className="uc-controls-container">
                    <div className="uc-controls-title">
                        <div className="uc-title">IrysUp Creator</div>
                    </div>
                    <div className="uc-controls-buttons">
                        <button
                            className="uc-control-btn"
                            onClick={handleButtonClick}
                        >
                            <FaCloudUploadAlt className="uc-control-btn-icon" />
                            Select Image
                        </button>
                        <button
                            className={`uc-control-btn ${!previewUrl ? 'uc-control-btn-disabled' : ''}`}
                            onClick={previewUrl ? clearSelection : undefined}
                            disabled={!previewUrl}
                        >
                            <FaTimes className="uc-control-btn-icon" />
                            Clear
                        </button>
                        <button className="uc-control-btn" onClick={handleSave}>
                            <FaSave className="uc-control-btn-icon" />
                            Save
                        </button>
                    </div>
                </div>

                <div className="uc-content-area">
                    <div className="uc-content-wrapper">
                        <div className="uc-sidebar">
                            <div className="uc-sidebar-title">Navigation</div>

                            <div
                                className="uc-sidebar-item"
                                style={{
                                    backgroundColor: !previewUrl ? '#ddd' : '#fff',
                                }}
                            >
                                <FaFileCirclePlus className="uc-sidebar-icon" />
                                <div className="uc-sidebar-text">Upload Images</div>
                            </div>

                            <div
                                className="uc-sidebar-item"
                                style={{
                                    backgroundColor: previewUrl ? '#ddd' : '#fff',
                                }}
                            >
                                <FaFileCircleExclamation className="uc-sidebar-icon" />
                                <div className="uc-sidebar-text">Preview Images</div>
                            </div>

                            <div className="uc-sidebar-item">
                                <FaFilePen className="uc-sidebar-icon" />
                                <div className="uc-sidebar-text">Edit text Images</div>
                            </div>

                            <div className="uc-sidebar-item">
                                <FaFileCircleCheck className="uc-sidebar-icon" />
                                <div className="uc-sidebar-text">Save content</div>
                            </div>
                        </div>

                        {!previewUrl ? (
                            <div className="uc-main-content">
                                <div
                                    className="uc-upload-zone"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleButtonClick}
                                >
                                    <FaRegFileImage className="uc-upload-icon" />
                                    <span className="uc-upload-text">Drop your image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="uc-main-content">
                                <div className="uc-preview-container">
                                    <div className="uc-preview-content">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="uc-preview-image"
                                        />

                                        <div className="uc-preview-info">
                                            <div className="uc-info-item">
                                                {fileInfo && `Dimensions: ${fileInfo.width} x ${fileInfo.height}`}
                                            </div>
                                            <div className="uc-info-item">
                                                {fileInfo && `Size: ${Math.round(fileInfo.size / 1024)} KB`}
                                            </div>
                                            <div className="uc-info-item">
                                                {fileInfo && `Name: ${fileInfo.name}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;