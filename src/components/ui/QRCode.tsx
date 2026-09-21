import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../../lib/utils';

export interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 200, className }: QRCodeProps) {
  return (
    <div className={cn(
      "rounded-2xl bg-white p-4 shadow-lg ring-4 ring-white/10 transition-all duration-300 hover:ring-teal-400/20 hover:scale-105", 
      className
    )}>
      <QRCodeSVG 
        value={value} 
        size={size}
        level="H"
        includeMargin={false}
      />
    </div>
  );
}
