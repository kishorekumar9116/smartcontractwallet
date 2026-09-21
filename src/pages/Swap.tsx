import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowDown } from 'lucide-react';

export function Swap() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Swap Tokens</h2>
        <p className="text-slate-400">Trade tokens instantly at the best prices.</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Swap</CardTitle>
          <CardDescription>Instantly trade your tokens.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-navy-700 bg-navy-900 p-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>You pay</span>
              <span>Balance: 0.00</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input 
                type="number" 
                placeholder="0.0" 
                className="w-full bg-transparent text-2xl font-medium text-white placeholder:text-slate-600 focus:outline-none"
              />
              <Button variant="secondary" className="shrink-0 bg-navy-700">ETH</Button>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-navy-800 border-navy-600">
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-xl border border-navy-700 bg-navy-900 p-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>You receive</span>
              <span>Balance: 0.00</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input 
                type="number" 
                placeholder="0.0" 
                readOnly
                className="w-full bg-transparent text-2xl font-medium text-white placeholder:text-slate-600 focus:outline-none"
              />
              <Button variant="secondary" className="shrink-0 bg-navy-700">USDC</Button>
            </div>
          </div>

          <Button className="w-full mt-4" disabled>Insufficient Balance</Button>
        </CardContent>
      </Card>
    </div>
  );
}
