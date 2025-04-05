import { useState, useEffect } from 'react';
import axios from 'axios';

interface PredictionMarket {
    id: string;
    question: string;
    endDate: string;
    volume: string;
    liquidity: string;
    outcomes: string;
    outcomePrices?: string;
    description: string;
    image: string;
    icon: string;
    active: boolean;
    closed: boolean;
    new: boolean;
    featured: boolean;
    archived: boolean;
    restricted: boolean;
}

export const usePredictionMarkets = () => {
    const [markets, setMarkets] = useState<PredictionMarket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchMarkets = async (page: number = 1) => {
        try {
            if (page === 1) {
                setLoading(true);
            }
            setError(null);
            
            const response = await axios.get(`/api/polymarket?page=${page}&limit=50`);
            const newMarkets = response.data;

            // If we got fewer markets than the limit, we've reached the end
            if (newMarkets.length < 50) {
                setHasMore(false);
            }

            if (page === 1) {
                setMarkets(newMarkets);
            } else {
                setMarkets(prev => [...prev, ...newMarkets]);
            }
        } catch (error) {
            console.error('Error fetching prediction markets:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || 'Failed to fetch prediction markets');
            } else {
                setError('Failed to fetch prediction markets. Please try again later.');
            }
        } finally {
            if (page === 1) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchMarkets(1);

        // Update every 5 minutes
        const interval = setInterval(() => fetchMarkets(1), 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { markets, loading, error, hasMore, fetchMarkets };
}; 