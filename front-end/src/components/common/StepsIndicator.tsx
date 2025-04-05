import React from 'react';

interface StepsIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const StepsIndicator: React.FC<StepsIndicatorProps> = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex justify-between mb-8">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step <= currentStep
                                ? 'bg-accent text-white'
                                : 'bg-secondary text-textSecondary'
                        }`}
                    >
                        {step}
                    </div>
                    {step < totalSteps && (
                        <div
                            className={`w-16 h-0.5 mx-2 ${
                                step < currentStep ? 'bg-accent' : 'bg-secondary'
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default StepsIndicator; 