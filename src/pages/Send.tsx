import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, CheckCircle2, Info, Loader2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSmartWallet } from '../hooks/useSmartWallet';
import { parseEther, isAddress } from 'ethers';

type SendState = 'form' | 'confirm' | 'pending' | 'success';

export function Send() {
  const { getWalletBalance, getContractWithSigner } = useSmartWallet();
  const [balance, setBalance] = useState("0.0000");
  
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  
  const [step, setStep] = useState<SendState>('form');
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    let mounted = true;
    getWalletBalance().then((bal) => {
      if (mounted) setBalance(bal);
    });
    return () => { mounted = false; };
  }, [getWalletBalance]);

  const handleContinue = () => {
    setError("");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (Number(amount) > Number(balance)) {
      setError("Insufficient balance in SmartVault.");
      return;
    }
    if (!isAddress(recipient)) {
      setError("Please enter a valid recipient address.");
      return;
    }
    setStep('confirm');
  };

  const handleConfirmTransaction = async () => {
    setStep('pending');
    setError("");
    try {
      const contract = await getContractWithSigner();
      
      // Native ETH send data is 0x
      const value = parseEther(amount);
      const data = "0x";
      
      const tx = await contract.createTransaction(recipient, value, data);
      setTxHash(tx.hash);
      
      await tx.wait();
      setStep('success');
    } catch (err: any) {
      console.error(err);
      setError(err?.shortMessage || err?.message || "Failed to create transaction.");
      setStep('form');
    }
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-5 w-5 text-slate-300" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Send Assets</h2>
      </div>

      <Card className="border-navy-700 bg-navy-800/80 shadow-xl relative overflow-hidden">
        
        {/* FORM STATE */}
        {step === 'form' && (
          <>
            <CardHeader>
              <CardTitle>Transfer details</CardTitle>
              <CardDescription>Create a new multisig transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Asset</label>
                <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-900/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 border border-navy-600">
                      <span className="text-xl">Ξ</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">Ethereum</p>
                      <p className="text-xs text-slate-400">ETH</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Available</p>
                    <p className="font-medium text-white">{balance} ETH</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full rounded-xl border border-navy-700 bg-navy-900/50 p-4 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="0.00"
                    className="w-full rounded-xl border border-navy-700 bg-navy-900/50 p-4 pr-16 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300"
                      onClick={() => setAmount(balance)}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}

              <Button 
                className="w-full h-12 text-base mt-2 shadow-lg shadow-teal-400/10" 
                onClick={handleContinue}
              >
                Continue
              </Button>
            </CardContent>
          </>
        )}

        {/* CONFIRM / PENDING / SUCCESS OVERLAY */}
        {step !== 'form' && (
          <div className="absolute inset-0 z-10 flex flex-col bg-navy-800/95 backdrop-blur-sm p-6 sm:p-8">
            
            {step === 'confirm' && (
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Review Transaction</h3>
                  
                  <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6 text-center space-y-2 mb-6">
                    <p className="text-slate-400">Sending</p>
                    <p className="text-4xl font-bold text-white">{amount} <span className="text-2xl text-teal-400">ETH</span></p>
                  </div>

                  <div className="space-y-4 rounded-xl border border-navy-700 p-4">
                    <div className="flex justify-between items-center pb-3 border-b border-navy-700">
                      <span className="text-slate-400">To</span>
                      <span className="font-mono text-white">{shortenAddress(recipient)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-navy-700">
                      <span className="text-slate-400">Network</span>
                      <span className="text-white">Sepolia Testnet</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Est. Gas</span>
                      <span className="text-white">~0.0002 ETH</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-3 rounded-lg bg-blue-500/10 p-4 text-left border border-blue-500/20">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                    <p className="text-sm text-blue-200/80">
                      This will propose a transaction. Other owners must sign it before funds are transferred.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setStep('form')}>
                    Cancel
                  </Button>
                  <Button className="flex-1 h-12 gap-2 shadow-lg shadow-teal-400/10" onClick={handleConfirmTransaction}>
                    Confirm
                  </Button>
                </div>
              </div>
            )}

            {step === 'pending' && (
              <div className="flex h-full flex-col items-center justify-center text-center space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-teal-400" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Transaction Pending</h3>
                  <p className="text-slate-400">Please wait while the transaction is being created on the blockchain...</p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="flex h-full flex-col items-center justify-center text-center space-y-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/20">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Transaction Proposed</h3>
                  <p className="text-slate-400 mb-6">Your transaction has been created and is waiting for approvals.</p>
                  
                  {txHash && (
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex w-full"
                    >
                      <Button variant="outline" className="w-full gap-2">
                        View on Explorer <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>

                <div className="pt-4 w-full">
                  <Button className="w-full h-12" onClick={() => setStep('form')}>
                    Done
                  </Button>
                </div>
              </div>
            )}
            
          </div>
        )}
      </Card>
    </div>
  );
}
