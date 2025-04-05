import {Market} from '../../types';

// Mock data for development
const mockMarkets: Record<string, Market> = {
    'btc-price': {
        id: 'btc-price',
        question: 'Will BTC be above $60k by end of April 2025?',
        positiveThreshold: 65,
        protectiveThreshold: 35,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    'eth-price': {
        id: 'eth-price',
        question: 'Will ETH be above $4k by June 2025?',
        positiveThreshold: 70,
        protectiveThreshold: 30,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    'sol-price': {
        id: 'sol-price',
        question: 'Will SOL be above $200 by May 2025?',
        positiveThreshold: 60,
        protectiveThreshold: 40,
        createdAt: new Date(),
        updatedAt: new Date()
    }
};

/**
 * Fetch market data from Solana blockchain
 * This is a placeholder implementation that returns mock data
 */
export const fetchMarketData = async (marketId: string): Promise<Market> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data or throw error if market doesn't exist
    if (marketId in mockMarkets) {
        return mockMarkets[marketId];
    }

    // If market ID is 'all', return all markets
    if (marketId === 'all') {
        return Object.values(mockMarkets)[0]; // Just return the first one for now
    }

    throw new Error(`Market with ID ${marketId} not found`);
};

/**
 * Fetch all available markets
 */
export const fetchAllMarkets = async (): Promise<Market[]> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    return Object.values(mockMarkets);
};

/**
 * Initialize connection to Solana
 */
export const initializeSolanaConnection = () => {
    // This would be replaced with actual Solana connection code
    console.log('Initializing Solana connection...');
    return {
        isConnected: true,
        network: 'devnet'
    };
};