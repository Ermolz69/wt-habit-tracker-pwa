import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="block text-[11px] font-bold text-muted uppercase tracking-[0.22em] mb-2">
          {label}
        </label>
      )}
      <input 
        className={`w-full p-4 rounded-[1.4rem] bg-white/80 border ${error ? 'border-danger/50' : 'border-white/70'} text-dark placeholder:text-muted/70 shadow-soft focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 outline-none transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-danger text-xs mt-2 font-medium">{error}</span>}
    </div>
  );
};
