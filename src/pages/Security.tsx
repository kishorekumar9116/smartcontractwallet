import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Key, AlertTriangle } from 'lucide-react';

export function Security() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Security</h2>
        <p className="text-slate-400">Manage your wallet's security settings and recovery options.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Recovery Options</CardTitle>
                <CardDescription>Set up social recovery or backup methods.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-navy-700 bg-navy-900 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-white">Social Recovery</p>
                  <p className="text-sm text-slate-400">Not configured</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 p-3 rounded-md">
                <AlertTriangle className="h-4 w-4" />
                <span>We strongly recommend setting up recovery.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400/10 text-teal-400">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Session Keys</CardTitle>
                <CardDescription>Manage authorized apps and sessions.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-lg border border-navy-700 bg-navy-900 p-4">
                <div>
                  <p className="font-medium text-white">No active sessions</p>
                  <p className="text-sm text-slate-400">You haven't authorized any dApps yet.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
