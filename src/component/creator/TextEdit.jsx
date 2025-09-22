import React, { useState, useRef, useEffect } from 'react';
import { FaUndo, FaFont, FaTextHeight, FaPalette, FaUpload, FaCrosshairs } from 'react-icons/fa';
import { FaCloudUploadAlt, FaTimes, FaSave } from 'react-icons/fa';
import { FaFileCirclePlus, FaFileCircleExclamation, FaFilePen, FaFileCircleCheck } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useCreatorApi } from '../../hooks/useCreatorApi';
import { useProfile } from '../../context/ProfileContext';
import './TextEdit.css';

const TextEdit = ({ initialTextData, imageData, onTextDataChange, onSave }) => {
    const {
        uploadFont,
        deleteImage,
        deleteFont,
        uploadResultImage,
        loading: apiLoading,
        error: apiError,
    } = useCreatorApi();

    const { profileData } = useProfile();

    const [text, setText] = useState(initialTextData?.text || 'Write your text here');
    const [fontSize, setFontSize] = useState(initialTextData?.fontSize || 48);
    const [fontColor, setFontColor] = useState(initialTextData?.fontColor || '#ffffff');
    const [textPosition, setTextPosition] = useState(initialTextData?.textPosition || null);
    const [customFont, setCustomFont] = useState(initialTextData?.customFont || null);
    const [fontFile, setFontFile] = useState(null);
    const [fontUrl, setFontUrl] = useState(initialTextData?.fontUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [uploadStatus, setUploadStatus] = useState('');
    const navigate = useNavigate();

    const canvasRef = useRef(null);
    const imageRef = useRef(new Image());

    const canvasWidth = imageData?.fileInfo?.width;
    const canvasHeight = imageData?.fileInfo?.height;
    const backgroundImageUrl = imageData?.imageUrl || '';

    const handleClear = async () => {
        try {
            if (fontUrl) {
                const fontFilename = new URL(fontUrl).pathname.split('/').pop();
                await deleteFont(fontFilename);
                console.log('Font deleted from server:', fontFilename);
            }

            if (imageData?.imageUrl) {
                const imageFilename = new URL(imageData.imageUrl).pathname.split('/').pop();
                await deleteImage(imageFilename);
                console.log('Image deleted from server:', imageFilename);
            }

            setText('Write your text here');
            setFontSize(48);
            setFontColor('#ffffff');
            setTextPosition(null);
            setCustomFont(null);
            setFontFile(null);
            setFontUrl(null);
            setDragOffset({ x: 0, y: 0 });

            navigate('/creator');
        } catch (error) {
            console.error('Error during clear:', error);
            alert('Failed to delete files from server, but local data has been cleared.');
        }
    };

    useEffect(() => {
        if (onTextDataChange) {
            const textData = {
                text,
                fontSize,
                fontColor,
                textPosition,
                customFont,
                fontFile,
                fontUrl,
                canvasWidth,
                canvasHeight,
                backgroundImageUrl,
                timestamp: new Date().toISOString(),
            };
            onTextDataChange(textData);
        }
    }, [text, fontSize, fontColor, textPosition, customFont, fontFile, fontUrl]);

    useEffect(() => {
        if (backgroundImageUrl) {
            imageRef.current.crossOrigin = 'Anonymous';
            imageRef.current.src = backgroundImageUrl;
            imageRef.current.onload = drawCanvas;
        }
    }, [backgroundImageUrl]);

    useEffect(() => {
        drawCanvas();
    }, [text, fontSize, fontColor, textPosition, customFont]);

    useEffect(() => {
        if (canvasWidth && canvasHeight && !textPosition) {
            resetTextPosition();
        }
    }, [canvasWidth, canvasHeight]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (imageRef.current.complete && imageRef.current.naturalWidth !== 0) {
            ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
        }

        ctx.font = `${fontSize}px ${customFont || 'Arial'}`;
        ctx.fillStyle = fontColor;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        const posX = textPosition?.x || canvasWidth * 0.1;
        const posY = textPosition?.y || canvasHeight * 0.5;

        ctx.fillText(text, posX, posY);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);

        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        if (textPosition) {
            const offsetX = x - textPosition.x;
            const offsetY = y - textPosition.y;
            setDragOffset({ x: offsetX, y: offsetY });
        } else {
            setDragOffset({ x: 0, y: 0 });
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !textPosition) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const newX = x - dragOffset.x;
        const newY = y - dragOffset.y;

        const ctx = canvasRef.current.getContext('2d');
        ctx.font = `${fontSize}px ${customFont || 'Arial'}`;
        const textWidth = ctx.measureText(text).width;

        const minX = 0;
        const maxX = canvasWidth - textWidth;
        const minY = 0;
        const maxY = canvasHeight - fontSize;

        setTextPosition({
            x: Math.max(minX, Math.min(newX, maxX)),
            y: Math.max(minY, Math.min(newY, maxY))
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
    };

    const handleFontUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        event.target.value = '';

        const allowedTypes = ['.ttf', '.otf', '.woff', '.woff2'];
        const extension = '.' + file.name.toLowerCase().split('.').pop();
        if (!allowedTypes.includes(extension)) {
            alert(`Unsupported file type. Use: ${allowedTypes.join(', ')}`);
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File too large. Maximum 10MB');
            return;
        }

        try {
            setUploadStatus('Uploading font...');
            setFontFile(file);

            const result = await uploadFont(file);

            if (!result.success || !result.data?.fontUrl) {
                throw new Error('Invalid server response');
            }

            const uploadedFontUrl = result.data.fontUrl;
            const fontName = `CustomFont-${Date.now()}`;

            const fontFace = new FontFace(fontName, `url(${uploadedFontUrl})`);
            document.fonts.add(fontFace);

            await fontFace.load();
            await document.fonts.ready;

            setCustomFont(fontName);
            setFontUrl(uploadedFontUrl);
            setUploadStatus('Font uploaded and loaded successfully!');

            setTimeout(() => {
                drawCanvas();
            }, 500);

        } catch (error) {
            console.error('Error uploading font:', error);
            setUploadStatus(`Upload failed: ${error.message}`);
            alert(`Failed to process font: ${error.message}`);

            setFontFile(null);
            setCustomFont(null);
            setFontUrl(null);
        }
    };

    const resetTextPosition = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.font = `${fontSize}px ${customFont || 'Arial'}`;
        const textWidth = ctx.measureText(text).width;

        setTextPosition({
            x: Math.max(0, (canvasWidth - textWidth) / 2),
            y: Math.max(0, (canvasHeight - fontSize) / 2)
        });
    };

    const handleSave = async () => {
        try {
            const canvas = canvasRef.current;
            if (!canvas) {
                throw new Error('Canvas not found');
            }

            const finalImage = canvas.toDataURL('image/png');
            if (!finalImage || !finalImage.startsWith('data:image/')) {
                throw new Error('Failed to generate final image');
            }

            const designId = profileData.name + '-' + profileData.irysId + '-' + Date.now();

            const result = await uploadResultImage(designId, finalImage);

            if (!result.success) {
                throw new Error(result.error || 'Invalid response from server');
            }

            console.log('Design saved successfully:', result);

            setUploadStatus('Design saved successfully!');

            if (onSave) {
                const finalData = {
                    text,
                    fontSize,
                    fontColor,
                    textPosition,
                    customFont,
                    fontFile,
                    fontUrl,
                    canvasWidth,
                    canvasHeight,
                    imageData,
                    finalImage,
                    savedAt: new Date().toISOString(),
                    serverResponse: result,
                };
                onSave(finalData);
            }

            navigate('/creator/save');
            alert('Design saved successfully!');
        } catch (error) {
            console.error('Error saving design:', error);
            setUploadStatus(`Save failed: ${error.message}`);
            alert(`Failed to save design: ${error.message}`);
        }
    };

    return (
        <div className="text-edit-container">
            <div className="text-edit-card">
                <div className="text-edit-header">
                    <div className="text-edit-title-container">
                        <div className="text-edit-title">IrysUp Creator</div>
                    </div>
                    <div className="text-edit-actions">
                        <button className="text-edit-action-btn">
                            <FaCloudUploadAlt className="text-edit-action-icon" />
                            Select Image
                        </button>
                        <button className="text-edit-action-btn" onClick={handleClear}>
                            <FaTimes className="text-edit-action-icon" />
                            Clear
                        </button>
                        <button className="text-edit-action-btn" onClick={handleSave}>
                            <FaSave className="text-edit-action-icon" />
                            Save
                        </button>
                    </div>
                </div>

                <div className="text-edit-content-area">
                    <div className="text-edit-layout">
                        <div className="text-edit-sidebar">
                            <div className="text-edit-sidebar-title">Navigation</div>

                            <div className="text-edit-nav-item">
                                <FaFileCirclePlus className="text-edit-nav-icon" />
                                <div className="text-edit-nav-label">Upload Images</div>
                            </div>

                            <div className="text-edit-nav-item">
                                <FaFileCircleExclamation className="text-edit-nav-icon" />
                                <div className="text-edit-nav-label">Preview Images</div>
                            </div>

                            <div className="text-edit-nav-item text-edit-nav-active">
                                <FaFilePen className="text-edit-nav-icon" />
                                <div className="text-edit-nav-label">Edit Text Images</div>
                            </div>

                            <div className="text-edit-nav-item">
                                <FaFileCircleCheck className="text-edit-nav-icon" />
                                <div className="text-edit-nav-label">Save Content</div>
                            </div>
                        </div>

                        <div className="text-edit-main-content">
                            <div className="text-edit-preview-container">
                                <div className="text-edit-preview-area">
                                    <div className="text-edit-canvas-container">
                                        <canvas
                                            ref={canvasRef}
                                            width={canvasWidth}
                                            height={canvasHeight}
                                            onMouseMove={handleMouseMove}
                                            onMouseUp={handleMouseUp}
                                            onMouseDown={handleMouseDown}
                                            className="text-edit-canvas"
                                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                                        />
                                    </div>

                                    <div className="text-edit-controls-panel">
                                        <div className="text-edit-control-group">
                                            <label className="text-edit-control-label">
                                                <FaFont /> Text
                                            </label>
                                            <input
                                                type="text"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                placeholder="Enter text"
                                                className="text-edit-text-input"
                                            />
                                        </div>

                                        <div className="text-edit-control-group">
                                            <label className="text-edit-control-label">
                                                <FaTextHeight /> Font Size: {fontSize}px
                                            </label>
                                            <input
                                                type="range"
                                                value={fontSize}
                                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                min="12"
                                                max="1000"
                                                className="text-edit-range-input"
                                            />
                                        </div>

                                        <div className="text-edit-control-group">
                                            <label className="text-edit-control-label">
                                                <FaPalette /> Font Color
                                            </label>
                                            <div className="text-edit-color-input-container">
                                                <input
                                                    type="color"
                                                    value={fontColor}
                                                    onChange={(e) => setFontColor(e.target.value)}
                                                    className="text-edit-color-input"
                                                />
                                                <span className="text-edit-color-value">{fontColor}</span>
                                            </div>
                                        </div>

                                        <div className="text-edit-control-group">
                                            <label className="text-edit-control-label">
                                                <FaUpload /> Custom Font
                                            </label>
                                            <div className="text-edit-file-input-container">
                                                <input
                                                    type="file"
                                                    accept=".ttf,.otf,.woff,.woff2"
                                                    onChange={handleFontUpload}
                                                    id="text-edit-font-upload"
                                                    className="text-edit-file-input"
                                                />
                                                <label htmlFor="text-edit-font-upload" className="text-edit-file-input-label">
                                                    Choose Font File
                                                </label>
                                                {customFont && (
                                                    <div className="text-edit-font-info">
                                                        <span className="text-edit-font-name">{customFont}</span>
                                                        {fontFile && (
                                                            <span className="text-edit-file-size">
                                                                ({(fontFile.size / 1024).toFixed(1)} KB)
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-edit-control-group">
                                            <label className="text-edit-control-label">
                                                <FaCrosshairs /> Text Position
                                            </label>
                                            <div className="text-edit-position-info">
                                                <span>X: {textPosition?.x || 0}px, Y: {textPosition?.y || 0}px</span>
                                                <button onClick={resetTextPosition} className="text-edit-btn text-edit-btn-secondary text-edit-btn-small">
                                                    <FaUndo /> Reset
                                                </button>
                                            </div>
                                        </div>
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

export default TextEdit;