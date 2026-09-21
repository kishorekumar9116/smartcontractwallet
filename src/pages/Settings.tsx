import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Copy, CheckCircle2, User, Wallet, Shield, Settings2, LogOut, Moon, Bell } from 'lucide-react';
import { useSmartWallet } from '../hooks/useSmartWallet';
import { useWallet } from '../context/WalletContext';
import { SMART_WALLET_ADDRESS } from '../config/contracts';
import { Badge } from '../components/ui/Badge';

export function Settings() {
  const { address, disconnectWallet } = useWallet();
  const { getOwners, getRequiredSignatures, isFrozen } = useSmartWallet();
  
  const [ownersCount, setOwnersCount] = useState(0);
  const [reqSignatures, setReqSignatures] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [copiedSmartWallet, setCopiedSmartWallet] = useState(false);
  const [copiedEOA, setCopiedEOA] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([getOwners(), getRequiredSignatures(), isFrozen()]).then(([o, r, f]) => {
      if (mounted) {
        setOwnersCount(o.length);
        setReqSignatures(r);
        setFrozen(f);
      }
    });
    return () => { mounted = false; };
  }, [getOwners, getRequiredSignatures, isFrozen]);

  const handleCopySmartWallet = () => {
    navigator.clipboard.writeText(SMART_WALLET_ADDRESS);
    setCopiedSmartWallet(true);
    setTimeout(() => setCopiedSmartWallet(false), 2000);
  };

  const handleCopyEOA = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopiedEOA(true);
    setTimeout(() => setCopiedEOA(false), 2000);
  };

  const shortenAddress = (addr: string | null) => {
    if (!addr) return "Not connected";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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
            <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-900/50 p-4">
              <div>
                <p className="text-sm font-medium text-slate-400">Smart Wallet Address</p>
                <p className="font-mono text-white">{shortenAddress(SMART_WALLET_ADDRESS)}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={handleCopySmartWallet}>
                {copiedSmartWallet ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-900/50 p-4">
              <div>
                <p className="text-sm font-medium text-slate-400">Connected Account</p>
                <p className="font-mono text-white">{shortenAddress(address)}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={handleCopyEOA}>
                {copiedEOA ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-900/50 p-4">
              <p className="text-sm font-medium text-slate-400">Network</p>
              <Badge variant="success" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Sepolia Testnet
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* WALLET CONFIGURATION */}
        <Card className="border-navy-700 bg-navy-800/80 shadow-lg">
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
            
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium text-slate-400">Multisig</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Required signatures:</span>
                <span className="text-white">{reqSignatures} of {ownersCount || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Total owners:</span>
                <span className="text-white">{ownersCount || '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECURITY & PREFERENCES */}
        <div className="space-y-6">
          <Card className="border-navy-700 bg-navy-800/80 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal-400" />
                <CardTitle>Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Emergency Freeze</span>
                {frozen ? (
                  <span className="text-red-400 font-medium">Frozen</span>
                ) : (
                  <span className="text-emerald-400 font-medium">Active</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-navy-700 bg-navy-800/80 shadow-lg">
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
                className="h-12 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2"
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
