"use client";

import React from 'react';

// Mock chart data
const generateMockChartData = () => {
  const data = [];
  let value = 100 + Math.random() * 20;
  
  for (let i = 0; i < 30; i++) {
    // Random walk with some volatility
    value = value + (Math.random() - 0.5) * 8;
    data.push({
      x: i,
      y: value
    });
  }
  
  return data;
};

interface TokenPairInfoProps {
  market: any;
  fromToken: any;
  targetToken: any;
  thresholdsEnabled?: boolean;
  positiveThreshold?: number;
  selectedOutcome?: string;
}

const TokenPairInfo = ({ 
  market, 
  fromToken, 
  targetToken, 
  thresholdsEnabled, 
  positiveThreshold,
  selectedOutcome = 'Yes',
}: TokenPairInfoProps) => {
  
  const chartData = generateMockChartData();
  const priceChange = "+2.5%";
  const isPriceUp = true;

  // Calculate some mock data
  const price = (10 + Math.random() * 5).toFixed(2);
  const volume24h = `$${(1000000 + Math.random() * 2000000).toFixed(0)}`;
  const totalLiquidity = `$${(5000000 + Math.random() * 10000000).toFixed(0)}`;
  
  // Calculate the highest and lowest points in the chart
  const maxValue = Math.max(...chartData.map(d => d.y));
  const minValue = Math.min(...chartData.map(d => d.y));
  
  // Normalize values for SVG path (0 to 100 scale)
  const normalizeY = (value: number) => {
    return 100 - ((value - minValue) / (maxValue - minValue) * 100);
  };
  
  // Create SVG path data
  const pathData = chartData.map((point, i) => {
    const x = (i / (chartData.length - 1)) * 100;
    const y = normalizeY(point.y);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="card h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-secondary overflow-hidden z-10">
              <img 
                src={fromToken.image} 
                alt={fromToken.symbol}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-secondary overflow-hidden">
              <img 
                src={targetToken.image} 
                alt={targetToken.symbol}
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold ml-2">
            {fromToken.symbol}/{targetToken.symbol}
          </h2>
        </div>
        <div className={`px-2 py-1 rounded-full text-sm ${isPriceUp ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
          {priceChange}
        </div>
      </div>
      
      {/* Price chart */}
      <div className="relative h-40 w-full mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={pathData}
            fill="none"
            stroke={isPriceUp ? "#10B981" : "#EF4444"}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPriceUp ? "#10B981" : "#EF4444"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPriceUp ? "#10B981" : "#EF4444"} stopOpacity="0" />
          </linearGradient>
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#gradient)"
            stroke="none"
          />
        </svg>
      </div>
      
      {/* Price statistics */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-primary p-4 rounded-lg">
          <div className="text-textSecondary text-sm mb-1">Current Price</div>
          <div className="flex items-end">
            <div className="text-2xl font-medium">{price}</div>
            <div className={`ml-2 text-sm ${isPriceUp ? 'text-success' : 'text-danger'}`}>{priceChange}</div>
          </div>
        </div>
        <div className="bg-primary p-4 rounded-lg">
          <div className="text-textSecondary text-sm mb-1">24h Volume</div>
          <div className="text-2xl font-medium">{volume24h}</div>
        </div>
      </div>
      
      {/* Market connection to prediction */}
      <div className="bg-primary p-4 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">Prediction Market Integration</h3>
          <div className="text-sm text-textSecondary">{market.currentProbability}%</div>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-danger via-warning to-success" 
            style={{width: `${market.currentProbability}%`}}
          ></div>
        </div>
        <p className="text-sm text-textSecondary mb-3">
          {market.question}
        </p>
        
        {thresholdsEnabled && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center bg-secondary bg-opacity-50 rounded-lg p-2">
              <div className="w-6 h-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-textSecondary">If &gt; Threshold</div>
                <div className="text-sm">{targetToken.symbol}</div>
              </div>
            </div>
            <div className="flex items-center bg-secondary bg-opacity-50 rounded-lg p-2">
              <div className="w-6 h-6 rounded-full bg-danger bg-opacity-20 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-danger" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-textSecondary">If &lt; Threshold</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Token info */}
      <div className="border-t border-border pt-4">
        <h3 className="font-medium mb-3">Token Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-textSecondary">Total Liquidity:</span>
            <span>{totalLiquidity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">Swap Fee:</span>
            <span>0.35%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">Oracle Source:</span>
            <span>Chainlink, Pyth</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPairInfo;