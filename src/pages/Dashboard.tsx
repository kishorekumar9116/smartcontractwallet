import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, CheckCircle2, AlertCircle, ShieldCheck, Clock, Coins } from 'lucide-react';
import { useSmartWallet } from '../hooks/useSmartWallet';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { SMART_WALLET_ADDRESS } from '../config/contracts';
import { WalletAddress } from '../components/ui/WalletAddress';
import { Skeleton } from '../components/ui/Skeleton';
import { useWallet } from '../context/WalletContext';

export function Dashboard() {
  const { balance: eoaBalance, address } = useWallet();
  const { 
    getWalletBalance, 
    getOwners, 
    getRequiredSignatures, 
    isFrozen, 
  } = useSmartWallet();

  const [walletBalance, setWalletBalance] = useState<string>("0.0000");
  const [owners, setOwners] = useState<string[]>([]);
  const [reqSignatures, setReqSignatures] = useState<number>(0);
  const [frozen, setFrozen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [
          balanceStr,
          ownersArr,
          reqSigs,
          frozenStatus,
        ] = await Promise.all([
          getWalletBalance(),
          getOwners(),
          getRequiredSignatures(),
          isFrozen(),
        ]);

        if (mounted) {
          setWalletBalance(balanceStr);
          setOwners(ownersArr);
          setReqSignatures(reqSigs);
          setFrozen(frozenStatus);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch smart wallet data:", error);
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [getWalletBalance, getOwners, getRequiredSignatures, isFrozen]);

  return (
    <div className="space-y-8 page-transition">
      {/* TOP SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Welcome back</p>
          <div className="mt-2">
            <WalletAddress address={SMART_WALLET_ADDRESS} className="text-2xl font-bold tracking-tight text-white" />
          </div>
        </div>
        <div>
          <Badge variant="success" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20 px-3 py-1.5">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Sepolia Testnet
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* MAIN BALANCE CARD */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border-navy-700/50 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-400/5 blur-2xl"></div>
          <CardContent className="p-6 sm:p-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-400">SmartVault Balance</p>
                {isLoading ? (
                  <div className="mt-2 space-y-2">
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ) : (
                  <>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">{walletBalance}</span>
                      <span className="text-xl font-medium text-teal-400">Sepolia ETH</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="text-right border-l border-navy-700 pl-6">
                <p className="text-xs font-medium text-slate-400">Your Connected Wallet</p>
                <div className="mt-1 flex items-baseline gap-1 justify-end">
                  <span className="text-lg font-bold text-slate-200">{eoaBalance || "0.0000"}</span>
                  <span className="text-sm text-slate-400">ETH</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/send" className="flex-1">
                <Button className="w-full gap-2 h-12 text-base shadow-lg shadow-teal-400/10">
                  <ArrowUpRight className="h-5 w-5" /> Send
                </Button>
              </Link>
              <Link to="/receive" className="flex-1">
                <Button variant="outline" className="w-full gap-2 h-12 text-base">
                  <ArrowDownLeft className="h-5 w-5" /> Receive
                </Button>
              </Link>
              <Link to="/swap" className="flex-1">
                <Button variant="secondary" className="w-full gap-2 h-12 text-base">
                  <ArrowRightLeft className="h-5 w-5" /> Swap
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* SECURITY CARD */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-400" />
              <CardTitle>Security Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Wallet Status</p>
              <div className="flex items-center gap-2 mt-1">
                {frozen ? (
                  <Badge variant="warning" className="bg-red-500/10 text-red-400 border-red-500/20">
                    <AlertCircle className="mr-1.5 h-3 w-3" /> Frozen
                  </Badge>
                ) : (
                  <Badge variant="success" className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20">
                    <CheckCircle2 className="mr-1.5 h-3 w-3" /> Active
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-slate-400">Multisig Configuration</p>
              {isLoading ? <Skeleton className="h-7 w-32 mt-1" /> : (
                <p className="text-lg font-medium text-white">
                  {reqSignatures} of {owners.length || '-'} signatures
                </p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm text-slate-400">Total Owners</p>
              {isLoading ? <Skeleton className="h-7 w-12 mt-1" /> : (
                <p className="text-lg font-medium text-white">{owners.length || '-'}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
