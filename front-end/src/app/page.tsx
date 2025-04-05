'use client';

import React from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to FateFi</h1>
            <p>FateFi is where DeFi meets prediction markets.</p>
            <p>Deposit tokens, choose a market, and manage your risks effectively.</p>
            <a href="/markets">Explore Markets</a>
            <a href="/dashboard">Go to Dashboard</a>
            <WalletMultiButton style={{}} />
        </div>
    );
};

export default HomePage;
