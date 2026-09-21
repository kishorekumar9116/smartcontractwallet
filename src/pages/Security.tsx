import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldAlert, ShieldCheck, AlertOctagon, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { useSmartWallet } from '../hooks/useSmartWallet';

type ModalState = 'none' | 'confirm_freeze' | 'confirm_unfreeze' | 'pending' | 'success';

export function Security() {
  const { isFrozen, freezeWallet, createUnfreezeRequest, isCurrentUserOwner, getRequiredSignatures } = useSmartWallet();
  const [frozen, setFrozen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [reqSigs, setReqSigs] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [modalState, setModalState] = useState<ModalState>('none');
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [f, o, r] = await Promise.all([isFrozen(), isCurrentUserOwner(), getRequiredSignatures()]);
      setFrozen(f);
      setIsOwner(o);
      setReqSigs(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFreeze = async () => {
    setError("");
    setModalState('pending');
    try {
      const tx = await freezeWallet();
      await tx.wait();
      setFrozen(true);
      setModalState('success');
    } catch (err: any) {
      console.error(err);
      setError(err?.shortMessage || err?.message || "Failed to freeze wallet.");
      setModalState('confirm_freeze');
    }
  };

  const handleUnfreeze = async () => {
    setError("");
    setModalState('pending');
    try {
      const tx = await createUnfreezeRequest();
      await tx.wait();
      setModalState('success');
    } catch (err: any) {
      console.error(err);
      setError(err?.shortMessage || err?.message || "Failed to request unfreeze.");
      setModalState('confirm_unfreeze');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Wallet Security</h2>
        <p className="text-slate-400">Manage the security state of your SmartVault.</p>
      </div>

      <Card className={`border-navy-700 bg-navy-800/80 shadow-xl overflow-hidden relative transition-colors ${frozen ? 'border-red-500/30' : 'border-emerald-500/30'}`}>
        
        {/* MAIN CARD UI */}
        {modalState === 'none' && (
          <CardContent className="p-8 space-y-8 text-center">
            
            <div className="flex flex-col items-center justify-center space-y-4">
              {frozen ? (
                <>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 border-4 border-red-500/20">
                    <ShieldAlert className="h-12 w-12 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-red-400 mb-2">WALLET FROZEN</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">
                      Transactions are temporarily disabled. You can still view your balance and history.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 border-4 border-emerald-500/20">
                    <ShieldCheck className="h-12 w-12 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-emerald-400 mb-2">ACTIVE</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">
                      Your wallet is currently active and transactions can be performed securely.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-navy-700 w-full">
              {!isOwner ? (
                <div className="rounded-lg bg-navy-900/50 p-4 border border-navy-700 text-sm text-slate-400">
                  Only owners can modify the security state of this wallet.
                </div>
              ) : frozen ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-lg bg-blue-500/10 p-4 text-left border border-blue-500/20">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                    <p className="text-sm text-blue-200/80">
                      Unfreezing the wallet requires <strong className="text-blue-300">{reqSigs}</strong> multisignature approvals from the owners.
                    </p>
                  </div>
                  <Button 
                    className="w-full h-14 text-base font-bold shadow-lg bg-navy-700 text-white hover:bg-navy-600 border border-navy-600" 
                    onClick={() => setModalState('confirm_unfreeze')}
                  >
                    Request Unfreeze
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full h-14 text-base font-bold shadow-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/30 gap-2" 
                  onClick={() => setModalState('confirm_freeze')}
                >
                  <AlertOctagon className="h-5 w-5" /> Emergency Freeze
                </Button>
              )}
            </div>
            
          </CardContent>
        )}

        {/* OVERLAYS */}
        {modalState !== 'none' && (
          <div className="absolute inset-0 z-10 flex flex-col bg-navy-800/95 backdrop-blur-md p-6 sm:p-8">
            
            {/* CONFIRM FREEZE */}
            {modalState === 'confirm_freeze' && (
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Freeze Wallet?</h3>
                  <div className="flex items-start gap-3 rounded-lg bg-red-500/10 p-4 text-left border border-red-500/20">
                    <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <p className="text-sm text-red-200/90 leading-relaxed">
                      Freezing temporarily prevents wallet transactions from being executed. You should do this if you suspect your wallet has been compromised.
                    </p>
                  </div>
                  {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
                </div>
                <div className="flex gap-4 mt-8">
                  <Button variant="outline" className="flex-1 h-12" onClick={() => { setModalState('none'); setError(""); }}>
                    Cancel
                  </Button>
                  <Button className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20" onClick={handleFreeze}>
                    Freeze Wallet
                  </Button>
                </div>
              </div>
            )}

            {/* CONFIRM UNFREEZE */}
            {modalState === 'confirm_unfreeze' && (
              <div className="flex h-full flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Request Unfreeze?</h3>
                  <div className="flex items-start gap-3 rounded-lg bg-blue-500/10 p-4 text-left border border-blue-500/20">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                    <p className="text-sm text-blue-200/90 leading-relaxed">
                      This will propose a transaction to unfreeze the wallet. It requires {reqSigs} signatures to execute.
                    </p>
                  </div>
                  {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
                </div>
                <div className="flex gap-4 mt-8">
                  <Button variant="outline" className="flex-1 h-12" onClick={() => { setModalState('none'); setError(""); }}>
                    Cancel
                  </Button>
                  <Button className="flex-1 h-12 shadow-lg shadow-teal-400/10" onClick={handleUnfreeze}>
                    Create Request
                  </Button>
                </div>
              </div>
            )}

            {/* PENDING */}
            {modalState === 'pending' && (
              <div className="flex h-full flex-col items-center justify-center text-center space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-teal-400" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Processing</h3>
                  <p className="text-slate-400">Please confirm the transaction in your wallet...</p>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {modalState === 'success' && (
              <div className="flex h-full flex-col items-center justify-center text-center space-y-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/20">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Success</h3>
                  <p className="text-slate-400 mb-6">
                    {frozen ? "Your wallet has been frozen." : "Your unfreeze request has been created."}
                  </p>
                </div>
                <div className="pt-4 w-full">
                  <Button className="w-full h-12" onClick={() => setModalState('none')}>
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
