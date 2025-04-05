import React from 'react';

interface MarketCardProps {
    market: {
        id: string;
        question: string;
        currentProbability: number;
        trend: string;
        volume: string;
        liquidity: string;
        expiry: Date;
    };
    onClick: () => void;
}

const MarketCard: React.FC<MarketCardProps> = ({ market, onClick }) => {
    return (
        <div
            className="bg-primary p-4 rounded-lg border border-border hover:border-accent transition-all duration-200 cursor-pointer"
            onClick={onClick}
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
    );
};

export default MarketCard; 