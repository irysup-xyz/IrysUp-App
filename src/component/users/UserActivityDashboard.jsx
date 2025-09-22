import React, { useState, useMemo } from 'react';
import { useUserActivitySummary } from '../../hooks/useUserActivity';
import './UserActivityDashboard.css';

const UserActivityDashboard = ({ limit = 1000 }) => {
    const { data, loading, error } = useUserActivitySummary(null, null, limit);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = useMemo(() => {
        return Math.ceil(data.length / itemsPerPage);
    }, [data.length, itemsPerPage]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = useMemo(() => {
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, startIndex, itemsPerPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    if (loading) {
        return (
            <div className="irysup-summary-container">
                <div className="irysup-summary-header">
                    <h3 className="irysup-heading">Daily Activity Summary</h3>
                </div>
                <div className="irysup-skeleton-table">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="irysup-skeleton-row">
                            <div className="irysup-skeleton-cell"></div>
                            <div className="irysup-skeleton-cell"></div>
                            <div className="irysup-skeleton-cell"></div>
                            <div className="irysup-skeleton-cell"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="irysup-summary-container">
                <div className="irysup-error-box">⚠️ {error}</div>
            </div>
        );
    }

    return (
        <div className="irysup-summary-container">
            <div className="irysup-summary-header">
                <h3 className="irysup-heading">Daily Activity Summary</h3>
                <p className="irysup-subtitle">
                    Showing daily register & login counts • {data.length} days available
                </p>
            </div>

            {data.length === 0 ? (
                <div className="irysup-empty-state">
                    <div>📭</div>
                    <p>No activity data yet.</p>
                </div>
            ) : (
                <>
                    <div className="irysup-summary-table-wrapper">
                        <table className="irysup-summary-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Register</th>
                                    <th>Login</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, idx) => (
                                    <tr key={idx} className="irysup-summary-row">
                                        <td>
                                            {new Date(item.activityDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td>
                                            <div className="irysup-metric register">
                                                +{item.registerCount}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="irysup-metric login">
                                                +{item.loginCount}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="irysup-metric total">
                                                {item.totalActivity}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 0 && (
                        <div className="irysup-pagination">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="irysup-pagination-btn"
                            >
                                {'<'}
                            </button>

                            <span className="irysup-pagination-info">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="irysup-pagination-btn"
                            >
                                {'>'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserActivityDashboard;