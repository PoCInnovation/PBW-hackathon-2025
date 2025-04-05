import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface TokenPairInfoProps {
    fromToken: {
        symbol: string;
        name: string;
        image: string;
        balance: string;
        current_price?: number;
        price_change_percentage_24h?: number;
    } | null;
    targetToken: {
        symbol: string;
        name: string;
        image: string;
        balance: string;
        current_price?: number;
        price_change_percentage_24h?: number;
    } | null;
}

interface ChartData {
    timestamp: string;
    fromPrice: number;
    targetPrice: number;
    ratio: number;
}

// Map our token symbols to CoinGecko IDs
const TOKEN_MAP: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'USDC': 'usd-coin'
};

const TokenPairInfo: React.FC<TokenPairInfoProps> = ({ fromToken, targetToken }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                if (!fromToken || !targetToken) {
                    setLoading(false);
                    return;
                }

                // Get CoinGecko IDs for the tokens
                const fromId = TOKEN_MAP[fromToken.symbol];
                const targetId = TOKEN_MAP[targetToken.symbol];

                if (!fromId || !targetId) {
                    throw new Error('Invalid token symbols');
                }

                // Fetch historical data for both tokens
                const [fromResponse, targetResponse] = await Promise.all([
                    axios.get(`/api/crypto/historical?tokenId=${fromId}&days=7`),
                    axios.get(`/api/crypto/historical?tokenId=${targetId}&days=7`)
                ]);

                if (!fromResponse.data || !targetResponse.data) {
                    throw new Error('Invalid response format from API');
                }

                const fromData = fromResponse.data;
                const targetData = targetResponse.data;

                if (!fromData.prices || !targetData.prices) {
                    throw new Error('Invalid data format received from API');
                }

                // Process the data
                const processedData = fromData.prices.map((fromPrice: [number, number], index: number) => {
                    const targetPrice = targetData.prices[index][1];
                    return {
                        timestamp: new Date(fromPrice[0]).toLocaleDateString(),
                        fromPrice: Number(fromPrice[1].toFixed(6)),
                        targetPrice: Number(targetPrice.toFixed(6)),
                        ratio: Number((fromPrice[1] / targetPrice).toFixed(6))
                    };
                });

                setChartData(processedData);
            } catch (error) {
                console.error('Error fetching historical data:', error);
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.error || 'Failed to fetch historical data');
                } else {
                    setError('Failed to fetch historical data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHistoricalData();

        // Update every 5 minutes
        const interval = setInterval(fetchHistoricalData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fromToken, targetToken]);

    if (!fromToken || !targetToken) {
        return (
            <div className="bg-primary p-4 rounded-lg border border-border">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-xl font-medium text-textSecondary mb-2">Select a Prediction Market</div>
                        <div className="text-sm text-textSecondary">Choose a prediction market from the right panel to view the price comparison</div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-primary p-4 rounded-lg border border-border">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-primary p-4 rounded-lg border border-border">
                <div className="flex items-center justify-center h-64 text-danger">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                        <img
                            src={fromToken.image}
                            alt={fromToken.symbol}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="font-medium">{fromToken.symbol}</div>
                        <div className="text-sm text-textSecondary">{fromToken.name}</div>
                    </div>
                </div>
                <div className="text-2xl font-bold text-accent">/</div>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                        <img
                            src={targetToken.image}
                            alt={targetToken.symbol}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="font-medium">{targetToken.symbol}</div>
                        <div className="text-sm text-textSecondary">{targetToken.name}</div>
                    </div>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="timestamp" 
                            stroke="#9CA3AF"
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                        />
                        <YAxis 
                            stroke="#9CA3AF"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => value.toFixed(4)}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '0.5rem',
                                color: '#9CA3AF'
                            }}
                            labelStyle={{ color: '#9CA3AF' }}
                            formatter={(value: number) => [value.toFixed(6), 'Ratio']}
                        />
                        <Line
                            type="monotone"
                            dataKey="ratio"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#8B5CF6' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                    <div className="text-sm text-textSecondary">Current Ratio</div>
                    <div className="text-lg font-semibold">
                        {chartData.length > 0 
                            ? Number(chartData[chartData.length - 1].ratio).toFixed(6)
                            : 'N/A'}
                    </div>
                </div>
                <div className="bg-secondary p-3 rounded-lg">
                    <div className="text-sm text-textSecondary">24h Change</div>
                    <div className={`text-lg font-semibold ${
                        chartData.length > 1
                            ? (chartData[chartData.length - 1].ratio - chartData[chartData.length - 2].ratio) >= 0
                                ? 'text-success'
                                : 'text-danger'
                            : ''
                    }`}>
                        {chartData.length > 1
                            ? `${((chartData[chartData.length - 1].ratio - chartData[chartData.length - 2].ratio) / chartData[chartData.length - 2].ratio * 100).toFixed(2)}%`
                            : 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenPairInfo;