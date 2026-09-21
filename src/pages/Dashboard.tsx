import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, CheckCircle2, AlertCircle, ShieldCheck, Clock, Coins } from 'lucide-react';
import { useSmartWallet } from '../hooks/useSmartWallet';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { SMART_WALLET_ADDRESS } from '../config/contracts';
import { WalletAddress } from '../components/ui/WalletAddress';
import { TransactionCard } from '../components/ui/TransactionCard';
import { Skeleton } from '../components/ui/Skeleton';

export function Dashboard() {
  const { 
    getWalletBalance, 
    getOwners, 
    getRequiredSignatures, 
    isFrozen, 
  } = useSmartWallet();

  const [walletBalance, setWalletBalance] = useState<string>("0.0000");
  const [ethPrice, setEthPrice] = useState<number>(0);
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

        // Fetch ETH Price safely
        let price = 0;
        try {
          const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
          const data = await res.json();
          price = data.ethereum?.usd || 0;
        } catch (e) {
          console.error("Failed to fetch ETH price");
        }

        if (mounted) {
          setWalletBalance(balanceStr);
          setOwners(ownersArr);
          setReqSignatures(reqSigs);
          setFrozen(frozenStatus);
          setEthPrice(price);
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

  const usdValue = (parseFloat(walletBalance) * ethPrice).toFixed(2);

  // Mock Activity Data for layout purposes
  const mockActivity = [
    { id: 1, type: 'Received', amount: '+0.5 ETH', date: 'Today, 10:23 AM', status: 'Completed' },
    { id: 2, type: 'Multisig', amount: 'Pending', date: 'Yesterday', status: 'Requires 1 more signature' },
    { id: 3, type: 'Swap', amount: '0.1 ETH → 250 USDC', date: 'Oct 15', status: 'Completed' },
  ];

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
            <p className="text-sm font-medium text-slate-400">Total Wallet Balance</p>
            {isLoading ? (
              <div className="mt-2 space-y-2">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">{walletBalance}</span>
                  <span className="text-xl font-medium text-teal-400">ETH</span>
                </div>
                {ethPrice > 0 ? (
                  <p className="mt-1 text-slate-400 transition-opacity animate-fade-in">≈ ${usdValue} USD</p>
                ) : (
                  <p className="mt-1 text-slate-400">Fetching USD value...</p>
                )}
              </>
            )}

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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ASSETS SECTION */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-teal-400" />
              <CardTitle>Assets</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Native ETH */}
              <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-800/50 p-4 transition-colors hover:bg-navy-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 border border-navy-700">
                    <span className="text-xl">Ξ</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Ethereum</p>
                    <p className="text-xs text-slate-400">ETH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{walletBalance}</p>
                  {ethPrice > 0 && <p className="text-xs text-slate-400">${usdValue}</p>}
                </div>
              </div>
              
              {/* Mock USDC for visual layout */}
              <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-800/50 p-4 transition-colors hover:bg-navy-800 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 border border-navy-700">
                    <span className="text-xl text-blue-400">$</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">USD Coin</p>
                    <p className="text-xs text-slate-400">USDC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">0.00</p>
                  <p className="text-xs text-slate-400">$0.00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTIVITY SECTION */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-400" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-slate-400">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivity.map((activity) => (
                <TransactionCard
                  key={activity.id}
                  title={activity.type}
                  description={activity.date}
                  amount={activity.amount}
                  status={
                    activity.status === 'Completed' ? 'success' : 
                    activity.status.includes('Pending') || activity.status.includes('Requires') ? 'pending' : 'default'
                  }
                  icon={<Clock className="h-5 w-5" />}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
