import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

export function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-navy-900 selection:bg-teal-400/30">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24 sm:p-8 sm:pb-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
