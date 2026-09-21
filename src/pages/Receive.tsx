import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { SMART_WALLET_ADDRESS } from '../config/contracts';
import { Link } from 'react-router-dom';
import { QRCode } from '../components/ui/QRCode';
import { WalletAddress } from '../components/ui/WalletAddress';

export function Receive() {
  return (
    <div className="mx-auto max-w-lg space-y-6 page-transition">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-5 w-5 text-slate-300" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Receive Assets</h2>
      </div>

      <Card className="overflow-hidden border-navy-700 bg-navy-800/80 shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle>Scan to receive</CardTitle>
          <CardDescription>Sepolia Testnet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4">
          
          <QRCode value={SMART_WALLET_ADDRESS} />

          <div className="w-full space-y-2 text-center">
            <p className="text-sm font-medium text-slate-400">Smart Wallet Address</p>
            <div className="flex justify-center rounded-xl border border-navy-700 bg-navy-900/50 p-4 transition-colors hover:border-navy-500">
              <WalletAddress address={SMART_WALLET_ADDRESS} />
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-left animate-fade-in-up">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-sm leading-relaxed text-amber-200/80">
              <strong className="font-semibold text-amber-400">Important:</strong> Only send assets supported by this wallet on the <strong className="text-white">Sepolia network</strong>. Sending assets on other networks may result in permanent loss.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
