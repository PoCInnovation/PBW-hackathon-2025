"use client";

import React from 'react';
import {useWallet} from '../../hooks/useWallet';
import useMarket from '../../hooks/useMarket';

const DashboardPage = () => {
    const {walletAddress, balance} = useWallet();
    const {activePredictions, loading} = useMarket();

    return (
        <div className="dashboard">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-accent to-accentGradient text-transparent bg-clip-text">Your
                Dashboard</h1>

            <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="bg-primary p-4 rounded-lg mb-4">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                            <p className="text-textSecondary mb-1">Wallet Address</p>
                            <p className="font-mono break-all">{walletAddress || 'Not connected'}</p>
                        </div>
                        <div>
                            <p className="text-textSecondary mb-1">Balance</p>
                            <p className="text-2xl font-medium">{balance} <span className="text-accent">SOL</span></p>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <button className="btn btn-primary">Deposit</button>
                    <button className="btn btn-secondary">Withdraw</button>
                </div>
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Your Active Positions</h2>
                    <button className="btn btn-primary">Create New Position</button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                    </div>
                ) : activePredictions && activePredictions.length > 0 ? (
                    <div className="space-y-4">
                        {activePredictions.map(prediction => (
                            <div key={prediction.id} className="prediction-card">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-medium">{prediction.question}</h3>
                                    <div className="bg-primary px-3 py-1 rounded-full text-sm">
                                        Active
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="h-2 w-full bg-primary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-danger via-warning to-success"
                                            style={{width: "50%"}}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-sm">
                                        <span>Current probability: 50%</span>
                                        <span>Target: {prediction.positiveThreshold}%</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-primary p-3 rounded-lg">
                                        <p className="text-textSecondary text-sm mb-1">If
                                            prediction &gt; {prediction.positiveThreshold}%</p>
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-gray-700">
                                                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026"
                                                     alt="ETH" className="w-full h-full object-cover"/>
                                            </div>
                                            <p>Swap to <span className="text-success font-medium">ETH</span></p>
                                        </div>
                                    </div>
                                    <div className="bg-primary p-3 rounded-lg">
                                        <p className="text-textSecondary text-sm mb-1">If
                                            prediction &lt; {prediction.protectiveThreshold}%</p>
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-gray-700">
                                                <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026"
                                                     alt="USDC" className="w-full h-full object-cover"/>
                                            </div>
                                            <p>Swap to <span className="text-danger font-medium">USDC</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-primary rounded-xl">
                        <p className="text-xl mb-4">No active predictions found</p>
                        <p className="text-textSecondary mb-6">Create your first position to get started</p>
                        <button className="btn btn-primary">Create Position</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;