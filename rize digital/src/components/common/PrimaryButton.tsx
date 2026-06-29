import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: boolean;
}

export const PrimaryButton = ({ children, icon = false, className = '', ...props }: PrimaryButtonProps) => (
  <button 
    className={`inline-flex items-center gap-2 rounded-full border border-transparent bg-orange-500 shadow-md px-7 py-4 text-white font-medium hover:bg-orange-600 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
    {icon && <ArrowRight className="w-5 h-5" />}
  </button>
);
