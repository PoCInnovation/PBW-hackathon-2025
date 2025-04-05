import { useState, useEffect } from 'react';
import axios from 'axios';

interface PredictionMarket {
    id: string;
    question: string;
    endDate: string;
    volume: number;
    liquidity: number;
    category: string;
    outcomes: {
        name: string;
        probability: number;
    }[];
}

export const usePredictionMarkets = () => {
    const [markets, setMarkets] = useState<PredictionMarket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get('/api/polymarket');
                setMarkets(response.data);
            } catch (error) {
                console.error('Error fetching prediction markets:', error);
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.error || 'Failed to fetch prediction markets');
                } else {
                    setError('Failed to fetch prediction markets. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchMarkets();

        // Update every 5 minutes
        const interval = setInterval(fetchMarkets, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { markets, loading, error };
}; 