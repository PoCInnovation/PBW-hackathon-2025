import SwapInterface from '../components/SwapInterface';

export default function Home() {
  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accentGradient text-transparent bg-clip-text">
          DeFi meets prediction markets
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          FateFi is your speculation-aware automated risk manager. Deposit tokens, set thresholds, and let your assets flow with market predictions.
        </p>
      </div>
      
      <SwapInterface />
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-success bg-opacity-20 flex items-center justify-center text-success mr-3">
              📈
            </div>
            <h3 className="text-xl font-semibold">Bullish Outcome</h3>
          </div>
          <p className="text-textSecondary">
            If the prediction crosses your positive threshold (e.g. &gt;65%), 
            your funds automatically swap into your bullish target asset.
          </p>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-danger bg-opacity-20 flex items-center justify-center text-danger mr-3">
              📉
            </div>
            <h3 className="text-xl font-semibold">Protective Outcome</h3>
          </div>
          <p className="text-textSecondary">
            If the prediction drops below your protective threshold (e.g. &lt;35%), 
            your funds automatically swap into your safety asset.
          </p>
        </div>
      </div>
    </div>
  );
}