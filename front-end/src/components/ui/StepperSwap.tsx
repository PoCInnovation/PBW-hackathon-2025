"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Mock prediction markets
const MARKETS = [
  {
    id: 'btc-price',
    question: 'Will BTC be above $60k by end of April 2025?',
    description: 'This market resolves to YES if the price of Bitcoin exceeds $60,000 USD on any major exchange by 11:59 PM UTC on April 30, 2025.',
    currentProbability: 65,
    trend: '+3%',
    volume: '1.2M USDC',
    liquidity: '4.5M USDC',
    createdAt: new Date('2025-01-15'),
    expiry: new Date('2025-04-30')
  },
  {
    id: 'eth-price',
    question: 'Will ETH be above $4k by June 2025?',
    description: 'This market resolves to YES if the price of Ethereum exceeds $4,000 USD on any major exchange by 11:59 PM UTC on June 30, 2025.',
    currentProbability: 72,
    trend: '+5%',
    volume: '890K USDC',
    liquidity: '3.2M USDC',
    createdAt: new Date('2025-01-10'),
    expiry: new Date('2025-06-30')
  },
  {
    id: 'sol-price',
    question: 'Will SOL stay above $150 for Q2 2025?',
    description: 'This market resolves to YES if the price of Solana remains above $150 USD for the entire second quarter of 2025 (April 1 to June 30).',
    currentProbability: 42,
    trend: '-2%',
    volume: '750K USDC',
    liquidity: '2.8M USDC',
    createdAt: new Date('2025-01-20'),
    expiry: new Date('2025-06-30')
  },
  {
    id: 'ftx-relaunch',
    question: 'Will FTX relaunch in any form before 2026?',
    description: 'This market resolves to YES if FTX or a successor exchange under the same brand relaunches operations in any jurisdiction before January 1, 2026.',
    currentProbability: 23,
    trend: '+1%',
    volume: '420K USDC',
    liquidity: '1.5M USDC',
    createdAt: new Date('2025-02-01'),
    expiry: new Date('2025-12-31')
  }
];

