import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-slate-400">Manage your application preferences.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your SmartVault experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between border-b border-navy-700 pb-4">
            <div>
              <p className="font-medium text-white">Theme</p>
              <p className="text-sm text-slate-400">Select your preferred color theme.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-navy-800">Dark</Button>
              <Button variant="ghost" size="sm" disabled>Light</Button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-navy-700 pb-4">
            <div>
              <p className="font-medium text-white">Currency</p>
              <p className="text-sm text-slate-400">Primary display currency.</p>
            </div>
            <select className="rounded-md border border-navy-600 bg-navy-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-400">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Language</p>
              <p className="text-sm text-slate-400">Interface language.</p>
            </div>
            <select className="rounded-md border border-navy-600 bg-navy-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-teal-400">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
