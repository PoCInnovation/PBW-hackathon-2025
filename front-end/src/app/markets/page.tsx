"use client";

import React, { useState } from 'react';
import useMarket from '../../hooks/useMarket';

const MarketsPage = () => {
    const { activePredictions: markets, loading, error } = useMarket();
    const [filter, setFilter] = useState('all');
    
    const filteredMarkets = markets || [];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-danger bg-opacity-10 border border-danger text-danger p-4 rounded-lg">
                Error loading markets: {error}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-accent to-accentGradient text-transparent bg-clip-text">
                        Prediction Markets
                    </h1>
                    <p className="text-textSecondary">
                        Explore and participate in prediction markets
                    </p>
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-2 bg-secondary rounded-lg p-1">
                    <button 
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-lg ${filter === 'crypto' ? 'bg-primary' : ''}`}
                        onClick={() => setFilter('crypto')}
                    >
                        Crypto
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-lg ${filter === 'defi' ? 'bg-primary' : ''}`}
                        onClick={() => setFilter('defi')}
                    >
                        DeFi
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarkets.length > 0 ? (
                    filteredMarkets.map(market => (
                        <div key={market.id} className="card hover:border-accent transition-all duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-lg font-medium">{market.question}</h2>
                                <div className="bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full text-sm">
                                    Active
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <div className="h-2 w-full bg-primary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-danger via-warning to-success" 
                                        style={{width: "50%"}}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-sm text-textSecondary">
                                    <span>Current: 50%</span>
                                    <span>24h: <span className="text-success">+5%</span></span>
                                </div>
                            </div>
                            
                            <div className="flex mb-4">
                                <div className="flex-1 text-center border-r border-border">
                                    <p className="text-textSecondary text-sm mb-1">Positive threshold</p>
                                    <p className="text-success font-medium">{market.positiveThreshold}%</p>
                                </div>
                                <div className="flex-1 text-center">
                                    <p className="text-textSecondary text-sm mb-1">Protective threshold</p>
                                    <p className="text-danger font-medium">{market.protectiveThreshold}%</p>
                                </div>
                            </div>
                            
                            <button className="btn btn-primary w-full">
                                Create Position
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-secondary rounded-xl">
                        <p className="text-xl mb-2">No markets found</p>
                        <p className="text-textSecondary">Try changing your filter or check back later</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketsPage;