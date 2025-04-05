"use client";

import { useState } from 'react';
import StepperSwap from '../components/ui/StepperSwap';
import MarketInfoPanel from '../components/ui/MarketInfoPanel';

export default function Home() {
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [fromToken, setFromToken] = useState(null);
  const [targetToken, setTargetToken] = useState(null);
  const [thresholdsEnabled, setThresholdsEnabled] = useState(false);
  const [positiveThreshold, setPositiveThreshold] = useState(65);
  const [selectedOutcome, setSelectedOutcome] = useState('Yes');

  // Handler to update state from StepperSwap
  const handleSwapStateChange = (state: any) => {
    setSelectedMarket(state.selectedMarket);
    setCurrentStep(state.currentStep);
    setFromToken(state.fromToken);
    setTargetToken(state.targetToken);
    setThresholdsEnabled(state.thresholdsEnabled);
    setPositiveThreshold(state.positiveThreshold);
    setSelectedOutcome(state.selectedOutcome);
  };

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
        <MarketInfoPanel 
        market={selectedMarket}
        currentStep={currentStep}
        fromToken={fromToken}
        targetToken={targetToken}
        thresholdsEnabled={thresholdsEnabled}
        positiveThreshold={positiveThreshold}
        selectedOutcome={selectedOutcome}
      />
        </div>
        <div className="order-1 lg:order-2">
          <StepperSwap onStateChange={handleSwapStateChange} />
        </div>
      </div>
    </div>
  );
}