import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface WalletAddressProps {
  address: string | null;
  className?: string;
  showIcon?: boolean;
}

export function WalletAddress({ address, className, showIcon = true }: WalletAddressProps) {
  const [copied, setCopied] = useState(false);

  const shortenAddress = (addr: string | null) => {
    if (!addr) return "Not connected";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="font-mono text-sm text-white">
        {shortenAddress(address)}
      </span>
      {showIcon && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-slate-400 hover:text-white transition-colors" 
          onClick={handleCopy}
          title="Copy address"
        >
          {copied ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
        </Button>
      )}
    </div>
  );
}
