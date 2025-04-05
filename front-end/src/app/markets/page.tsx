"use client";

import React, { useState } from 'react';
import { usePredictionMarkets } from '../../hooks/usePredictionMarkets';
import { useRouter } from 'next/navigation';
import useMarket from '../../hooks/useMarket';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface PredictionMarket {
    id: string;
    question: string;
    endDate: string;
    volume: number;
    liquidity: number;
    category: string;
    outcomes: {
        name: string;
        probability: number;
    }[];
}

export default function MarketsPage() {
    const router = useRouter();
    const { markets, loading, error } = usePredictionMarkets();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Filter markets based on search query and category
    const filteredMarkets = markets.filter(market => {
        const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            market.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || market.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    // Get unique categories for the filter
    const categories = ['all', ...new Set(markets.map(market => market.category.toLowerCase()))];

    const handleMarketSelect = (market: PredictionMarket) => {
        // Navigate to home page with the selected market ID
        router.push(`/?market=${encodeURIComponent(market.id)}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-primary p-6 rounded-lg border border-border">
                        <div className="text-center">
                            <div className="text-xl font-semibold mb-2 text-danger">Unable to Load Prediction Markets</div>
                            <div className="text-textSecondary mb-4">
                                We're currently experiencing issues connecting to PolyMarket. Please try again later.
                            </div>
                            <div className="text-sm text-textSecondary">
                                In the meantime, you can still:
                                <ul className="mt-2 space-y-1">
                                    <li>• View token price comparisons</li>
                                    <li>• Set up your token preferences</li>
                                    <li>• Configure your trading parameters</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4">
          <header className="navbar">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-accentGradient text-transparent bg-clip-text">FateFi</h1>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-6 items-center">
                <li><a href="/" className="text-white hover:text-accent transition-colors">Home</a></li>
                <li><a href="/markets" className="text-white hover:text-accent transition-colors">Markets</a></li>
                <li><a href="/dashboard" className="text-white hover:text-accent transition-colors">Dashboard</a></li>
                <li><WalletMultiButton style={{}} /></li>
              </ul>
            </nav>
            <button className="md:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </header>
            <div className="max-w-7xl mx-auto">
                {/* Market Overview Section */}
                <div className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-primary p-6 rounded-lg border border-border">
                            <div className="text-2xl font-bold text-accent mb-1">
                                ${markets.reduce((acc, m) => acc + m.volume, 0).toLocaleString()}
                            </div>
                            <div className="text-textSecondary">Total Volume</div>
                        </div>
                        <div className="bg-primary p-6 rounded-lg border border-border">
                            <div className="text-2xl font-bold text-success mb-1">
                                {markets.length}
                            </div>
                            <div className="text-textSecondary">Active Markets</div>
                        </div>
                        <div className="bg-primary p-6 rounded-lg border border-border">
                            <div className="text-2xl font-bold text-warning mb-1">
                                ${markets.reduce((acc, m) => acc + m.liquidity, 0).toLocaleString()}
                            </div>
                            <div className="text-textSecondary">Total Liquidity</div>
                        </div>
                        <div className="bg-primary p-6 rounded-lg border border-border">
                            <div className="text-2xl font-bold text-info mb-1">
                                {new Set(markets.map(m => m.category)).size}
                            </div>
                            <div className="text-textSecondary">Categories</div>
                        </div>
                    </div>

                    {/* Trending Markets */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Trending Markets</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {markets
                                .sort((a, b) => b.volume - a.volume)
                                .slice(0, 3)
                                .map((market) => (
                                    <div
                                        key={market.id}
                                        className="bg-primary p-4 rounded-lg border border-border hover:border-accent transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="font-medium">{market.question}</div>
                                            <div className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-full text-xs">
                                                {market.category}
                                            </div>
                                        </div>
                                        <div className="text-success font-medium">
                                            ${market.volume.toLocaleString()}
                                        </div>
                                        <div className="text-textSecondary text-sm">
                                            24h Volume
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-accentGradient text-transparent bg-clip-text">
                        Prediction Markets
                    </h1>
                    <p className="text-textSecondary mt-2">
                        Explore and participate in prediction markets
                    </p>
                </div>
                
                {/* Search and Filter Section */}
                <div className="mb-6 space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search prediction markets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-3 bg-secondary rounded-lg border border-border focus:border-accent focus:outline-none text-textPrimary placeholder-textSecondary"
                        />
                        <svg
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                    selectedCategory === category
                                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                        : 'bg-secondary text-textSecondary hover:bg-secondary/80'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Markets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMarkets.map((market) => (
                        <div
                            key={market.id}
                            className="bg-primary p-4 rounded-lg border border-border hover:border-accent transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 cursor-pointer"
                            onClick={() => handleMarketSelect(market)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="font-medium text-lg">{market.question}</div>
                                <div className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-full text-xs font-medium">
                                    {market.category}
                                </div>
                            </div>
                            
                            {/* Probability Bar */}
                            <div className="mb-4">
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-danger via-warning to-success transition-all duration-500"
                                        style={{width: `${market.outcomes[0].probability}%`}}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-sm">
                                    <span className="text-textSecondary">Yes: {market.outcomes[0].probability}%</span>
                                    <span className="text-textSecondary">No: {market.outcomes[1].probability}%</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="bg-secondary p-2 rounded-lg">
                                    <div className="text-xs text-textSecondary mb-1">Volume</div>
                                    <div className="font-medium text-success">
                                        ${market.volume.toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-secondary p-2 rounded-lg">
                                    <div className="text-xs text-textSecondary mb-1">Liquidity</div>
                                    <div className="font-medium text-accent">
                                        ${market.liquidity.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                                <div className="text-textSecondary">
                                    Ends: {new Date(market.endDate).toLocaleDateString()}
                                </div>
                                <button 
                                    className="bg-accent text-white px-3 py-1 rounded-lg hover:bg-accent/90 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarketSelect(market);
                                    }}
                                >
                                    Create Position
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMarkets.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-lg font-medium text-textSecondary mb-2">
                            No prediction markets found
                        </div>
                        <div className="text-sm text-textSecondary">
                            Try adjusting your search or filter criteria
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
