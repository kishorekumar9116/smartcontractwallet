import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Send() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Send Assets</h2>
        <p className="text-slate-400">Transfer tokens to another address.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Send transaction</CardTitle>
          <CardDescription>Enter the recipient address and amount.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Recipient Address</label>
            <input 
              type="text" 
              placeholder="0x..." 
              className="w-full rounded-md border border-navy-600 bg-navy-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Amount</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="0.0" 
                className="flex-1 rounded-md border border-navy-600 bg-navy-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <Button variant="outline">Max</Button>
            </div>
          </div>
          <Button className="w-full mt-4">Review Transaction</Button>
        </CardContent>
      </Card>
    </div>
  );
}
