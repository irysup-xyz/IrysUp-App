import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUndo, FaFont, FaTextHeight, FaPalette, FaCrosshairs, FaCloudUploadAlt, FaTimes, FaSave, FaDownload } from 'react-icons/fa';
import { useSearchableImages } from '../../hooks/useSearchableImages';
import { useLocation } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext.jsx';
import { useAuth } from '../../context/AuthContext';
import { useCreatorApi } from '../../hooks/useCreatorApi.js';
import { useApiConfig } from '../../context/ApiConfigContext.jsx';
import './PublicImagesCard.css';

const PublicImagesCard = () => {
    const [isDisabled] = useState(true);
    const { profileData } = useProfile();
    const { isLogin, loading, logout } = useAuth();
    const { useImage } = useCreatorApi();
    const { images, loading: imagesLoading, error: imagesError } = useSearchableImages();
    const location = useLocation();

    const [disabled, setDisabled] = useState(true)
    const [selectedImage, setSelectedImage] = useState(null);
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(48);
    const [fontColor, setFontColor] = useState('#000000');
    const [textPosition, setTextPosition] = useState(null);
    const [customFont, setCustomFont] = useState(null);
    const [fontUrl, setFontUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [fontLoaded, setFontLoaded] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);

    const canvasRef = useRef(null);
    const imageRef = useRef(new Image());
    const navigate = useNavigate();
    const { baseApiUrl } = useApiConfig();

    useEffect(() => {
        if (isLogin) {
            setDisabled(!disabled)
        }
    }, [])

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const imageName = searchParams.get('id');

        if (!imageName) return;

        const found = images.find(img => img.imageName === imageName);

        if (found) {
            setSelectedImage(found);

            setText(found.imageData?.text || 'Write your text here');
            setFontSize(found.imageData?.fontSize || 48);
            setFontColor(found.imageData?.fontColor || '#000000');
            setTextPosition({
                x: found.imageData?.textPositionX || null,
                y: found.imageData?.textPositionY || null,
            });
            setCustomFont(found.imageData?.fontName || null);
            setFontUrl(found.imageData?.fontUrl || null);

            const bgUrl = found.imageData?.backgroundUrl;
            if (bgUrl) {
                setImageLoaded(false);
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = bgUrl;
                img.onload = () => {
                    imageRef.current = img;
                    setImageLoaded(true);
                    drawCanvas();
                };
                img.onerror = () => {
                    console.error('Failed to load background:', bgUrl);
                    setImageLoaded(true);
                    drawCanvas();
                };
            }

            if (found.imageData?.fontUrl) {
                setFontLoaded(false);
                const fontFace = new FontFace('custom-font', `url(${found.imageData.fontUrl})`);
                fontFace.load()
                    .then(() => {
                        document.fonts.add(fontFace);
                        setCustomFont('custom-font');
                        setFontLoaded(true);
                        drawCanvas();
                    })
                    .catch(err => {
                        console.error('Failed to load custom font:', err);
                        setCustomFont('Arial');
                        setFontLoaded(true);
                        drawCanvas();
                    });
            }
        } else {
            console.warn(`Image with name "${imageName}" not found.`);
            setSelectedImage(null);
        }
    }, [location.search, images]);

    useEffect(() => {
        if (!selectedImage || !imageLoaded) return;
        drawCanvas();
    }, [text, fontSize, fontColor, textPosition, customFont, fontLoaded, imageLoaded, selectedImage]);

    const canvasWidth = selectedImage?.imageData?.canvasWidth || imageRef.current?.naturalWidth || 800;
    const canvasHeight = selectedImage?.imageData?.canvasHeight || imageRef.current?.naturalHeight || 600;

    useEffect(() => {
        if (canvasWidth && canvasHeight && !textPosition) {
            resetTextPosition();
        }
    }, [canvasWidth, canvasHeight, textPosition]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !selectedImage) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (imageLoaded && imageRef.current?.complete && imageRef.current?.naturalWidth > 0) {
            ctx.drawImage(
                imageRef.current,
                0, 0,
                canvas.width, canvas.height
            );
        } else {
            ctx.fillStyle = 'var(--irysup-color-gray-light)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (!imageLoaded) {
                ctx.fillStyle = 'var(--irysup-color-text-muted)';
                ctx.font = '16px var(--irysup-font-family)';
                ctx.fillText('Loading background...', 50, 50);
            }
        }

        if (!fontLoaded) {
            ctx.fillStyle = '#555';
            ctx.font = '16px Arial';
            ctx.fillText('Loading font...', 50, 100);
            return;
        }

        const fontToUse = customFont || 'Arial';
        ctx.font = `${fontSize}px ${fontToUse}`;
        ctx.fillStyle = fontColor;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        const posX = textPosition?.x ?? (canvasWidth > 0 ? canvasWidth * 0.1 : 50);
        const posY = textPosition?.y ?? (canvasHeight > 0 ? canvasHeight * 0.5 : 50);

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

        if (!textPosition) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.font = `${fontSize}px ${customFont || 'Arial'}`;
            const textWidth = ctx.measureText(text).width;

            const defaultX = Math.max(0, (canvasWidth - textWidth) / 2);
            const defaultY = Math.max(0, (canvasHeight - fontSize) / 2);

            setTextPosition({ x: defaultX, y: defaultY });
            setDragOffset({ x: x - defaultX, y: y - defaultY });
        } else {
            const offsetX = x - textPosition.x;
            const offsetY = y - textPosition.y;
            setDragOffset({ x: offsetX, y: offsetY });
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

    const resetTextPosition = () => {
        if (!canvasRef.current || !text) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.font = `${fontSize}px ${customFont || 'Arial'}`;
        const textWidth = ctx.measureText(text).width;

        setTextPosition({
            x: Math.max(0, (canvasWidth - textWidth) / 2),
            y: Math.max(0, (canvasHeight - fontSize) / 2)
        });
    };

    const handleDownload = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `${selectedImage.imageName || 'edited-image'}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const irysId = profileData?.irysId;
        const imageId = selectedImage?.imageId;
        const imageName = selectedImage?.imageName;

        if (!irysId || !imageId || !imageName) {
            console.error('Incomplete data for useImage:', { irysId, imageId, imageName });
            console.log('Error: Incomplete data. Please try again.');
            return;
        }

        const imageUserId = {
            irysId: selectedImage?.creator_irysId,
            imageId: imageId,
            imageUrl: selectedImage?.imageData?.imageUrl,
            timestamp: Date.now()
        };

        try {
            await useImage(irysId, imageId, imageUserId, imageName);
            console.log('Image successfully used in database.');
        } catch (err) {
            console.error('Failed to save image usage:', err);
            console.log('Failed to save image usage history.');
            return;
        }

        const tweetText = encodeURIComponent(
            `I just tried out the ${imageName} design on @irysup — you’ve gotta check it out yourself! 🚀 ${baseApiUrl}/images?id=${imageName} `
        );

        window.open(
            `https://twitter.com/intent/tweet?text=${tweetText}`,
            '_blank'
        );

        console.log('Image successfully downloaded!\nCheck new tab to share on Twitter!');
    };

    const handleSave = async () => {
        const textData = {
            text,
            fontSize,
            fontColor,
            textPosition,
            customFont,
            fontUrl,
            canvasWidth,
            canvasHeight,
            backgroundImageUrl: selectedImage?.imageData?.backgroundUrl || '',
            timestamp: new Date().toISOString(),
        };

        console.log('Saving text data:', textData);
        console.log('Text successfully saved!');
    };

    if (imagesLoading) {
        return (
            <div className="UseImagesCard--loading">
                <div className="UseImagesCard--loading-message">⏳ Loading image...</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="UseImagesCard--loading">
                <div className="UseImagesCard--loading-message">⏳ Loading image...</div>
            </div>
        );
    }

    if (imagesError) {
        return (
            <div className="UseImagesCard--error">
                <div className="UseImagesCard--error-message">❌ Error: {imagesError}</div>
            </div>
        );
    }

    if (!selectedImage) {
        return (
            <div className="UseImagesCard--not-found">
                <div className="UseImagesCard--not-found-content">
                    <h2>Image not found</h2>
                    <p>Please ensure your URL is correct, e.g.: <code>/edit?id=irysUp</code></p>
                    <button
                        onClick={() => window.location.href = '/home'}
                        className="UseImagesCard--back-button"
                    >
                        ← Back to Image List
                    </button>
                </div>
            </div>
        );
    }

    const creatorName = selectedImage.creator_name || 'Anonymous';
    const imageName = selectedImage.imageName || 'Untitled';
    const handleClick = () => {
        window.location.href = (`/profile?irysId=${encodeURIComponent(selectedImage.creator_irysId)}`);
    };

    return (
        <div className="UseImagesCard">
            <header className="UseImagesCard--header">
                <div className="UseImagesCard--logo">
                    <span className="UseImagesCard--logo-text">{imageName}</span>
                </div>
                <div className="UseImagesCard--creator-name" onClick={handleClick}>
                    by {creatorName}
                </div>
            </header>

            <main className="UseImagesCard--main">
                <div className="UseImagesCard--canvas-wrapper">
                    <canvas
                        ref={canvasRef}
                        width={canvasWidth}
                        height={canvasHeight}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseDown={handleMouseDown}
                        className="UseImagesCard--canvas"
                    />
                    {!imageLoaded && (
                        <div className="UseImagesCard--canvas-overlay">
                            <div className="UseImagesCard--overlay-text">Loading background...</div>
                        </div>
                    )}
                    {!fontLoaded && (
                        <div className="UseImagesCard--canvas-overlay">
                            <div className="UseImagesCard--overlay-text">Loading font...</div>
                        </div>
                    )}
                </div>

                <div className="UseImagesCard--controls-panel">
                    <div className="UseImagesCard--preview-container">
                        <div className="UseImagesCard--preview">
                            {selectedImage.imageData?.imageUrl ? (
                                <img
                                    src={selectedImage.imageData.imageUrl}
                                    alt={selectedImage.imageName || 'Preview'}
                                    className="UseImagesCard--preview-image"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/160x120?text=No+Image';
                                        e.target.style.backgroundColor = 'var(--irysup-color-gray-light)';
                                    }}
                                />
                            ) : (
                                <div className="UseImagesCard--preview-placeholder">
                                    No preview
                                </div>
                            )}
                        </div>
                        <div className="UseImagesCard--preview-label">{selectedImage.imageName}</div>
                    </div>

                    <div className="UseImagesCard--controls-header">
                        <h3 className="UseImagesCard--controls-title">Text Settings</h3>
                        <button onClick={resetTextPosition} className="UseImagesCard--reset-button">
                            <FaUndo /> Reset
                        </button>
                    </div>

                    <div className="UseImagesCard--form-group">
                        <label className="UseImagesCard--label"><FaFont /> Text</label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text..."
                            className="UseImagesCard--input"
                        />
                    </div>

                    <div className="UseImagesCard--form-group">
                        <label className="UseImagesCard--label"><FaTextHeight /> Font Size: {fontSize}px</label>
                        <input
                            type="range"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            min="12"
                            max="120"
                            className="UseImagesCard--slider"
                        />
                    </div>

                    <div className="UseImagesCard--form-group">
                        <label className="UseImagesCard--label"><FaPalette /> Font Color</label>
                        <div className="UseImagesCard--color-picker-container">
                            <input
                                type="color"
                                value={fontColor}
                                onChange={(e) => setFontColor(e.target.value)}
                                className="UseImagesCard--color-input"
                            />
                            <span className="UseImagesCard--color-value">{fontColor}</span>
                        </div>
                    </div>

                    <div className="UseImagesCard--form-group">
                        <label className="UseImagesCard--label"><FaCrosshairs /> Text Position</label>
                        <div className="UseImagesCard--position-info">
                            X: {textPosition?.x?.toFixed(0) || 0}px, Y: {textPosition?.y?.toFixed(0) || 0}px
                        </div>
                    </div>

                    <div className="UseImagesCard--info-tip">
                        <strong>Tip:</strong> Click & drag text to move it on canvas.
                    </div>

                    <div className="UseImagesCard--actions">
                        <button
                            disabled={disabled}
                            onClick={handleDownload}
                            className="UseImagesCard--button UseImagesCard--button-download"
                        >
                            <FaDownload /> Download
                        </button>
                        <button
                            disabled={isDisabled}
                            onClick={handleSave}
                            className="UseImagesCard--button UseImagesCard--button-save"
                            style={{
                                opacity: isDisabled ? 0.6 : 1,
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                backgroundColor: isDisabled ? '#e9ecef' : '#007bff',
                                border: '1px solid #ccc',
                                color: isDisabled ? '#6c757d' : '#fff',
                            }}
                        >
                            <FaSave /> Save
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PublicImagesCard;