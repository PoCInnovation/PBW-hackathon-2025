"use client";

import { useState } from 'react';
import useWallet from './useWallet';
import useMarket from './useMarket';
import { swapTokens } from '../lib/solana/transactions';

export const useSwap = () => {
    const { walletAddress } = useWallet();
    const { marketData } = useMarket('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const performSwap = async (fromToken: string, toToken: string, amount: number) => {
        if (!walletAddress) {
            setError('Wallet not connected');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await swapTokens(walletAddress, fromToken, toToken, amount);
            return result;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        performSwap,
        marketData,
    };
};

export default useSwap;