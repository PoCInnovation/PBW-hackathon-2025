import React from 'react';

interface Token {
  id: string;
  name: string;
  symbol: string;
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ tokens, selectedToken, onSelect }) => {
  return (
    <div className="token-selector">
      <h3>Select a Token</h3>
      <ul>
        {tokens.map((token) => (
          <li key={token.id} onClick={() => onSelect(token)} className={selectedToken?.id === token.id ? 'selected' : ''}>
            {token.name} ({token.symbol})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenSelector;