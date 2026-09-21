import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowUpRight, ArrowDownLeft, Users, ShieldAlert, FileText, Lock, Unlock } from 'lucide-react';
import { useSmartWallet } from '../hooks/useSmartWallet';
import { Badge } from '../components/ui/Badge';

export function Dashboard() {
  const { 
    getWalletBalance, 
    getOwners, 
    getRequiredSignatures, 
    isFrozen, 
    getTransactionCount,
    isCurrentUserOwner
  } = useSmartWallet();

  const [walletBalance, setWalletBalance] = useState<string>("0.000");
  const [owners, setOwners] = useState<string[]>([]);
  const [reqSignatures, setReqSignatures] = useState<number>(0);
  const [frozen, setFrozen] = useState<boolean>(false);
  const [txCount, setTxCount] = useState<number>(0);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchWalletData = async () => {
      setLoading(true);
      try {
        const [
          balanceStr,
          ownersArr,
          reqSigs,
          frozenStatus,
          count,
          ownerStatus
        ] = await Promise.all([
          getWalletBalance(),
          getOwners(),
          getRequiredSignatures(),
          isFrozen(),
          getTransactionCount(),
          isCurrentUserOwner()
        ]);

        if (mounted) {
          setWalletBalance(balanceStr);
          setOwners(ownersArr);
          setReqSignatures(reqSigs);
          setFrozen(frozenStatus);
          setTxCount(count);
          setIsOwner(ownerStatus);
        }
      } catch (error) {
        console.error("Failed to fetch smart wallet data:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWalletData();

    // Optionally set up an interval for live updates, but fetching once on mount is enough for now
    return () => { mounted = false; };
  }, [
    getWalletBalance, 
    getOwners, 
    getRequiredSignatures, 
    isFrozen, 
    getTransactionCount,
    isCurrentUserOwner
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
          <p className="text-slate-400">Manage your SmartVault assets securely.</p>
        </div>
        <div>
          {loading ? (
            <Badge variant="outline">Loading...</Badge>
          ) : isOwner ? (
            <Badge variant="success">Owner</Badge>
          ) : (
            <Badge variant="secondary">Observer</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Balance Card */}
        <Card className="col-span-full md:col-span-2 lg:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border-navy-700/50">
          <CardHeader>
            <CardTitle className="text-slate-400">Vault Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-white tracking-tight">
              {walletBalance} <span className="text-2xl text-teal-400">SEP</span>
            </div>
            <div className="text-slate-400">Sepolia Testnet</div>
            
            <div className="flex flex-wrap gap-3 pt-4">
              <Button className="gap-2" disabled={!isOwner || frozen}>
                <ArrowUpRight className="h-4 w-4" /> Send
              </Button>
              <Button variant="outline" className="gap-2">
                <ArrowDownLeft className="h-4 w-4" /> Receive
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vault Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vault Status</CardTitle>
            <CardDescription>Current configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-navy-700 pb-2">
                <span className="text-slate-400 flex items-center gap-2"><Lock className="h-4 w-4"/> Status</span>
                {frozen ? (
                  <span className="text-red-400 flex items-center gap-1"><Lock className="h-3 w-3" /> Frozen</span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1"><Unlock className="h-3 w-3" /> Active</span>
                )}
              </div>
              <div className="flex items-center justify-between border-b border-navy-700 pb-2">
                <span className="text-slate-400 flex items-center gap-2"><Users className="h-4 w-4"/> Owners</span>
                <span className="text-white">{owners.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-navy-700 pb-2">
                <span className="text-slate-400 flex items-center gap-2"><ShieldAlert className="h-4 w-4"/> Required Sigs</span>
                <span className="text-white">{reqSignatures} / {owners.length}</span>
              </div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-slate-400 flex items-center gap-2"><FileText className="h-4 w-4"/> Transactions</span>
                <span className="text-white">{txCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Owners List */}
      <Card>
        <CardHeader>
          <CardTitle>Vault Owners</CardTitle>
          <CardDescription>Addresses authorized to sign transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {owners.length > 0 ? (
              owners.map((owner, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border border-navy-700 bg-navy-800/50 p-3">
                  <span className="text-sm font-medium text-slate-300 break-all">{owner}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No owners found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
