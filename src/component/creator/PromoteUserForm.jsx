import React, { useState, useEffect } from 'react';
import useUserApi from '../../hooks/useUserApi';
import useIrysUp from '../../hooks/useIrysUp';
import './PromoteUserForm.css';

const PromoteUserForm = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [irysId, setIrysId] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [registrations, setRegistrations] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [fetchError, setFetchError] = useState('');

    const { successRegist, getAllRegist } = useIrysUp();
    const { promotion } = useUserApi();

    useEffect(() => {
        const fetchRegistrations = async () => {
            setFetching(true);
            setFetchError('');
            try {
                const result = await getAllRegist();
                if (Array.isArray(result)) {
                    setRegistrations(result);
                } else {
                    console.warn('getAllRegist did not return an array:', result);
                    setRegistrations([]);
                }
            } catch (error) {
                setFetchError('Failed to load registration data.');
                console.error(error);
            } finally {
                setFetching(false);
            }
        };

        fetchRegistrations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!irysId.trim()) {
            setMessage({ type: 'error', text: 'Irys ID is required.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await promotion(irysId, role);
            await successRegist({ irysId });

            setMessage({ type: 'success', text: 'User promoted successfully!' });
            setIrysId('');
            setRole('');

            const updatedRegistrations = await getAllRegist();
            setRegistrations(Array.isArray(updatedRegistrations) ? updatedRegistrations : []);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to promote user.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id) return;
        try {
            await successRegist({ irysId: id });

            const updatedRegistrations = await getAllRegist();
            setRegistrations(Array.isArray(updatedRegistrations) ? updatedRegistrations : []);
        } catch (error) {
            console.error('Failed to delete registration:', error);
            setMessage({ type: 'error', text: 'Failed to delete registration.' });
        }
    };

    return (
        <div className="promote-form-container">
            <div className="promote-layout">
                <div className="promote-form-wrapper">
                    <form onSubmit={handleSubmit} className="promote-form-card">
                        <h3 className="promote-form-title">Promote User</h3>

                        <div className="form-group">
                            <label htmlFor="irysId">Irys ID</label>
                            <input
                                id="irysId"
                                type="text"
                                placeholder="Enter user Irys ID"
                                value={irysId}
                                onChange={(e) => setIrysId(e.target.value)}
                                className="form-input"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="form-select"
                                disabled={loading}
                                required
                            >
                                <option value="">-- Select Role --</option>
                                <option value="user">User</option>
                                <option value="earlyUp">Early Up</option>
                                <option value="creator">Creator</option>
                                <option value="irysUp">IrysUp</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="promote-btn"
                            disabled={loading}
                        >
                            {loading ? 'Promoting...' : 'Promote User'}
                        </button>

                        {message.text && (
                            <div className={`message-box ${message.type}`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </div>

                <div className="registrations-wrapper">
                    <div className="registrations-section">
                        <h4 className="registrations-title">All Registrations</h4>

                        {fetchError && <div className="text-danger mb-4">{fetchError}</div>}

                        {fetching ? (
                            <p className="text-muted">Loading registrations...</p>
                        ) : registrations.length > 0 ? (
                            <>
                                <div className="registrations-list">
                                    {registrations
                                        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                                        .map((reg, index) => (
                                            <div key={index} className="registration-item">
                                                <p><strong>Name:</strong> {reg.name || 'N/A'}</p>
                                                <p><strong>Irys ID:</strong> {reg.irysId || 'N/A'}</p>
                                                <p>
                                                    <strong>Link:</strong>{' '}
                                                    <a
                                                        href={reg.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-link"
                                                    >
                                                        {reg.link ? 'Visit Link' : 'N/A'}
                                                    </a>
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(reg.irysId)}
                                                    className="promote-btn"
                                                    style={{ marginTop: '8px', fontSize: '0.875rem', padding: '4px 8px' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))}
                                </div>

                                <div className="pagination-controls">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0}
                                        className="pagination-btn"
                                    >
                                        {'<'}
                                    </button>
                                    <span className="pagination-info">
                                        Page {currentPage + 1} of {Math.ceil(registrations.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    Math.ceil(registrations.length / itemsPerPage) - 1,
                                                    currentPage + 1
                                                )
                                            )
                                        }
                                        disabled={currentPage >= Math.ceil(registrations.length / itemsPerPage) - 1}
                                        className="pagination-btn"
                                    >
                                        {'>'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted">No registrations found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoteUserForm;