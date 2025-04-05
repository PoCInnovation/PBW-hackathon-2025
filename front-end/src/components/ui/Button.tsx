import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;