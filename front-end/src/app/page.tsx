"use client";

import { useState } from 'react';
import StepperSwap from '../components/ui/StepperSwap';
import MarketInfoPanel from '../components/ui/MarketInfoPanel';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  const [selectedMarket, setSelectedMarket] = useState(null);

  return (
    <div className="home">
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
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accentGradient text-transparent bg-clip-text">
          DeFi meets prediction markets
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          FateFi automates your trading strategy based on market predictions. Create your first position in minutes.
        </p>
      </div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-2 lg:order-1">
          <MarketInfoPanel market={selectedMarket} />
        </div>
        <div className="order-1 lg:order-2">
          <StepperSwap />
        </div>
      </div>
    </div>
  );
}
