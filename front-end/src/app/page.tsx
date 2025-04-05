"use client";

import { useState } from 'react';
import StepperSwap from '../components/ui/StepperSwap';
import MarketInfoPanel from '../components/ui/MarketInfoPanel';

export default function Home() {
  const [selectedMarket, setSelectedMarket] = useState(null);

  return (
    <div className="py-8">
      <div className="text-center mb-12">
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