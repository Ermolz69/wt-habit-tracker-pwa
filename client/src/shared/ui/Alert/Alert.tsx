import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  variant?: 'danger' | 'success' | 'warning' | 'info';
  className?: string;
}

export const Alert = ({ children, variant = 'danger', className = '' }: AlertProps) => {
  const variants = {
    danger: "bg-red-50/90 text-danger border-red-200/70",
    success: "bg-emerald-50/90 text-success border-emerald-200/70",
    warning: "bg-amber-50/90 text-warning border-amber-200/70",
    info: "bg-teal-50/90 text-primary border-teal-200/70",
  };

  const icons = {
    danger: (
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
    ),
    success: (
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
    ),
    warning: null,
    info: null,
  };

  return (
    <div className={`p-4 rounded-[1.2rem] text-sm font-semibold border flex items-center gap-3 shadow-soft ${variants[variant]} ${className}`}>
      {icons[variant]}
      {children}
    </div>
  );
};
