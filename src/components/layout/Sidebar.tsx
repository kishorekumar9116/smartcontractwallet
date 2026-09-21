import { NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { navigationLinks } from '../../config/navigation';
import { cn } from '../../lib/utils';

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-navy-700 bg-navy-900 sm:flex">
      <div className="flex h-16 items-center gap-3 border-b border-navy-700 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400">
          <Shield className="h-5 w-5 text-navy-900" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">SmartVault</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigationLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-400/10 text-teal-400"
                  : "text-slate-400 hover:bg-navy-800 hover:text-slate-200"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="border-t border-navy-700 p-4">
        <div className="rounded-xl bg-gradient-to-br from-navy-800 to-navy-700 p-4">
          <p className="text-xs font-medium text-slate-300">Smart Contract Wallet</p>
          <p className="mt-1 text-[10px] text-slate-500">v1.0.0-beta (Sepolia)</p>
        </div>
      </div>
    </aside>
  );
}
