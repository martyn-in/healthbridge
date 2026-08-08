'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { 
  LayoutDashboard, 
  Users, 
  Calendar,
  FileText,
  UserCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const DOCTOR_NAV = [
  { label: 'Overview', href: '/doctor', icon: LayoutDashboard },
  { label: 'Patients', href: '/doctor/patients', icon: Users },
  { label: 'Appointments', href: '/doctor/appointments', icon: Calendar },
  { label: 'Reports', href: '/doctor/reports', icon: FileText },
  { label: 'Profile', href: '/doctor/profile', icon: UserCircle },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Exclude verification page from sidebar layout
  if (pathname === '/doctor/verification') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-[var(--text-primary)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-[#2F3273] text-white flex items-center justify-center">
            <Logo size="sm" showText={false} />
          </div>
          <div>
            <div className="font-black text-sm text-[#2F3273] tracking-tight">HealthBridge</div>
            <div className="text-[10px] font-bold text-[#4D50A2] uppercase tracking-wider">Clinical</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Workflow</div>
          {DOCTOR_NAV.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive 
                    ? 'bg-[#4D50A2]/10 text-[#4D50A2]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#4D50A2]' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Nav Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2F3273] text-white flex items-center justify-center">
            <Logo size="sm" showText={false} />
          </div>
          <span className="font-black text-sm text-[#2F3273] tracking-tight">Clinical</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-500">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col p-4 border-t border-slate-100">
           {DOCTOR_NAV.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-bold transition-colors ${
                  isActive 
                    ? 'bg-[#4D50A2]/10 text-[#4D50A2]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'text-[#4D50A2]' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
          <div className="mt-auto pt-4 border-t border-slate-100">
             <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-4 rounded-xl text-base font-bold text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-6 h-6" />
                Sign Out
              </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col h-screen overflow-y-auto lg:pt-0 pt-16">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
