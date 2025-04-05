"use client";

import React from 'react';
import useMarket from '../../hooks/useMarket'; // Import as default, not named

const MarketsPage = () => {
    const { activePredictions: markets, loading, error } = useMarket();

    if (loading) {
        return <div>Loading markets...</div>;
    }

    if (error) {
        return <div>Error loading markets: {error}</div>;
    }

    return (
        <div className="markets-container">
            <h1>Prediction Markets</h1>
            <div className="markets-grid">
                {markets && markets.length > 0 ? (
                    markets.map(market => (
                        <div key={market.id} className="market-card">
                            <h2>{market.question}</h2>
                            <div className="thresholds">
                                <div className="threshold positive">
                                    <span>Positive Threshold: {market.positiveThreshold}%</span>
                                </div>
                                <div className="threshold protective">
                                    <span>Protective Threshold: {market.protectiveThreshold}%</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No markets available</p>
                )}
            </div>
        </div>
    );
};

export default MarketsPage;