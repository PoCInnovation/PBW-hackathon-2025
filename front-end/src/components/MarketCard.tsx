import React from 'react';

interface MarketCardProps {
    marketId: string;
    title: string;
    description: string;
    positiveThreshold: number;
    negativeThreshold: number;
    onSelect: (marketId: string) => void;
}

const MarketCard: React.FC<MarketCardProps> = ({
                                                   marketId,
                                                   title,
                                                   description,
                                                   positiveThreshold,
                                                   negativeThreshold,
                                                   onSelect
                                               }) => {
    return (
        <div className="market-card" onClick={() => onSelect(marketId)}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="thresholds">
                <span>Positive Threshold: {positiveThreshold}%</span>
                <span>Negative Threshold: {negativeThreshold}%</span>
            </div>
        </div>
    );
};

export default MarketCard;