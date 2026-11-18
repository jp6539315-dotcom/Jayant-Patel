import React from 'react';
import { BookCondition } from '../types/exchange';

interface ConditionSlipProps {
  condition: BookCondition;
  className?: string;
}

export const ConditionSlip: React.FC<ConditionSlipProps> = ({ condition, className = '' }) => {
  const styles: Record<BookCondition, string> = {
    'Like New': 'bg-[#E6F4F1] text-[#1E7B6E] border-[#1E7B6E]/20',
    'Gently Used': 'bg-[#EBF1F5] text-[#1B3B4B] border-[#1B3B4B]/20',
    Acceptable: 'bg-[#F2ECE1] text-[#705E44] border-[#705E44]/20',
  };

  return (
    <span
      className={`inline-flex items-center rounded-[4px] border px-2 py-0.5 text-[11px] font-semibold leading-tight tracking-[0.01em] whitespace-nowrap ${styles[condition]} ${className}`}
    >
      {condition}
    </span>
  );
};
