"use client";

import React, { useState, useEffect } from 'react';
import { useTokenData } from '../hooks/useTokenData';
import { usePredictionMarkets } from '../hooks/usePredictionMarkets';
import StepperSwap from '../components/swap/StepperSwap';
import TokenPairInfo from '../components/swap/TokenPairInfo';
import { useSearchParams } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
    const searchParams = useSearchParams();
    const { tokenData, loading: tokenLoading, error: tokenError } = useTokenData();
    const { markets, loading: marketsLoading, error: marketsError } = usePredictionMarkets();
    const [fromToken, setFromToken] = useState<any>(null);
    const [targetToken, setTargetToken] = useState<any>(null);
    const [selectedMarket, setSelectedMarket] = useState<any>(null);

    // Initialize tokens when data is loaded
    useEffect(() => {
        if (tokenData && tokenData.length >= 3) {
            setFromToken(tokenData[0]);
            setTargetToken(tokenData[2]);
        }
    }, [tokenData]);

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
            </div>
        </div>
    );
}