// Mock tokens
const TOKENS = [
  { symbol: "SOL", name: "Solana", image: "https://cryptologos.cc/logos/solana-sol-logo.png?v=026", balance: "12.5" },
  { symbol: "USDC", name: "USD Coin", image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026", balance: "1250.00" },
  { symbol: "ETH", name: "Ethereum", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026", balance: "0.75" },
  { symbol: "BTC", name: "Bitcoin", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026", balance: "0.05" },
];

const StepperSwap = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [amount, setAmount] = useState('1.0');
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [targetToken, setTargetToken] = useState(TOKENS[2]);
  const [downsideToken, setDownsideToken] = useState(TOKENS[1]);
  const [positiveThreshold, setPositiveThreshold] = useState(65);
  const [protectiveThreshold, setProtectiveThreshold] = useState(35);
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState<string | null>(null);

  // Filter markets based on search term
  const filteredMarkets = MARKETS.filter(market => 
    market.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenSelect = (token: any, type: string) => {
    if (type === 'from') setFromToken(token);
    else if (type === 'target') setTargetToken(token);
    else if (type === 'downside') setDownsideToken(token);
    setIsTokenSelectOpen(null);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleMarketSelect = (market: any) => {
    setSelectedMarket(market);
    nextStep();
  };

  // Step 1: Select Prediction Market
  const renderStepOne = () => (
    <div className="step-content">
      <h2 className="text-xl font-semibold mb-4">Choose a Prediction Market</h2>
      
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-primary border border-border rounded-lg px-4 py-2 w-full text-white focus:outline-none focus:border-accent"
          />
          <span className="absolute right-3 top-2 text-textSecondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredMarkets.length > 0 ? (
          filteredMarkets.map(market => (
            <div 
              key={market.id}
              className="bg-primary p-4 rounded-lg border border-border hover:border-accent transition-all duration-200 cursor-pointer"
              onClick={() => handleMarketSelect(market)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{market.question}</h3>
                <div className="flex items-center bg-secondary px-2 py-1 rounded-full text-xs">
                  <span className={market.trend.startsWith('+') ? 'text-success' : 'text-danger'}>
                    {market.trend}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-danger via-warning to-success" 
                    style={{width: `${market.currentProbability}%`}}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-textSecondary">Current: {market.currentProbability}%</span>
                  <span className="text-sm text-textSecondary">Exp: {market.expiry.toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-4 text-xs">
                <span className="text-textSecondary">Vol: {market.volume}</span>
                <span className="text-textSecondary">Liq: {market.liquidity}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-textSecondary">
            No prediction markets found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );

  // Step 2: Configure Position
  const renderStepTwo = () => (
    <div className="step-content">
      <h2 className="text-xl font-semibold mb-4">Configure Your Position</h2>
      
      {/* Selected market info */}
      <div className="bg-primary p-3 rounded-lg mb-6 border border-border">
        <h3 className="font-medium mb-1">{selectedMarket?.question}</h3>
        <div className="flex justify-between text-sm text-textSecondary">
          <span>Current: {selectedMarket?.currentProbability}%</span>
          <span>Exp: {selectedMarket?.expiry.toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* From token */}
      <div className="mb-4">
        <label className="block text-textSecondary mb-2">From</label>
        <div className="flex bg-primary rounded-lg p-3 border border-border">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent text-white flex-grow focus:outline-none"
            placeholder="0.0"
          />
          <div 
            className="flex items-center bg-primary rounded-lg p-2 cursor-pointer hover:bg-opacity-80"
            onClick={() => setIsTokenSelectOpen('from')}
          >
            <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-gray-700">
              <img 
                src={fromToken.image} 
                alt={fromToken.symbol}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mr-2">
              <div>{fromToken.symbol}</div>
              <div className="text-xs text-textSecondary">Balance: {fromToken.balance}</div>
            </div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Thresholds */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-textSecondary">Threshold Settings</label>
          <div>
            <span className="text-success mr-4">Positive: {positiveThreshold}%</span>
            <span className="text-danger">Protective: {protectiveThreshold}%</span>
          </div>
        </div>
        
        <div className="relative h-2 w-full bg-primary rounded-full mb-6">
          <div 
            className="absolute h-full bg-gradient-to-r from-danger via-warning to-success rounded-full opacity-30"
            style={{ width: "100%" }}
          />
          <input 
            type="range"
            min="0"
            max="100"
            value={protectiveThreshold}
            onChange={(e) => setProtectiveThreshold(parseInt(e.target.value))}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
          />
          <input 
            type="range"
            min="0"
            max="100"
            value={positiveThreshold}
            onChange={(e) => setPositiveThreshold(parseInt(e.target.value))}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
          />
          <div 
            className="absolute w-4 h-4 -mt-1 -ml-2 rounded-full bg-danger border-2 border-white"
            style={{ left: `${protectiveThreshold}%` }}
          />
          <div 
            className="absolute w-4 h-4 -mt-1 -ml-2 rounded-full bg-success border-2 border-white"
            style={{ left: `${positiveThreshold}%` }}
          />
        </div>
      </div>

      {/* Target Token */}
      <div className="mb-4">
        <label className="flex justify-between text-textSecondary mb-2">
          <span>Target Token (If prediction &gt; {positiveThreshold}%)</span>
          <span className="text-success">Bullish</span>
        </label>
        <div 
          className="flex items-center justify-between bg-primary rounded-lg p-3 border border-border cursor-pointer"
          onClick={() => setIsTokenSelectOpen('target')}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-gray-700">
              <img 
                src={targetToken.image} 
                alt={targetToken.symbol}
                className="w-full h-full object-cover"  
              />
            </div>
            <span>{targetToken.name}</span>
          </div>
          <span>{targetToken.symbol}</span>
        </div>
      </div>
      
      {/* Downside Plan */}
      <div className="mb-6">
        <label className="flex justify-between text-textSecondary mb-2">
          <span>Downside Plan (If prediction &lt; {protectiveThreshold}%)</span>
          <span className="text-danger">Protection</span>
        </label>
        <div 
          className="flex items-center justify-between bg-primary rounded-lg p-3 border border-border cursor-pointer"
          onClick={() => setIsTokenSelectOpen('downside')}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-gray-700">
              <img 
                src={downsideToken.image} 
                alt={downsideToken.symbol} 
                className="w-full h-full object-cover"
              />
            </div>
            <span>{downsideToken.name}</span>
          </div>
          <span>{downsideToken.symbol}</span>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button 
          className="btn btn-secondary flex-1"
          onClick={prevStep}
        >
          Back
        </button>
        <button className="btn btn-primary flex-1">
          Create Position
        </button>
      </div>
    </div>
  );

  // Token selector modal
  const renderTokenModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondary rounded-xl p-4 w-80 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Select Token</h3>
          <button 
            onClick={() => setIsTokenSelectOpen(null)}
            className="text-textSecondary hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2">
          {TOKENS.map(token => (
            <div 
              key={token.symbol}
              className="flex items-center justify-between p-2 hover:bg-primary rounded-lg cursor-pointer"
              onClick={() => handleTokenSelect(token, isTokenSelectOpen || '')}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 mr-3 rounded-full overflow-hidden bg-gray-700">
                  <img 
                    src={token.image} 
                    alt={token.symbol} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-textSecondary">{token.symbol}</div>
                </div>
              </div>
              <div className="text-sm text-textSecondary">{token.balance}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Steps indicator
  const renderStepsIndicator = () => (
    <div className="flex mb-6">
      <div className={`flex-1 text-center pb-4 relative ${currentStep >= 1 ? 'text-accent' : 'text-textSecondary'}`}>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${currentStep >= 1 ? 'bg-accent' : 'bg-primary'}`}></div>
        <span className={`inline-block w-8 h-8 rounded-full mb-2 text-white ${currentStep >= 1 ? 'bg-accent' : 'bg-primary'}`}>1</span>
        <div>Select Market</div>
      </div>
      <div className={`flex-1 text-center pb-4 relative ${currentStep >= 2 ? 'text-accent' : 'text-textSecondary'}`}>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${currentStep >= 2 ? 'bg-accent' : 'bg-primary'}`}></div>
        <span className={`inline-block w-8 h-8 rounded-full mb-2 text-white ${currentStep >= 2 ? 'bg-accent' : 'bg-primary'}`}>2</span>
        <div>Configure</div>
      </div>
    </div>
  );

  return (
    <div className="card max-w-md w-full mx-auto">
      {renderStepsIndicator()}
      
      {currentStep === 1 && renderStepOne()}
      {currentStep === 2 && renderStepTwo()}
      
      {isTokenSelectOpen && renderTokenModal()}
    </div>
  );
};

export default StepperSwap;