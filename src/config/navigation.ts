import {
  LayoutDashboard,
  Send,
  Download,
  ArrowRightLeft,
  Users,
  ShieldCheck,
  Settings
} from 'lucide-react';

export const navigationLinks = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Send', href: '/send', icon: Send },
  { name: 'Receive', href: '/receive', icon: Download },
  { name: 'Swap', href: '/swap', icon: ArrowRightLeft },
  { name: 'Multisig', href: '/multisig', icon: Users },
  { name: 'Security', href: '/security', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];
