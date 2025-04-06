"use client";

import {useEffect, useState} from 'react';
import {Market} from '../types';

export default function useMarket(marketId?: string) {
    const [marketData, setMarketData] = useState<Market | null>(null);
    const [activePredictions, setActivePredictions] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Si un marketId est fourni, récupérer les données de ce marché spécifique
                if (marketId) {
                    const marketResponse = await fetch(`/api/market?marketId=${marketId}`);
                    if (!marketResponse.ok) {
                        throw new Error('Failed to fetch market data');
                    }
                    const marketData = await marketResponse.json();
                    setMarketData(marketData);
                }

                // Toujours récupérer tous les marchés pour activePredictions
                const marketsResponse = await fetch('/api/markets');
                if (!marketsResponse.ok) {
                    throw new Error('Failed to fetch markets data');
                }
                const marketsData = await marketsResponse.json();
                setActivePredictions(marketsData);
                
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                if (!marketId) {
                    setMarketData(null);
                }
                setActivePredictions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [marketId]); // Dépendance uniquement sur marketId

    return {marketData, activePredictions, loading, error};
}