import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaSave } from 'react-icons/fa';
import { FaFileCirclePlus, FaFileCircleExclamation, FaFilePen, FaFileCircleCheck } from 'react-icons/fa6';
import { useCreatorApi } from '../../hooks/useCreatorApi';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import './SaveContent.css';

const SaveContent = ({ finalData }) => {
    const {
        deleteImage,
        deleteFont,
        deleteResult,
        uploadFile,
        loading: apiLoading,
        error: apiError,
    } = useCreatorApi();

    const { profileData } = useProfile();
    const navigate = useNavigate();

    const [imagesName, setImagesName] = useState(finalData?.imagesName || '');

    const imageUrl = finalData?.serverResponse?.resultUrl || '';
    const fontUrl = finalData?.fontUrl || '';
    const backgroundUrl = finalData?.imageData?.imageUrl || '';
    const imageBase64 = finalData?.finalImage || '';

    const handleClear = async () => {
        if (fontUrl) {
            const fontFilename = new URL(fontUrl).pathname.split('/').pop();
            await deleteFont(fontFilename);
            console.log('Font deleted from server:', fontFilename);
        }

        if (backgroundUrl) {
            const imageFilename = new URL(backgroundUrl).pathname.split('/').pop();
            await deleteImage(imageFilename);
            console.log('Background image deleted from server:', imageFilename);
        }

        if (imageUrl) {
            const resultFilename = new URL(imageUrl).pathname.split('/').pop();
            await deleteResult(resultFilename);
            console.log('Result image deleted from server:', resultFilename);
        }

        navigate('/creator');
    };

    const handleDownload = () => {
        const base64 = imageBase64;
        if (!base64) {
            alert('No image available to download.');
            return;
        }

        const mimeTypeMatch = base64.match(/^data:(image\/[a-zA-Z]+);base64,/);
        const extension = mimeTypeMatch ? mimeTypeMatch[1].split('/')[1] : 'png';

        const link = document.createElement('a');
        link.href = base64;
        link.download = `design-${new Date().getTime()}.${extension}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
    };

    const handleSave = async () => {
        const imageName = imagesName.trim();
        const creator_name = profileData.name;
        const creator_irysId = profileData.irysId;

        const imageData = {
            imageUrl,
            fontUrl,
            backgroundUrl,
            text: finalData?.text,
            canvasHeight: finalData?.canvasHeight,
            canvasWidth: finalData?.canvasWidth,
            fontName: finalData?.fontFile?.name,
            fontSize: finalData?.fontSize,
            fontColor: finalData?.fontColor,
            textPositionX: finalData?.textPosition?.x,
            textPositionY: finalData?.textPosition?.y,
            createdAt: new Date().toISOString(),
        };

        console.log('Upload result:', imageName, creator_name, creator_irysId, imageData);
        const result = await uploadFile(imageName, creator_name, creator_irysId, imageData);

        alert('Design saved successfully to the database!');
        navigate('/home');
    };

    return (
        <div className="preview-container">
            <div className="preview-card">
                <div className="preview-header">
                    <div className="preview-title-container">
                        <div className="preview-title">IrysUp Creator</div>
                    </div>
                    <div className="preview-actions">
                        <button className="preview-action-btn" onClick={handleDownload}>
                            <FaCloudUploadAlt className="preview-action-icon" />
                            Download
                        </button>
                        <button className="preview-action-btn" onClick={handleClear}>
                            <FaTimes className="preview-action-icon" />
                            Clear
                        </button>
                        <button className="preview-action-btn" onClick={handleSave}>
                            <FaSave className="preview-action-icon" />
                            Save
                        </button>
                    </div>
                </div>

                <div className="preview-content-area">
                    <div className="preview-layout">
                        <div className="preview-sidebar">
                            <div className="preview-sidebar-title">Navigation</div>

                            <div className="preview-nav-item">
                                <FaFileCirclePlus className="preview-nav-icon" />
                                <div className="preview-nav-label">Upload Images</div>
                            </div>

                            <div className="preview-nav-item">
                                <FaFileCircleExclamation className="preview-nav-icon" />
                                <div className="preview-nav-label">Preview Images</div>
                            </div>

                            <div className="preview-nav-item">
                                <FaFileCircleCheck className="preview-nav-icon" />
                                <div className="preview-nav-label">Edit Text</div>
                            </div>

                            <div className="preview-nav-item preview-nav-active">
                                <FaFilePen className="preview-nav-icon" />
                                <div className="preview-nav-label">Save Content</div>
                            </div>
                        </div>

                        <div className="preview-main-content">
                            <div className="preview-preview-container">
                                <div className="preview-preview-area">
                                    <div className="preview-canvas-container">
                                        {imageUrl || imageBase64 ? (
                                            <img
                                                src={imageUrl || imageBase64}
                                                alt="Preview Design"
                                                className="preview-canvas"
                                            />
                                        ) : (
                                            <div className="preview-empty-state">
                                                No image available.
                                            </div>
                                        )}
                                    </div>

                                    <div className="preview-info-panel">
                                        <label className="preview-info-label">
                                            Design Name
                                        </label>
                                        <input
                                            type="text"
                                            value={imagesName}
                                            onChange={(e) => setImagesName(e.target.value)}
                                            placeholder="Enter a name for your design..."
                                            className="preview-info-input"
                                        />

                                        <p className="preview-info-help">
                                            Enter a name for your design, then click "Save" to store it.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaveContent;