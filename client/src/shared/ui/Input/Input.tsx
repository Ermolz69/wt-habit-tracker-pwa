import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <input 
        className={`w-full p-3.5 rounded-2xl bg-gray-50 border ${error ? 'border-danger' : 'border-gray-200'} focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-danger text-xs mt-1">{error}</span>}
    </div>
  );
};
