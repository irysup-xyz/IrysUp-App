import React, { useState, useMemo } from 'react';
import { useTrending } from '../../hooks/useTrending';
import './Overview.css';

const Overview = ({ periodType = 'daily' }) => {
    const { data, loading, error } = useTrending(periodType, null, null, null, 7);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const flattenedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        return data
            .flatMap((period) =>
                period.data.map((item) => ({
                    ...item,
                    periodDate: period.periodDate,
                    periodDisplay: new Date(period.periodDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                    }),
                }))
            )
            .sort((a, b) => new Date(b.periodDate) - new Date(a.periodDate));
    }, [data]);

    const totalPages = Math.ceil(flattenedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = flattenedData.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    if (loading) {
        return (
            <div className="irysup-trending-table-container">
                <div className="irysup-trending-header">
                    <h3 className="irysup-heading">📈 Trending History {periodType} — Last 7 Days</h3>
                </div>
                <div className="irysup-skeleton-table-wrapper">
                    <table className="irysup-trending-table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Rank</th>
                                <th>Image Name</th>
                                <th>Creator</th>
                                <th>Stars</th>
                                <th>Growth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(10)].map((_, i) => (
                                <tr key={i}>
                                    <td><div className="irysup-skeleton-cell"></div></td>
                                    <td><div className="irysup-skeleton-cell"></div></td>
                                    <td><div className="irysup-skeleton-cell"></div></td>
                                    <td><div className="irysup-skeleton-cell"></div></td>
                                    <td><div className="irysup-skeleton-cell"></div></td>
                                    <td><div className="irysup-skeleton-cell"></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="irysup-trending-table-container">
                <div className="irysup-error-box">
                    ⚠️ Failed to load data: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="irysup-trending-table-container">
            <div className="irysup-trending-header">
                <h3 className="irysup-heading">Trending History {periodType} — Last 7 Days</h3>
                <p className="irysup-subtitle">
                    Showing ranking and growth of popular images from {flattenedData.length} entries.
                </p>
            </div>

            {flattenedData.length === 0 ? (
                <div className="irysup-empty-state">
                    <div>🔍</div>
                    <p>No history data in the last 7 days.</p>
                </div>
            ) : (
                <>
                    <div className="irysup-table-wrapper">
                        <table className="irysup-trending-table">
                            <thead>
                                <tr>
                                    <th>Period</th>
                                    <th>Rank</th>
                                    <th>Image Name</th>
                                    <th>Creator</th>
                                    <th>Stars</th>
                                    <th>Growth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item, idx) => (
                                    <tr key={`${item.imageId}-${item.periodDate}`} className="irysup-table-row">
                                        <td>{item.periodDisplay}</td>
                                        <td>#{item.rankPosition}</td>
                                        <td>
                                            <div className="irysup-ellipsis" title={item.imageName}>
                                                {item.imageName}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="irysup-creator-id">{item.creator_irysId}</div>
                                        </td>
                                        <td>{item.starCount.toLocaleString()}</td>
                                        <td className={`irysup-growth ${item.growthRate >= 0 ? 'positive' : 'negative'}`}>
                                            {item.growthRate !== null ? (
                                                <>
                                                    {item.growthRate >= 0 ? '▲' : '▼'}{' '}
                                                    {item.growthRate >= 0 ? '+' : ''}
                                                    {item.growthRate.toFixed(2)}%
                                                </>
                                            ) : (
                                                '–'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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
                </>
            )}
        </div>
    );
};

export default Overview;