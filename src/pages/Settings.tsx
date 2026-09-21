import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Wallet, Shield, Settings2, LogOut, Moon, Bell } from 'lucide-react';
import { useSmartWallet } from '../hooks/useSmartWallet';
import { useWallet } from '../context/WalletContext';
import { SMART_WALLET_ADDRESS } from '../config/contracts';
import { Badge } from '../components/ui/Badge';
import { WalletAddress } from '../components/ui/WalletAddress';
import { Skeleton } from '../components/ui/Skeleton';

export function Settings() {
  const { address, disconnectWallet } = useWallet();
  const { getOwners, getRequiredSignatures, isFrozen } = useSmartWallet();
  
  const [ownersCount, setOwnersCount] = useState(0);
  const [reqSignatures, setReqSignatures] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getOwners(), getRequiredSignatures(), isFrozen()]).then(([o, r, f]) => {
      if (mounted) {
        setOwnersCount(o.length);
        setReqSignatures(r);
        setFrozen(f);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [getOwners, getRequiredSignatures, isFrozen]);

  return (
    <div className="mx-auto max-w-2xl space-y-6 page-transition">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-slate-400">Manage your SmartVault configuration and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ACCOUNT SETTINGS */}
        <Card className="border-navy-700 bg-navy-800/80 shadow-lg md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-teal-400" />
              <CardTitle>Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-900/50 p-4 transition-colors hover:border-navy-500">
              <p className="text-sm font-medium text-slate-400">Smart Wallet Address</p>
              <WalletAddress address={SMART_WALLET_ADDRESS} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-900/50 p-4 transition-colors hover:border-navy-500">
              <p className="text-sm font-medium text-slate-400">Connected Account</p>
              <WalletAddress address={address} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-900/50 p-4">
              <p className="text-sm font-medium text-slate-400">Network</p>
              <Badge variant="success" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20 px-3 py-1.5 shadow-sm">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sepolia Testnet
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* WALLET CONFIGURATION */}
        <Card className="border-navy-700 bg-navy-800/80 shadow-lg transition-transform hover:scale-[1.01] hover:border-navy-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-teal-400" />
              <CardTitle>Wallet</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-navy-700">
              <span className="text-slate-400">Wallet Name</span>
              <span className="text-white font-medium">SmartVault</span>
            </div>
            
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium text-slate-400">Multisig</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Required signatures:</span>
                {loading ? <Skeleton className="h-5 w-12" /> : (
                  <span className="text-white">{reqSignatures} of {ownersCount || '-'}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Total owners:</span>
                {loading ? <Skeleton className="h-5 w-8" /> : (
                  <span className="text-white">{ownersCount || '-'}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECURITY & PREFERENCES */}
        <div className="space-y-6">
          <Card className="border-navy-700 bg-navy-800/80 shadow-lg transition-transform hover:scale-[1.01] hover:border-navy-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal-400" />
                <CardTitle>Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Emergency Freeze</span>
                {loading ? <Skeleton className="h-5 w-16" /> : frozen ? (
                  <span className="text-red-400 font-medium flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-400" /> Frozen
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Active
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-navy-700 bg-navy-800/80 shadow-lg transition-transform hover:scale-[1.01] hover:border-navy-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-teal-400" />
                <CardTitle>Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-2"><Moon className="h-4 w-4" /> Theme</span>
                <span className="text-white font-medium">Dark</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</span>
                <span className="text-white font-medium">Enabled</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CONNECTION */}
        <Card className="border-navy-700 bg-navy-800/80 shadow-lg md:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Connection</h3>
                <p className="text-sm text-slate-400">Disconnect your EOA wallet from SmartVault.</p>
              </div>
              <Button 
                variant="outline" 
                className="h-12 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2 transition-colors"
                onClick={disconnectWallet}
              >
                <LogOut className="h-4 w-4" /> Disconnect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
