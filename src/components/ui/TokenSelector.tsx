import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface TokenSelectorProps {
  symbol: string;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  readOnly?: boolean;
}

export function TokenSelector({ symbol, icon, onClick, className, readOnly = false }: TokenSelectorProps) {
  return (
    <div 
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full bg-navy-800 border border-navy-600 px-3 py-1.5 transition-colors",
        !readOnly && "cursor-pointer hover:bg-navy-700 hover:border-navy-500",
        className
      )}
      onClick={!readOnly ? onClick : undefined}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 shadow-sm text-sm">
        {icon}
      </div>
      <span className="font-medium text-white">{symbol}</span>
      {!readOnly && <span className="text-xs text-slate-400">▼</span>}
    </div>
  );
}
