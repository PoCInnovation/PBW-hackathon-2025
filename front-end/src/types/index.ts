export interface Market {
    id: string;
    question: string;
    positiveThreshold: number;
    protectiveThreshold: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserPrediction {
    marketId: string;
    targetToken: string;
    downsidePlan: string;
    predictionValue: number;
    createdAt: Date;
}

export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    balance: number;
}

export interface SwapDetails {
    fromToken: Token;
    toToken: Token;
    amount: number;
    slippage: number;
}