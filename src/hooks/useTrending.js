import { useState, useEffect } from 'react';
import { useApiConfig } from '../context/ApiConfigContext';


const getNDaysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0]; // "2025-04-05"
};

export const useTrending = (
    periodType,
    customDate = null,
    startDate = null,
    endDate = null,
    lastNDays = null
) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodDate, setPeriodDate] = useState(null);
    const validPeriodTypes = ['daily', 'weekly', 'hourly'];
    const { baseApiUrl } = useApiConfig();

    if (!validPeriodTypes.includes(periodType)) {
        throw new Error(`periodType harus salah satu dari: ${validPeriodTypes.join(', ')}`);
    }

    useEffect(() => {
        let isMounted = true;

        const fetchTrending = async () => {
            setLoading(true);
            setError(null);

            try {
                let url;
                const params = new URLSearchParams();

                if (lastNDays !== null) {
                    const today = new Date().toISOString().split('T')[0];
                    const nDaysAgo = getNDaysAgo(lastNDays);
                    url = `${baseApiUrl}/trending/history/${periodType}`;
                    params.append('startDate', nDaysAgo);
                    params.append('endDate', today);
                }

                else if (startDate || endDate) {
                    url = `${baseApiUrl}/trending/history/${periodType}`;
                    if (startDate) params.append('startDate', startDate);
                    if (endDate) params.append('endDate', endDate);
                }

                else if (customDate) {
                    url = `${baseApiUrl}/trending/${periodType}?date=${encodeURIComponent(customDate)}`;
                }

                else {
                    url = `${baseApiUrl}/trending/${periodType}`;
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch trending data');
                }

                const result = await response.json();

                if (isMounted) {
                    if (lastNDays !== null || (startDate || endDate)) {
                        setData(result.data || []);
                        setPeriodDate(null);
                    } else {
                        setData(result.data || []);
                        setPeriodDate(result.periodDate || null);
                    }
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchTrending();

        return () => {
            isMounted = false;
        };
    }, [periodType, customDate, startDate, endDate, lastNDays]);

    return {
        data,
        loading,
        error,
        periodDate,
    };
};