import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button = ({ children, variant = 'primary', fullWidth, className = '', ...props }: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60";
  
  const variants = {
    primary:
      "bg-gradient-to-r from-primary via-teal-700 to-dark text-white rounded-[1.4rem] shadow-glow hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 p-4 text-lg",
    secondary:
      "bg-white/80 text-dark border border-white/70 hover:bg-white rounded-[1.4rem] p-4 text-lg shadow-soft",
    danger:
      "bg-danger text-white hover:bg-red-700 rounded-[1.4rem] p-4 text-lg shadow-soft",
    ghost:
      "text-muted hover:text-dark hover:bg-white/70 px-3 py-2 rounded-xl text-sm font-semibold"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
