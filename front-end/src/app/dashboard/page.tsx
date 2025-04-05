"use client";

import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import useMarket from '../../hooks/useMarket';

const DashboardPage = () => {
    const { walletAddress, balance } = useWallet();
    const { activePredictions, loading } = useMarket();

    return (
        <div className="dashboard">
            <h1>User Dashboard</h1>
            <div className="account-info">
                <h2>Account Information</h2>
                <p>Wallet Address: {walletAddress || 'Not connected'}</p>
                <p>Balance: {balance} SOL</p>
            </div>
            <div className="active-predictions">
                <h2>Active Predictions</h2>
                {loading ? (
                    <p>Loading predictions...</p>
                ) : activePredictions && activePredictions.length > 0 ? (
                    <div>
                        {activePredictions.map(prediction => (
                            <div key={prediction.id} className="prediction-card">
                                <h3>{prediction.question}</h3>
                                <p>Positive threshold: {prediction.positiveThreshold}%</p>
                                <p>Protective threshold: {prediction.protectiveThreshold}%</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No active predictions found.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;