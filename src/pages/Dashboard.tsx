import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-slate-400">Welcome back to your SmartVault.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Balance Card */}
        <Card className="col-span-full md:col-span-2 lg:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border-navy-700/50">
          <CardHeader>
            <CardTitle className="text-slate-400">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-white tracking-tight">
              0.000 <span className="text-2xl text-teal-400">ETH</span>
            </div>
            <div className="text-slate-400">$0.00 USD</div>
            
            <div className="flex flex-wrap gap-3 pt-4">
              <Button className="gap-2">
                <ArrowUpRight className="h-4 w-4" /> Send
              </Button>
              <Button variant="outline" className="gap-2">
                <ArrowDownLeft className="h-4 w-4" /> Receive
              </Button>
              <Button variant="ghost" className="gap-2">
                <Plus className="h-4 w-4" /> Buy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Network Status</CardTitle>
            <CardDescription>Sepolia Testnet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-navy-700 pb-2">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Online
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-navy-700 pb-2">
                <span className="text-slate-400">Block Height</span>
                <span className="text-white">5,432,109</span>
              </div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-slate-400">Gas Price</span>
                <span className="text-white">12 Gwei</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-navy-700 bg-navy-800/50">
            <p className="text-sm text-slate-500">No recent transactions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
