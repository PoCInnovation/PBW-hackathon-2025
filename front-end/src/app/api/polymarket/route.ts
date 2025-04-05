import { NextResponse } from 'next/server';

interface PolyMarketMarket {
    id: string;
    question: string;
    endDate: string;
    volume: string;
    liquidity: string;
    outcomes: string;
    outcomePrices?: string;
    description: string;
    image: string;
    icon: string;
    active: boolean;
    closed: boolean;
    new: boolean;
    featured: boolean;
    archived: boolean;
    restricted: boolean;
}

// Updated to use the correct PolyMarket API endpoint with pagination
const POLYMARKET_API_URL = 'https://gamma-api.polymarket.com/markets';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '50';
        const startDate = searchParams.get('start_date') || '2025-04-01T00:00:00Z';

        // Construct the URL with query parameters
        const url = new URL(POLYMARKET_API_URL);
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        url.searchParams.append('start_date_min', startDate);
        url.searchParams.append('sort', 'volume:desc'); // Sort by volume to get the most active markets first

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0'
            },
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`PolyMarket API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format from PolyMarket API');
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching PolyMarket data:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch PolyMarket data' },
            { status: 500 }
        );
    }
} 