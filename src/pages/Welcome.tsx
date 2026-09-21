import { Shield, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useWallet } from '../context/WalletContext';
import { Navigate } from 'react-router-dom';

export function Welcome() {
  const { address, connectWallet, isConnecting, error } = useWallet();

  // If already connected, redirect to dashboard
  if (address) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 p-4 selection:bg-teal-400/30">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-teal-400/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-teal-400/5 blur-[120px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-navy-700 bg-navy-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <CardContent className="flex flex-col items-center space-y-8 p-0">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-400 shadow-[0_0_30px_rgba(100,255,218,0.3)]">
              <Shield className="h-8 w-8 text-navy-900" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">SmartVault</h1>
              <p className="text-sm text-slate-400">Your simple and secure smart wallet.</p>
            </div>
          </div>

          <div className="w-full space-y-3">
            <Button variant="outline" className="w-full h-12" disabled>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full h-12" disabled>
              Continue with X
            </Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-navy-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-navy-900 px-2 text-slate-500">Or</span>
              </div>
            </div>

            <Button 
              className="w-full h-12 gap-2 text-base" 
              onClick={connectWallet}
              disabled={isConnecting}
            >
              <Wallet className="h-5 w-5" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>

            {error && (
              <p className="text-center text-sm text-red-400 mt-4">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
