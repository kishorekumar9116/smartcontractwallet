import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, ShieldAlert } from 'lucide-react';

export function Multisig() {
  return (
    <div className="space-y-6">
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Current Configuration</p>
                  <p className="text-sm text-slate-400">1 out of 1 signatures required</p>
                </div>
                <Button variant="outline" size="sm">Upgrade to Multisig</Button>
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
    </div>
  );
}
