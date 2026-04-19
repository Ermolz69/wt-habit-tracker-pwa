import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button = ({ children, variant = 'primary', fullWidth, className = '', ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 outline-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-indigo-500 text-white rounded-2xl shadow-glow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 p-4 text-lg",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-2xl p-4 text-lg",
    danger: "bg-danger text-white hover:bg-red-600 rounded-2xl p-4 text-lg",
    ghost: "text-gray-500 hover:text-danger hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold"
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
