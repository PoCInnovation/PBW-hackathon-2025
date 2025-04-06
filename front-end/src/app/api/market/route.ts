import { NextResponse } from 'next/server';
import { marketCache } from '../../../lib/cache';

// Rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute
const requestTimestamps: number[] = [];

function isRateLimited(): boolean {
    const now = Date.now();
    // Remove timestamps older than the window
    while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW) {
        requestTimestamps.shift();
    }
    
    if (requestTimestamps.length >= MAX_REQUESTS) {
        return true;
    }
    
    requestTimestamps.push(now);
    return false;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const marketId = searchParams.get('marketId');

    if (!marketId) {
        return NextResponse.json({ error: 'Market ID is required' }, { status: 400 });
    }

    // Check cache first
    const cachedData = marketCache.get(marketId);
    if (cachedData) {
        console.log(`Using cached data for market ID: ${marketId}`);
        return NextResponse.json(cachedData);
    }

    // Check rate limit
    if (isRateLimited()) {
        console.log('Rate limit exceeded');
        return NextResponse.json({ 
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: RATE_LIMIT_WINDOW / 1000
        }, { 
            status: 429,
            headers: {
                'Retry-After': (RATE_LIMIT_WINDOW / 1000).toString()
            }
        });
    }

    try {
        console.log(`Fetching market data for ID: ${marketId}`);
        const response = await fetch(`https://gamma-api.polymarket.com/markets/${marketId}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0',
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return NextResponse.json({ 
                error: `Failed to fetch market data: ${response.status}`,
                status: response.status
            }, { status: response.status });
        }

        const data = await response.json();
        console.log(`Successfully fetched market data for ID: ${marketId}`);
        
        // Cache the data
        marketCache.set(marketId, data);
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching market data:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch market data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 