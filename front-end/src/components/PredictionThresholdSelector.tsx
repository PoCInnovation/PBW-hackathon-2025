import React, { useState } from 'react';

const PredictionThresholdSelector = ({ onThresholdChange }) => {
    const [bullishThreshold, setBullishThreshold] = useState(65);
    const [bearishThreshold, setBearishThreshold] = useState(35);

    const handleBullishChange = (event) => {
        const value = Math.min(Math.max(event.target.value, 0), 100);
        setBullishThreshold(value);
        onThresholdChange(value, bearishThreshold);
    };

    const handleBearishChange = (event) => {
        const value = Math.min(Math.max(event.target.value, 0), 100);
        setBearishThreshold(value);
        onThresholdChange(bullishThreshold, value);
    };

    return (
        <div className="prediction-threshold-selector">
            <div>
                <label>
                    Bullish Threshold (%):
                    <input
                        type="number"
                        value={bullishThreshold}
                        onChange={handleBullishChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Bearish Threshold (%):
                    <input
                        type="number"
                        value={bearishThreshold}
                        onChange={handleBearishChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default PredictionThresholdSelector;