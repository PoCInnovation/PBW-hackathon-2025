import React from 'react';

interface CardProps {
    title: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({title, content, footer}) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <div className="mb-4">{content}</div>
            {footer && <div className="border-t pt-2">{footer}</div>}
        </div>
    );
};

export default Card;