import React, { useState } from 'react';
import { TokenSelector } from './TokenSelector';
import { PredictionThresholdSelector } from './PredictionThresholdSelector';
import { Button } from './ui/Button';

const SwapInterface = () => {
    const [targetToken, setTargetToken] = useState('');
    const [downsidePlan, setDownsidePlan] = useState('');
    const [predictionThreshold, setPredictionThreshold] = useState(50);

    const handleSwap = () => {
        // Logic for handling the swap based on user inputs
        console.log(`Swapping to ${targetToken} or ${downsidePlan} based on prediction threshold of ${predictionThreshold}`);
    };

    return (
        <div className="swap-interface">
            <h2>Swap Interface</h2>
            <TokenSelector selectedToken={targetToken} setSelectedToken={setTargetToken} />
            <TokenSelector selectedToken={downsidePlan} setSelectedToken={setDownsidePlan} />
            <PredictionThresholdSelector 
                threshold={predictionThreshold} 
                setThreshold={setPredictionThreshold} 
            />
            <Button onClick={handleSwap}>Execute Swap</Button>
        </div>
    );
};

export default SwapInterface;