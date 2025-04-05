import axios from 'axios';

interface TokenPrice {
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    image: string;
}

interface TokenBalance {
    symbol: string;
    name: string;
    image: string;
    balance: string;
}

// Map our token symbols to CoinGecko IDs
const TOKEN_MAP: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'USDC': 'usd-coin'
};

export const fetchTokenPrices = async (): Promise<TokenPrice[]> => {
    try {
        const response = await axios.get('/api/crypto', {
            timeout: 10000 // 10 second timeout
        });

        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response format from API');
        }

        return response.data.map((coin: any) => ({
            symbol: Object.keys(TOKEN_MAP).find(key => TOKEN_MAP[key] === coin.id) || coin.id,
            name: coin.name,
            current_price: coin.current_price,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            image: coin.image
        }));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
            } else if (error.request) {
                // The request was made but no response was received
                throw new Error('No response received from the API. Please check your connection.');
            }
        }
        console.error('Error fetching token prices:', error);
        throw new Error('Failed to fetch token prices. Please try again later.');
    }
};

// Mock balances for now - these would come from your wallet integration
export const getMockBalances = (): TokenBalance[] => {
    return [
        { symbol: "SOL", name: "Solana", image: "https://cryptologos.cc/logos/solana-sol-logo.png?v=026", balance: "12.5" },
        { symbol: "USDC", name: "USD Coin", image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026", balance: "1250.00" },
        { symbol: "ETH", name: "Ethereum", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026", balance: "0.75" },
        { symbol: "BTC", name: "Bitcoin", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026", balance: "0.05" }
    ];
}; 