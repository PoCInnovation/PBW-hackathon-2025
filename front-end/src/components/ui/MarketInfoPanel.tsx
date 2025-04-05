"use client";

import React from 'react';
import TokenPairInfo from './TokenPairInfo';

interface MarketInfoPanelProps {
  market: any;
  currentStep: number;
  fromToken?: any;
  targetToken?: any;
  thresholdsEnabled?: boolean;
  positiveThreshold?: number;
  selectedOutcome?: string;
}

const MarketInfoPanel = ({ 
  market, 
  currentStep, 
  fromToken, 
  targetToken, 
  thresholdsEnabled,
  positiveThreshold,
  selectedOutcome
}: MarketInfoPanelProps) => {
  
  // Step 1: Show market information or default content
  if (currentStep === 1 || !market) {
    if (!market) {
      return (
        <div className="card h-full flex flex-col justify-center items-center py-12">
          <div className="text-6xl mb-4">👈</div>
          <h3 className="text-xl font-medium mb-2">Select a prediction market</h3>
          <p className="text-textSecondary text-center max-w-xs">
            Choose a market to see detailed information and configure your position
          </p>
        </div>
      );
    }

    return (
      <div className="card h-full">
        <h2 className="text-xl font-semibold mb-4">Market Information</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">{market.question}</h3>
          <p className="text-textSecondary mb-4">{market.description}</p>
          
          <div className="bg-primary p-4 rounded-lg">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-textSecondary">Current Probability</span>
                <span className="font-medium">{market.currentProbability}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-danger via-warning to-success" 
                  style={{width: `${market.currentProbability}%`}}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-textSecondary text-sm">24h Change</div>
                <div className={market.trend.startsWith('+') ? 'text-success' : 'text-danger'}>
                  {market.trend}
                </div>
              </div>
              <div>
                <div className="text-textSecondary text-sm">Volume</div>
                <div>{market.volume}</div>
              </div>
              <div>
                <div className="text-textSecondary text-sm">Liquidity</div>
                <div>{market.liquidity}</div>
              </div>
              <div>
                <div className="text-textSecondary text-sm">Expires</div>
                <div>{market.expiry.toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <h3 className="font-medium mb-3">How FateFi Works</h3>
          <div className="space-y-4">
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">1</div>
              <div>
                <p className="font-medium">Choose a prediction market</p>
                <p className="text-textSecondary text-sm">Select from various markets with real-time probabilities</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">2</div>
              <div>
                <p className="font-medium">Set your thresholds</p>
                <p className="text-textSecondary text-sm">Define when to swap to bullish assets or protect your position</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">3</div>
              <div>
                <p className="font-medium">Automated management</p>
                <p className="text-textSecondary text-sm">FateFi automatically swaps assets based on prediction market outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Step 2: Show token pair information
return (
  <TokenPairInfo 
    market={market}
    fromToken={fromToken}
    targetToken={targetToken}
    thresholdsEnabled={thresholdsEnabled}
    positiveThreshold={positiveThreshold}
    selectedOutcome={selectedOutcome}
  />
);
}

export default MarketInfoPanel;