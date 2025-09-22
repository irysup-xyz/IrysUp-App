import React, { useState } from 'react';
import useIrysUp from '../../hooks/useIrysUp';
import './BecomeCreator.css';
const BecomeCreator = () => {
    const [data, setData] = useState({
        name: '',
        irysId: '',
        link: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const { registerCreator } = useIrysUp();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.name || !data.irysId || !data.link) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await registerCreator(data);
            setSuccess(true);
            setData({ name: '', irysId: '', link: '' });
        } catch (err) {
            setError(err.message || "Failed to register as creator.");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        const tweetText = encodeURIComponent(
            `I want to become a creator on IrysUp. Let’s build Irys together with IrysUp! #Irys #IrysUp`
        );

        window.open(
            `https://twitter.com/intent/tweet?text=${tweetText}`,
            '_blank'
        );
    };

    return (
        <div className="become-creator-container">
            <h2 className="become-creator-title">Register as Creator</h2>

            {error && <div className="message-box error">{error}</div>}
            {success && <div className="message-box success">Successfully registered as creator!</div>}

            <form onSubmit={handleSubmit} className="become-creator-form">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="irysId" className="form-label">Irys ID</label>
                    <input
                        type="text"
                        id="irysId"
                        name="irysId"
                        value={data.irysId}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>

                <div className="form-group">
                    <p className="instruction-text">
                        Click the button below, sen the template image, use hashtags <strong>#Irys</strong> and <strong>#IrysUp</strong>, then paste your post link below.
                    </p>
                    <button
                        type="button"
                        onClick={handleShare}
                        className="share-btn"
                    >
                        Share on X (Twitter)
                    </button>

                    <label htmlFor="link" className="form-label">Post Link (X/Twitter)</label>
                    <input
                        type="url"
                        id="link"
                        name="link"
                        value={data.link}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://x.com/..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !data.name.trim() || !data.irysId.trim() || !data.link.trim()}
                    className="submit-btn"
                >
                    {loading ? 'Registering...' : 'Register Now'}
                </button>
            </form>
        </div>
    );
};

export default BecomeCreator;