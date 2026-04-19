import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-soft border border-white/50 relative ${className}`}>
      {children}
    </div>
  );
};
