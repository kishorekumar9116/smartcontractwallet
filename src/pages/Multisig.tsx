import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, ShieldAlert, Plus, Trash2 } from 'lucide-react';
import { useSmartWallet } from '../hooks/useSmartWallet';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Toast } from '../components/ui/Toast';

export function Multisig() {
  const { getOwners, getRequiredSignatures } = useSmartWallet();
  const [owners, setOwners] = useState<string[]>([]);
  const [requiredSignatures, setRequiredSignatures] = useState<number>(1);
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [newOwners, setNewOwners] = useState<string[]>([]);
  const [newRequiredSignatures, setNewRequiredSignatures] = useState<string>("1");
  const [toast, setToast] = useState<{ title: string; description: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getOwners(), getRequiredSignatures()]).then(([fetchedOwners, fetchedSigs]) => {
      if (mounted) {
        setOwners(fetchedOwners.length > 0 ? fetchedOwners : []);
        setRequiredSignatures(fetchedSigs > 0 ? fetchedSigs : 1);
      }
    });
    return () => { mounted = false; };
  }, [getOwners, getRequiredSignatures]);

  const handleOpenUpgrade = () => {
    setNewOwners(owners.length > 0 ? [...owners] : [""]);
    setNewRequiredSignatures(requiredSignatures.toString());
    setIsUpgradeModalOpen(true);
  };

  const handleAddOwner = () => {
    setNewOwners([...newOwners, ""]);
  };

  const handleRemoveOwner = (index: number) => {
    const updated = [...newOwners];
    updated.splice(index, 1);
    setNewOwners(updated);
  };

  const handleOwnerChange = (index: number, value: string) => {
    const updated = [...newOwners];
    updated[index] = value;
    setNewOwners(updated);
  };

  const handleSubmitUpgrade = () => {
    // Basic validation
    const validOwners = newOwners.filter(o => o.trim() !== "");
    const reqSigs = parseInt(newRequiredSignatures);
    
    if (validOwners.length === 0) {
      setToast({ title: "Error", description: "You must have at least one owner.", type: 'error' });
      return;
    }
    if (isNaN(reqSigs) || reqSigs < 1 || reqSigs > validOwners.length) {
      setToast({ title: "Error", description: "Invalid required signatures.", type: 'error' });
      return;
    }

    // Mocking success since the contract ABI does not support addOwner
    setOwners(validOwners);
    setRequiredSignatures(reqSigs);
    setIsUpgradeModalOpen(false);
    setToast({ 
      title: "Upgrade Successful", 
      description: "Multisig configuration updated (simulated).", 
      type: 'success' 
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* TOAST CONTAINER */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 w-80">
          <Toast 
            title={toast.title} 
            description={toast.description} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Multisignature</h2>
        <p className="text-slate-400">Manage co-signers and require multiple approvals for transactions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Co-signers</CardTitle>
                <CardDescription>Manage addresses that can sign transactions.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-white">Current Configuration</p>
                  <p className="text-sm text-slate-400">{requiredSignatures} out of {Math.max(owners.length, 1)} signatures required</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleOpenUpgrade}>Upgrade</Button>
              </div>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-navy-700">
                <p className="text-sm font-medium text-slate-400">Owners list</p>
                {owners.length > 0 ? owners.map((owner, i) => (
                  <div key={i} className="text-sm text-slate-300 break-all bg-navy-800/50 p-2 rounded border border-navy-700">
                    {owner}
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 italic">No owners loaded.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Pending Transactions</CardTitle>
                <CardDescription>Transactions waiting for your approval.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-navy-700 bg-navy-800/50">
              <p className="text-sm text-slate-500">No pending transactions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} title="Upgrade Multisig Configuration">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-400">Owners</label>
              <Button variant="ghost" size="sm" onClick={handleAddOwner} className="h-8 text-teal-400 hover:text-teal-300 hover:bg-teal-400/10">
                <Plus className="h-4 w-4 mr-1" /> Add Owner
              </Button>
            </div>
            
            <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-2">
              {newOwners.map((owner, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input 
                      placeholder="0x..." 
                      value={owner} 
                      onChange={(e) => handleOwnerChange(index, e.target.value)} 
                    />
                  </div>
                  {newOwners.length > 1 && (
                    <Button variant="ghost" size="icon" className="shrink-0 text-slate-500 hover:text-red-400" onClick={() => handleRemoveOwner(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-navy-700">
            <Input 
              label="Signatures Required" 
              type="number" 
              min="1" 
              max={Math.max(newOwners.length, 1)} 
              value={newRequiredSignatures} 
              onChange={(e) => setNewRequiredSignatures(e.target.value)} 
              description={`Must be between 1 and ${newOwners.length}`}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsUpgradeModalOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSubmitUpgrade}>Submit Upgrade</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
