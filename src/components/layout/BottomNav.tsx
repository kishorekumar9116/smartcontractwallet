import { NavLink } from 'react-router-dom';
import { navigationLinks } from '../../config/navigation';
import { cn } from '../../lib/utils';

export function BottomNav() {
  // Only show top 5 items on mobile to avoid overcrowding
  const mobileLinks = navigationLinks.slice(0, 5);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-navy-700 bg-navy-900/90 pb-safe backdrop-blur-lg sm:hidden">
      <nav className="flex items-center justify-around px-2 h-16">
        {mobileLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                isActive
                  ? "text-teal-400"
                  : "text-slate-400 hover:text-slate-200"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
