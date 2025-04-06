"use client";

import React, { useState, useEffect } from 'react';
import { usePredictionMarkets } from '../../hooks/usePredictionMarkets';
import TokenSelector from './TokenSelector';
import { useTokenData } from '../../hooks/useTokenData';
import { createTask } from '../../../scripts/create-task';
import { useWallet } from '@solana/wallet-adapter-react';

interface PredictionMarket {
    id: string;
    question: string;
    endDate: string;
    volume: string;
    liquidity: string;
    outcomes: string;
    outcomePrices?: string;
    description: string;
    image: string;
    icon: string;
    active: boolean;
    closed: boolean;
    new: boolean;
    featured: boolean;
    archived: boolean;
    restricted: boolean;
}

interface StepperSwapProps {
    fromToken: any;
    targetToken: any;
    onFromTokenChange: (token: any) => void;
    onTargetTokenChange: (token: any) => void;
    selectedMarket: PredictionMarket | null;
    onMarketChange: (market: PredictionMarket) => void;
}

export default function StepperSwap({
    fromToken,
    targetToken,
    onFromTokenChange,
    onTargetTokenChange,
    selectedMarket,
    onMarketChange
}: StepperSwapProps) {
    const { markets, loading, error } = usePredictionMarkets();
    const { tokens } = useTokenData();
    const [currentStep, setCurrentStep] = useState(1);
    const [amount, setAmount] = useState<string>('');
    const [positiveThreshold, setPositiveThreshold] = useState<string>('65');
    const [hasInitialized, setHasInitialized] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [creationError, setCreationError] = useState<string | null>(null);
    const connection = useWallet();

    // Initialize tokens when data is loaded
    useEffect(() => {
        if (tokens && tokens.length >= 3 && !hasInitialized) {
            onFromTokenChange(tokens[0]);
            onTargetTokenChange(tokens[2]);
            setHasInitialized(true);
        }
    }, [tokens, hasInitialized, onFromTokenChange, onTargetTokenChange]);

    // Handle selected market from URL
    useEffect(() => {
        if (selectedMarket) {
            setCurrentStep(2); // Move to the configuration step
        }
    }, [selectedMarket]);

    const handleNext = async() => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            if (connection.connected && selectedMarket) {
                setIsCreating(true);
                setCreationError(null);
                try {
                    await createTask(connection, selectedMarket.id, selectedAnswer === 'yes' ? 0 : 1, positiveThreshold, parseFloat(amount));
                    setShowSuccess(true);
                    setTimeout(() => {
                        setShowSuccess(false);
                        setCurrentStep(1);
                    }, 2000);
                } catch (error) {
                    console.error("Error creating task:", error);
                    setCreationError("La création de position a échoué. Veuillez réessayer.");
                } finally {
                    setIsCreating(false);
                }
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleMarketSelect = (market: PredictionMarket) => {
        onMarketChange(market);
        handleNext();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <div className="text-danger mb-2">Failed to load prediction markets</div>
                <div className="text-sm text-textSecondary">
                    Please try again later or contact support if the issue persists.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Step Indicators */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= 1 ? 'bg-accent text-white' : 'bg-secondary text-textSecondary'
                    }`}>
                        1
                    </div>
                    <div className="ml-4 text-sm font-medium">Select Market</div>
                </div>
                <div className="flex-1 h-0.5 mx-4 bg-secondary"></div>
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= 2 ? 'bg-accent text-white' : 'bg-secondary text-textSecondary'
                    }`}>
                        2
                    </div>
                    <div className="ml-4 text-sm font-medium">Configure Position</div>
                </div>
            </div>

            {/* Step Content */}
            <div className="mt-8">
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div className="text-sm text-textSecondary mb-4">
                            Select a prediction market to trade
                        </div>
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search markets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-3 bg-secondary rounded-lg border border-border focus:border-accent focus:outline-none text-textPrimary placeholder-textSecondary"
                            />
                            <svg
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textSecondary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {markets
                                .filter(market => 
                                    market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    market.description.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((market) => (
                                <div
                                    key={market.id}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                        selectedMarket?.id === market.id
                                            ? 'border-accent bg-accent/10'
                                            : 'border-border hover:border-accent'
                                    }`}
                                    onClick={() => handleMarketSelect(market)}
                                >
                                    <div className="font-medium mb-1">{market.question}</div>
                                    <div className="text-sm text-textSecondary">
                                        Volume: ${parseFloat(market.volume).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6">
                        {/* Selected Market Info */}
                        <div className="bg-accent/10 border border-accent rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-medium mb-1">{selectedMarket?.question}</div>
                                    <div className="text-sm text-textSecondary">
                                        Volume: ${selectedMarket ? parseFloat(selectedMarket.volume).toLocaleString() : '0'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="text-sm text-accent hover:text-accent/80 transition-colors"
                                >
                                    Change Market
                                </button>
                            </div>
                        </div>

                        {/* Prediction Answer Selection */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-textSecondary mb-2">
                                Your Prediction
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSelectedAnswer('yes')}
                                    className={`p-4 rounded-lg border transition-all duration-200 ${
                                        selectedAnswer === 'yes'
                                            ? 'border-accent bg-accent/10 text-accent'
                                            : 'border-border hover:border-accent text-textSecondary'
                                    }`}
                                >
                                    <div className="font-medium mb-1">Yes</div>
                                    <div className="text-sm">
                                        {selectedMarket?.outcomePrices 
                                            ? `${(parseFloat(JSON.parse(selectedMarket.outcomePrices)[0]) * 100).toFixed(1)}% probability`
                                            : '50% probability'}
                                    </div>
                                </button>
                                <button
                                    onClick={() => setSelectedAnswer('no')}
                                    className={`p-4 rounded-lg border transition-all duration-200 ${
                                        selectedAnswer === 'no'
                                            ? 'border-accent bg-accent/10 text-accent'
                                            : 'border-border hover:border-accent text-textSecondary'
                                    }`}
                                >
                                    <div className="font-medium mb-1">No</div>
                                    <div className="text-sm">
                                        {selectedMarket?.outcomePrices 
                                            ? `${(parseFloat(JSON.parse(selectedMarket.outcomePrices)[1]) * 100).toFixed(1)}% probability`
                                            : '50% probability'}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Token Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-textSecondary mb-2">
                                    From Token
                                </label>
                                <TokenSelector
                                    selectedToken={fromToken}
                                    onTokenSelect={onFromTokenChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-textSecondary mb-2">
                                    To Token
                                </label>
                                <TokenSelector
                                    selectedToken={targetToken}
                                    onTokenSelect={onTargetTokenChange}
                                />
                            </div>
                        </div>

                        {/* Parameters */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-textSecondary mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-2 bg-secondary rounded-lg border border-border focus:border-accent focus:outline-none"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-textSecondary">
                                        Positive Threshold (%)
                                    </label>
                                    <span className="text-sm text-textSecondary">{positiveThreshold}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={positiveThreshold}
                                    onChange={(e) => setPositiveThreshold(e.target.value)}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                                />
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleBack}
                                className="flex-1 bg-secondary text-textPrimary py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!fromToken || !targetToken || !amount || !selectedAnswer || isCreating || !connection.connected}
                                className="flex-1 bg-accent text-white py-2 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                            >
                                {isCreating ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                        Création de position...
                                    </div>
                                ) : showSuccess ? (
                                    <div className="flex items-center justify-center text-green-300">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Position créée !
                                    </div>
                                ) : creationError ? (
                                    <div className="flex items-center justify-center text-red-300">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                        {creationError}
                                    </div>
                                ) : (
                                    "Créer une position"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 