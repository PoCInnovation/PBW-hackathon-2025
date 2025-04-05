"use client";

import { useEffect, useState } from 'react';
import { fetchMarketData, fetchAllMarkets } from '../lib/solana/connection';
import { Market } from '../types';

const useMarket = (marketId?: string) => {
    const [marketData, setMarketData] = useState<Market | null>(null);
    const [activePredictions, setActivePredictions] = useState<Market[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getMarketData = async () => {
            try {
                setLoading(true);
                
                // If marketId is provided, fetch specific market
                if (marketId) {
                    const data = await fetchMarketData(marketId);
                    setMarketData(data);
                }
                
                // Fetch all markets for active predictions
                const allMarkets = await fetchAllMarkets();
                setActivePredictions(allMarkets);
            } catch (err) {
                setError('Failed to fetch market data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getMarketData();
    }, [marketId]);

    return { marketData, activePredictions, loading, error };
};

export default useMarket;