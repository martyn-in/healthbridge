'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Calendar,
  FileText,
  AlertCircle,
  Activity,
  Cpu,
  ShieldCheck,
  LogOut
} from 'lucide-react';

const ADMIN_NAVIGATION = [
  { group: 'Overview', items: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  ]},
  { group: 'People', items: [
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Doctor Verification', href: '/admin/doctors/verification', icon: UserPlus },
  ]},
  { group: 'Operations', items: [
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Emergency Activity', href: '/admin/emergency', icon: AlertCircle },
  ]},
  { group: 'Platform', items: [
    { name: 'AI & Knowledge', href: '/admin/ai', icon: Cpu },
    { name: 'System Health', href: '/admin/system', icon: Activity },
    { name: 'Audit Logs', href: '/admin/audit', icon: ShieldCheck },
  ]}
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#1e1f2e] text-slate-300 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Logo size="sm" showText={false} />
            </div>
            <span className="font-bold tracking-tight text-sm">HealthBridge Admin</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {ADMIN_NAVIGATION.map((group, idx) => (
            <div key={idx} className="mb-6">
              <div className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-indigo-500 text-white shadow-sm' 
                          : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <a
            href="/api/auth/logout"
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            Sign Out
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden relative">
        {/* Subtle decorative top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
        
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
