import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, CheckCircle2, Info, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSmartWallet } from '../hooks/useSmartWallet';
import { parseEther, isAddress } from 'ethers';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TokenSelector } from '../components/ui/TokenSelector';
import { WalletAddress } from '../components/ui/WalletAddress';

type SendState = 'form' | 'confirm' | 'pending' | 'success';

export function Send() {
  const { getWalletBalance, getContractWithSigner, isFrozen } = useSmartWallet();
  const [balance, setBalance] = useState("0.0000");
  const [frozen, setFrozen] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  
  const [step, setStep] = useState<SendState>('form');
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([getWalletBalance(), isFrozen()]).then(([bal, f]) => {
      if (mounted) {
        setBalance(bal);
        setFrozen(f);
      }
    });
    return () => { mounted = false; };
  }, [getWalletBalance, isFrozen]);

  const handleContinue = () => {
    setError("");
    if (frozen) {
      setError("Wallet is frozen. Transactions are temporarily disabled.");
      return;
    }
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

  return (
    <div className="mx-auto max-w-lg space-y-6 page-transition">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ArrowLeft className="h-5 w-5 text-slate-300" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Send Assets</h2>
      </div>

      <Card className="border-navy-700 bg-navy-800/80 shadow-xl relative overflow-hidden">
        <CardHeader>
          <CardTitle>Transfer details</CardTitle>
          <CardDescription>Create a new multisig transaction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Asset</label>
            <div className="flex items-center justify-between rounded-xl border border-navy-700 bg-navy-900/50 p-4">
              <TokenSelector symbol="ETH" icon="Ξ" readOnly />
              <div className="text-right">
                <p className="text-sm text-slate-400">Available</p>
                <p className="font-medium text-white">{balance} ETH</p>
              </div>
            </div>
          </div>

          <Input
            label="Recipient Address"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <div className="relative">
            <Input
              label="Amount"
              type="number"
              step="0.0001"
              placeholder="0.00"
              className="pr-16"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={error}
            />
            <div className="absolute right-4 top-9">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs font-medium text-teal-400 hover:bg-teal-400/10 hover:text-teal-300"
                onClick={() => { setAmount(balance); setError(""); }}
              >
                MAX
              </Button>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-base mt-2 shadow-lg shadow-teal-400/10" 
            onClick={handleContinue}
          >
            Continue
          </Button>
        </CardContent>
      </Card>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={step === 'confirm'}
        onClose={() => setStep('form')}
        onConfirm={handleConfirmTransaction}
        title="Review Transaction"
      >
        <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6 text-center space-y-2 mb-6">
          <p className="text-slate-400">Sending</p>
          <p className="text-4xl font-bold text-white">{amount} <span className="text-2xl text-teal-400">ETH</span></p>
        </div>
        <div className="space-y-4 rounded-xl border border-navy-700 p-4">
          <div className="flex justify-between items-center pb-3 border-b border-navy-700">
            <span className="text-slate-400">To</span>
            <WalletAddress address={recipient} showIcon={false} />
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
      </ConfirmDialog>

      {/* PENDING MODAL */}
      <Modal isOpen={step === 'pending'} onClose={() => {}} title="Transaction Pending">
        <LoadingSpinner text="Please wait while the transaction is being created on the blockchain..." size="lg" className="py-8" />
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal 
        isOpen={step === 'success'} 
        onClose={() => setStep('form')} 
        title="Success"
        footer={
          <Button className="w-full h-12" onClick={() => setStep('form')}>
            Done
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Transaction Proposed</h3>
            <p className="text-slate-400 mb-6">Your transaction has been created and is waiting for approvals.</p>
            {txHash && (
              <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="inline-flex w-full">
                <Button variant="outline" className="w-full gap-2">
                  View on Explorer <ArrowUpRight className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
