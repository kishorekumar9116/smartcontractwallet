import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { useWallet, SEPOLIA_CHAIN_ID } from '../../context/WalletContext';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

export function MainLayout() {
  const { address, chainId, switchNetwork, error } = useWallet();

  // Redirect to welcome if not connected
  if (!address) {
    return <Navigate to="/welcome" replace />;
  }

  // Check if connected to correct network
  const isWrongNetwork = chainId !== null && chainId !== SEPOLIA_CHAIN_ID;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-navy-900 selection:bg-teal-400/30">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 sm:p-8 sm:pb-8">
          {isWrongNetwork ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md w-full rounded-xl border border-amber-500/20 bg-navy-800 p-8 text-center shadow-lg">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Wrong Network</h3>
                <p className="mb-6 text-slate-400">Please switch to Sepolia Testnet to use SmartVault.</p>
                
                {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
                
                <Button onClick={switchNetwork} className="w-full bg-amber-500 text-navy-900 hover:bg-amber-400">
                  Switch Network
                </Button>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-5xl">
              <Outlet />
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
