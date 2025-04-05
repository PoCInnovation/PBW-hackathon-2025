import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,usd-coin&order=market_cap_desc&per_page=100&page=1&sparkline=false',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                next: { revalidate: 60 } // Cache for 1 minute
            }
        );

        if (!response.ok) {
            throw new Error(`CoinGecko API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching from CoinGecko:', error);
        return NextResponse.json(
            { error: 'Failed to fetch token prices' },
            { status: 500 }
        );
    }
} 