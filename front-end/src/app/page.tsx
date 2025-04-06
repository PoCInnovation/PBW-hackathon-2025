"use client";

import React, { useState, useEffect } from 'react';
import { useTokenData } from '../hooks/useTokenData';
import { usePredictionMarkets } from '../hooks/usePredictionMarkets';
import StepperSwap from '../components/swap/StepperSwap';
import TokenPairInfo from '../components/swap/TokenPairInfo';
import { useSearchParams } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { tokens, loading: tokenLoading, error: tokenError } = useTokenData();
    const { markets, loading: marketsLoading, error: marketsError } = usePredictionMarkets();
    const [fromToken, setFromToken] = useState<any>(null);
    const [targetToken, setTargetToken] = useState<any>(null);
    const [selectedMarket, setSelectedMarket] = useState<any>(null);

    // Function to get market category
    const getCategory = (market: any): string => {
        // Try to extract category from description or question
        const text = (market.description + ' ' + market.question).toLowerCase();
        if (text.includes('crypto') || text.includes('bitcoin') || text.includes('ethereum')) return 'crypto';
        if (text.includes('sports') || text.includes('mlb') || text.includes('nfl')) return 'sports';
        if (text.includes('politics') || text.includes('election')) return 'politics';
        if (text.includes('technology') || text.includes('ai')) return 'technology';
        return 'other';
    };

    // Initialize tokens when data is loaded
    useEffect(() => {
        if (tokens && tokens.length >= 3) {
            setFromToken(tokens[0]);
            setTargetToken(tokens[2]);
        }
    }, [tokens]);

    // Handle market selection from URL
    useEffect(() => {
        const marketId = searchParams.get('market');
        if (marketId && markets.length > 0) {
            const market = markets.find(m => m.id === marketId);
            if (market) {
                setSelectedMarket(market);
            }
        }
    }, [searchParams, markets]);

    if (tokenLoading || marketsLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (tokenError || marketsError) {
        return (
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-primary p-6 rounded-lg border border-border">
                        <div className="text-center">
                            <div className="text-xl font-semibold mb-2 text-danger">Unable to Load Data</div>
                            <div className="text-textSecondary mb-4">
                                We're currently experiencing issues loading the data. Please try again later.
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
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-accentGradient text-transparent bg-clip-text">FateFi</h1>
            </Link>
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
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Panel - Price Chart */}
                <div className="bg-primary p-4 rounded-lg border border-border">
                    {fromToken && targetToken ? (
                        <TokenPairInfo
                            fromToken={fromToken}
                            targetToken={targetToken}
                        />
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-lg font-medium text-textSecondary mb-2">
                                Select a prediction market to view price comparison
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Swap Interface */}
                <div className="bg-primary p-4 rounded-lg border border-border">
                    <StepperSwap
                        fromToken={fromToken}
                        targetToken={targetToken}
                        onFromTokenChange={setFromToken}
                        onTargetTokenChange={setTargetToken}
                        selectedMarket={selectedMarket}
                        onMarketChange={setSelectedMarket}
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary p-4 rounded-lg border border-border">
                    <div className="text-sm text-textSecondary mb-1">Total Volume</div>
                    <div className="text-xl font-medium text-accent">
                        ${markets.reduce((acc, m) => {
                            const volume = parseFloat(m.volume);
                            return acc + (isNaN(volume) ? 0 : volume);
                        }, 0).toLocaleString()}
                    </div>
                </div>
                <div className="bg-primary p-4 rounded-lg border border-border">
                    <div className="text-sm text-textSecondary mb-1">Active Markets</div>
                    <div className="text-xl font-medium text-success">
                        {markets.length}+
                    </div>
                </div>
                <div className="bg-primary p-4 rounded-lg border border-border">
                    <div className="text-sm text-textSecondary mb-1">Total Liquidity</div>
                    <div className="text-xl font-medium text-warning">
                        ${markets.reduce((acc, m) => {
                            const liquidity = parseFloat(m.liquidity);
                            return acc + (isNaN(liquidity) ? 0 : liquidity);
                        }, 0).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Popular Markets Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Popular Markets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {markets
                        .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
                        .slice(0, 3)
                        .map((market) => (
                            <div 
                                key={market.id}
                                className="bg-primary p-4 rounded-lg border border-border hover:border-accent transition-all duration-200 cursor-pointer"
                                onClick={() => {
                                    setSelectedMarket(market);
                                    router.push(`/?market=${encodeURIComponent(market.id)}`);
                                }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="font-medium">{market.question}</div>
                                    <div className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-full text-xs">
                                        {getCategory(market)}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-danger via-warning to-success" 
                                            style={{
                                                width: market.outcomePrices 
                                                    ? `${parseFloat(JSON.parse(market.outcomePrices)[0]) * 100}%`
                                                    : '50%'
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-sm">
                                        <span className="text-textSecondary">
                                            Yes: {market.outcomePrices 
                                                ? `${(parseFloat(JSON.parse(market.outcomePrices)[0]) * 100).toFixed(1)}%`
                                                : '50%'}
                                        </span>
                                        <span className="text-textSecondary">
                                            No: {market.outcomePrices 
                                                ? `${(parseFloat(JSON.parse(market.outcomePrices)[1]) * 100).toFixed(1)}%`
                                                : '50%'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-success font-medium">
                                    ${parseFloat(market.volume).toLocaleString()} Volume
                                </div>
                            </div>
                        ))}
                </div>
            </div>
          </div>
        </div>
    );
}
