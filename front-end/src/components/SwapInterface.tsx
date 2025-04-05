"use client";

import React, { useState } from 'react';

// Placeholder for token images
const TOKEN_IMAGES: Record<string, string> = {
  "SOL": "https://cryptologos.cc/logos/solana-sol-logo.png?v=026",
  "USDC": "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026",
  "ETH": "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
  "BTC": "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026",
};

type Token = {
  symbol: string;
  name: string;
  image: string;
};

const TOKENS: Token[] = [
  { symbol: "SOL", name: "Solana", image: TOKEN_IMAGES.SOL },
  { symbol: "USDC", name: "USD Coin", image: TOKEN_IMAGES.USDC },
  { symbol: "ETH", name: "Ethereum", image: TOKEN_IMAGES.ETH },
  { symbol: "BTC", name: "Bitcoin", image: TOKEN_IMAGES.BTC },
];

const MARKETS = [
  "Will ETH be above $4k by June 2025?",
  "Will BTC reach $100k by end of 2025?",
  "Will SOL stay above $150 for Q2 2025?"
];

const SwapInterface = () => {
  const [fromToken, setFromToken] = useState<Token>(TOKENS[0]);
  const [targetToken, setTargetToken] = useState<Token>(TOKENS[2]); 
  const [downsideToken, setDownsideToken] = useState<Token>(TOKENS[1]); 
  const [amount, setAmount] = useState<string>('1.0');
  const [positiveThreshold, setPositiveThreshold] = useState<number>(65);
  const [protectiveThreshold, setProtectiveThreshold] = useState<number>(35);
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string>(MARKETS[0]);

  const handleTokenSelect = (token: Token, type: string) => {
    if (type === 'from') setFromToken(token);
    else if (type === 'target') setTargetToken(token);
    else if (type === 'downside') setDownsideToken(token);
    setIsTokenSelectOpen(null);
  };

  return (
    <div className="swap-card">
      <h2 className="text-xl font-semibold mb-6">FateFi Swap</h2>
      
      {/* From token */}
      <div className="mb-6">
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
            className="token-selector"
            onClick={() => setIsTokenSelectOpen('from')}
          >
            <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-gray-700">
              <img 
                src={fromToken.image} 
                alt={fromToken.symbol}
                className="w-full h-full object-cover"
              />
            </div>
            <span>{fromToken.symbol}</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Prediction Market */}
      <div className="mb-6">
        <label className="block text-textSecondary mb-2">Prediction Market</label>
        <div className="p-3 bg-primary rounded-lg border border-border">
          <select 
            className="w-full bg-transparent text-white focus:outline-none"
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
          >
            {MARKETS.map(market => (
              <option key={market} value={market}>{market}</option>
            ))}
          </select>
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
        
        <div className="threshold-slider">
          <div 
            className="absolute h-full bg-gradient-to-r from-danger via-warning to-success rounded-full"
            style={{ 
              left: 0, 
              width: "100%", 
              opacity: 0.3 
            }}
          />
          <div 
            className="absolute w-4 h-4 -mt-1 rounded-full bg-danger border-2 border-white"
            style={{ left: `${protectiveThreshold}%` }}
          />
          <div 
            className="absolute w-4 h-4 -mt-1 rounded-full bg-success border-2 border-white"
            style={{ left: `${positiveThreshold}%` }}
          />
        </div>
      </div>

      {/* Target Token */}
      <div className="mb-6">
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
      
      {/* Submit button */}
      <button className="btn btn-primary w-full py-3 text-lg">
        Create Prediction Position
      </button>
      
      {/* Token selector modal */}
      {isTokenSelectOpen && (
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
                  className="flex items-center p-2 hover:bg-primary rounded-lg cursor-pointer"
                  onClick={() => handleTokenSelect(token, isTokenSelectOpen)}
                >
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapInterface;