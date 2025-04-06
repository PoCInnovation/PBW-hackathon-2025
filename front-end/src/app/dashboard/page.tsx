"use client";

import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import useMarket from '../../hooks/useMarket';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getTasks } from '../../../scripts/get-tasks';

const DashboardPage = () => {
    const [balance, setBalance] = useState<number>(0);
    const [tasks, setTasks] = useState<any>(0);
    const { activePredictions, loading } = useMarket();
    const [isClient, setIsClient] = useState(false);
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const wal = useWallet();

    useEffect(() => {
      async function fetchBalance() {
        if (publicKey && wal.connected) {
          const newBalance = await connection.getBalance(publicKey);
          setBalance(newBalance / LAMPORTS_PER_SOL);
          console.log("arah");
          await getTasks(wal);
          console.log("arah");
        }
      }
      fetchBalance();
    }, [publicKey]);

    useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      return null;
    }
    return (
        <div className="dashboard">
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

        {/* Dashboard Overview */}
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-accent to-accentGradient text-transparent bg-clip-text">
            Your Dashboard
          </h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary p-6 rounded-lg border border-border">
              <div className="text-2xl font-bold text-accent mb-1">
                {balance.toFixed(2)}
              </div>
              <div className="text-textSecondary">SOL Balance</div>
            </div>
            <div className="bg-primary p-6 rounded-lg border border-border">
              <div className="text-2xl font-bold text-success mb-1">
                {activePredictions?.length || 0}
              </div>
              <div className="text-textSecondary">Active Positions</div>
            </div>
            <div className="bg-primary p-6 rounded-lg border border-border">
              <div className="text-2xl font-bold text-warning mb-1">
                $12,450
              </div>
              <div className="text-textSecondary">Total Value</div>
            </div>
            <div className="bg-primary p-6 rounded-lg border border-border">
              <div className="text-2xl font-bold text-info mb-1">
                +15.4%
              </div>
              <div className="text-textSecondary">30d Performance</div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="bg-primary p-4 rounded-lg mb-4">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                        <p className="text-textSecondary mb-1">Wallet Address</p>
                        <p className="font-mono break-all">{publicKey?.toString() || 'Not connected'}</p>
                    </div>
                    <div>
                        <p className="text-textSecondary mb-1">Balance</p>
                        <p className="text-2xl font-medium">{balance || 0} <span className="text-accent">SOL</span></p>
                    </div>
                </div>
            </div>
            <div className="flex space-x-4">
                <button className="btn btn-primary">Deposit</button>
                <button className="btn btn-secondary">Withdraw</button>
            </div>
          </div>

          {/* Active Positions Card */}
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

          {/* Transaction History */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <div className="flex gap-2">
                <button className="btn btn-secondary">Export</button>
                <button className="btn btn-primary">Filter</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-3 text-textSecondary">Date</th>
                    <th className="pb-3 text-textSecondary">Type</th>
                    <th className="pb-3 text-textSecondary">Market</th>
                    <th className="pb-3 text-textSecondary">Amount</th>
                    <th className="pb-3 text-textSecondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-4">2024-04-05</td>
                    <td className="py-4">
                      <span className="bg-success bg-opacity-20 text-success px-2 py-1 rounded-full text-xs">
                        Buy
                      </span>
                    </td>
                    <td className="py-4">ETH {'>'} $3000</td>
                    <td className="py-4">0.5 ETH</td>
                    <td className="py-4">
                      <span className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-4">2024-04-04</td>
                    <td className="py-4">
                      <span className="bg-danger bg-opacity-20 text-danger px-2 py-1 rounded-full text-xs">
                        Sell
                      </span>
                    </td>
                    <td className="py-4">BTC {'>'} $50k</td>
                    <td className="py-4">0.1 BTC</td>
                    <td className="py-4">
                      <span className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-textSecondary">
                Showing 2 of 15 transactions
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary">Previous</button>
                <button className="btn btn-primary">Next</button>
              </div>
            </div>
          </div>
        </div>
        </div>
    );
};

export default DashboardPage;
