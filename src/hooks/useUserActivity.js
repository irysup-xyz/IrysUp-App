import { useState, useEffect } from 'react';
import { useApiConfig } from '../context/ApiConfigContext';

export const useUserActivitySummary = (startDate = null, endDate = null, limit = 30) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { baseApiUrl } = useApiConfig();

    useEffect(() => {
        let isMounted = true;

        const fetchSummary = async () => {
            setLoading(true);
            setError(null);

            try {
                let url = `${baseApiUrl}/user-activity/summary?limit=${limit}`;
                const params = new URLSearchParams();
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                if (params.toString()) url += `&${params.toString()}`;

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch activity summary');
                }

                const result = await response.json();

                if (isMounted) {
                    setData(result.summary || []);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchSummary();

        return () => {
            isMounted = false;
        };
    }, [startDate, endDate, limit]);

    return {
        data,
        loading,
        error,
    };
};