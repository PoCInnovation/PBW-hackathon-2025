import React from 'react';

interface Token {
    symbol: string;
    name: string;
    image: string;
    balance: string;
    current_price?: number;
    price_change_percentage_24h?: number;
}

interface TokenModalProps {
    tokens: Token[];
    onSelect: (token: Token) => void;
    onClose: () => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ tokens, onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-primary rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Select Token</h2>
                    <button onClick={onClose} className="text-textSecondary hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {tokens.map((token) => (
                        <div
                            key={token.symbol}
                            className="flex items-center p-3 hover:bg-secondary rounded-lg cursor-pointer"
                            onClick={() => onSelect(token)}
                        >
                            <div className="w-8 h-8 mr-3 rounded-full overflow-hidden bg-gray-700">
                                <img
                                    src={token.image}
                                    alt={token.symbol}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{token.symbol}</div>
                                        <div className="text-sm text-textSecondary">{token.name}</div>
                                    </div>
                                    {token.current_price && (
                                        <div className="text-right">
                                            <div className="font-medium">
                                                ${token.current_price.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </div>
                                            {token.price_change_percentage_24h && (
                                                <div className={`text-sm ${
                                                    token.price_change_percentage_24h >= 0 
                                                        ? 'text-success' 
                                                        : 'text-danger'
                                                }`}>
                                                    {token.price_change_percentage_24h >= 0 ? '+' : ''}
                                                    {token.price_change_percentage_24h.toFixed(2)}%
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-textSecondary mt-1">
                                    Balance: {token.balance}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TokenModal; 