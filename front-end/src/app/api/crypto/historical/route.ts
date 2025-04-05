import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tokenId = searchParams.get('tokenId');
        const days = searchParams.get('days') || '7';

        if (!tokenId) {
            return NextResponse.json(
                { error: 'Token ID is required' },
                { status: 400 }
            );
        }

        // Use the simpler price endpoint instead of market_chart
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                next: { revalidate: 300 } // Cache for 5 minutes
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `CoinGecko API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Ensure we have valid price data
        if (!data.prices || !Array.isArray(data.prices) || data.prices.length === 0) {
            throw new Error('No price data available');
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch historical data' },
            { status: 500 }
        );
    }
} 