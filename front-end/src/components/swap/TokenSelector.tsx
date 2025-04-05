"use client";

import React, { useState } from 'react';
import { useTokenData } from '../../hooks/useTokenData';

interface TokenSelectorProps {
    selectedToken: any;
    onTokenSelect: (token: any) => void;
}

export default function TokenSelector({ selectedToken, onTokenSelect }: TokenSelectorProps) {
    const { tokens, loading } = useTokenData();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTokens = tokens.filter(token =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(true)}
                className="w-full p-3 bg-secondary rounded-lg border border-border hover:border-accent transition-colors flex items-center justify-between"
            >
                <div className="flex items-center">
                    {selectedToken ? (
                        <>
                            <img
                                src={selectedToken.image}
                                alt={selectedToken.symbol}
                                className="w-6 h-6 rounded-full mr-2"
                            />
                            <span>{selectedToken.symbol}</span>
                        </>
                    ) : (
                        <span className="text-textSecondary">Select token</span>
                    )}
                </div>
                <svg
                    className="w-5 h-5 text-textSecondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-primary border border-border rounded-lg shadow-lg">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Search tokens..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 bg-secondary rounded-lg border border-border focus:border-accent focus:outline-none"
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accent mx-auto"></div>
                            </div>
                        ) : (
                            filteredTokens.map((token, index) => (
                                <button
                                    key={`token-${token.symbol}-${index}`}
                                    onClick={() => {
                                        onTokenSelect(token);
                                        setIsOpen(false);
                                    }}
                                    className="w-full p-3 flex items-center hover:bg-secondary transition-colors"
                                >
                                    <img
                                        src={token.image}
                                        alt={token.symbol}
                                        className="w-6 h-6 rounded-full mr-2"
                                    />
                                    <div className="text-left">
                                        <div className="font-medium">{token.symbol}</div>
                                        <div className="text-sm text-textSecondary">{token.name}</div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
} 