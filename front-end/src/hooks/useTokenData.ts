import { useState, useEffect } from 'react';
import { fetchTokenPrices, getMockBalances } from '../lib/services/cryptoService';

interface TokenData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    balance: string;
    current_price?: number;
    price_change_percentage_24h?: number;
}

export const useTokenData = () => {
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [prices, balances] = await Promise.all([
                    fetchTokenPrices(),
                    Promise.resolve(getMockBalances())
                ]);

                // Log the fetched prices
                console.log('Fetched new prices:', new Date().toISOString());
                prices.forEach(price => {
                    console.log(`${price.symbol}: $${price.current_price} (${price.price_change_percentage_24h}%)`);
                });

                // Combine prices and balances
                const combinedTokens = balances.map(balance => {
                    const priceData = prices.find(p => p.symbol === balance.symbol);
                    return {
                        id: balance.symbol,
                        ...balance,
                        current_price: priceData?.current_price,
                        price_change_percentage_24h: priceData?.price_change_percentage_24h
                    };
                });

                setTokens(combinedTokens);
            } catch (err) {
                setError('Failed to fetch token data');
                console.error('Error fetching token data:', err);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchData();

        // Set up polling every 42 minutes instead of 30 seconds
        const interval = setInterval(fetchData, 42 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return { tokens, loading, error };
}; 