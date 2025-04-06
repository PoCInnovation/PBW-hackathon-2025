import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://gamma-api.polymarket.com/markets', {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching markets data:', error);
        return NextResponse.json({ error: 'Failed to fetch markets data' }, { status: 500 });
    }
} 