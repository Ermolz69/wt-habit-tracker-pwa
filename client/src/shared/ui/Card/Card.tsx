import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`glass-panel bg-card/80 p-10 rounded-[2rem] shadow-panel border border-white/70 relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
};
