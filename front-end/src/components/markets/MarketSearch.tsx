import React from 'react';

interface MarketSearchProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const MarketSearch: React.FC<MarketSearchProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="mb-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-primary border border-border rounded-lg px-4 py-2 w-full text-white focus:outline-none focus:border-accent"
                />
                <span className="absolute right-3 top-2 text-textSecondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default MarketSearch; 