import { Bell, Wallet, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useWallet } from '../../context/WalletContext';

export function TopBar() {
  const { address, disconnectWallet } = useWallet();

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-700 bg-navy-900/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Spacer for Sidebar Toggle */}
        <div className="w-8 sm:hidden"></div>
        <h1 className="text-xl font-bold tracking-tight text-white sm:hidden">
          SmartVault
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="success" className="hidden sm:inline-flex">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          Sepolia Testnet
        </Badge>
        
        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-teal-400 ring-2 ring-navy-900"></span>
        </Button>

        {address && (
          <div className="flex items-center gap-2 rounded-full border border-navy-700 bg-navy-800 p-1 pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-400/10 text-teal-400">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-200">{shortenAddress(address)}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-slate-400 hover:text-red-400" onClick={disconnectWallet}>
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
