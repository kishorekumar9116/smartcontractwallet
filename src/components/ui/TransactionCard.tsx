import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';

export interface TransactionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  amount?: string;
  status?: 'success' | 'pending' | 'failed' | 'default';
  date?: string;
  className?: string;
}

export function TransactionCard({ 
  icon, 
  title, 
  description, 
  amount, 
  status = 'default',
  date,
  className 
}: TransactionCardProps) {
  
  const statusVariants = {
    success: 'success',
    pending: 'warning',
    failed: 'destructive',
    default: 'default'
  } as const;

  const statusText = {
    success: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    default: 'Info'
  };

  return (
    <div className={cn(
      "flex items-center justify-between rounded-xl border border-navy-700 bg-navy-900/40 p-4 transition-all hover:bg-navy-800/60 hover:border-navy-600",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-800 text-teal-400 border border-navy-600 shadow-sm">
          {icon}
        </div>
        <div>
          <p className="font-medium text-white">{title}</p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>{description}</span>
            {date && (
              <>
                <span>•</span>
                <span>{date}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {(amount || status !== 'default') && (
        <div className="text-right flex flex-col items-end gap-1">
          {amount && <p className="font-semibold text-white">{amount}</p>}
          {status !== 'default' && (
            <Badge variant={statusVariants[status]} className="text-[10px] px-1.5 py-0">
              {statusText[status]}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
