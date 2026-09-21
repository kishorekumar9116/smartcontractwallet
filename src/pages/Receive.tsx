import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Copy, QrCode } from 'lucide-react';

export function Receive() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Receive Assets</h2>
        <p className="text-slate-400">Scan the QR code or copy your address.</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Your Wallet Address</CardTitle>
          <CardDescription>Only send Sepolia ETH to this address.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-white p-4">
            {/* Placeholder for QR Code */}
            <QrCode className="h-full w-full text-navy-900" />
          </div>
          
          <div className="w-full space-y-2 text-center">
            <p className="text-sm font-medium text-slate-300">Smart Contract Address</p>
            <div className="flex items-center justify-between rounded-lg border border-navy-700 bg-navy-900 p-3">
              <span className="truncate text-sm text-slate-400">0x5654183b4fa20EFaEC29BA95265D1606c084eCfa</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
