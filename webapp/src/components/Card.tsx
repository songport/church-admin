import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  shadow = true,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-lg p-6 ${
        shadow ? 'shadow-md' : 'border border-gray-200'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
