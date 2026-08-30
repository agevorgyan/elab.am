'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  Image as ImageIcon,
  Search,
  LogOut,
  Bell,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/leads', label: 'Leads & Mini CRM', icon: Users, badge: '2 New' },
    { href: '/admin/portfolio', label: 'Portfolio CMS', icon: Briefcase },
    { href: '/admin/content', label: 'Content & Services', icon: FileText },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { href: '/admin/seo', label: 'SEO Metadata', icon: Search },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc] flex">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0d0e14] border-r border-white/10 flex flex-col justify-between p-5 shrink-0 hidden md:flex">
        <div className="space-y-8">
          
          {/* Official eLab SVG Logo - Rendered 2x Scale (Rules #3, #17) */}
          <Link href="/admin/dashboard" className="block group">
            <img
              src="https://elab.am/wp-content/uploads/2024/02/Artboard-2.svg"
              alt="eLab Digital Studio Logo"
              className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="text-[10px] text-[#00dc93] font-bold uppercase tracking-widest mt-1">
              CMS + Mini CRM
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2">
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#00dc93] text-black shadow-lg shadow-[#00dc93]/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-black text-[#00dc93]' : 'bg-[#00dc93]/20 text-[#00dc93]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Session Footer & Logout (Rule #14) */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xs">
              AV
            </div>
            <div className="truncate">
              <div className="text-xs font-extrabold text-white truncate">Avetis (Super Admin)</div>
              <div className="text-[10px] text-[#00dc93] font-mono truncate">hello@elab.am</div>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 border border-white/5 transition-colors"
          >
            <span>View Public Site</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#00dc93]" />
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/10 bg-[#0d0e14] px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#00dc93]" />
            <span className="font-mono text-slate-300">Protected Admin Session (Argon2 Hashed)</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00dc93] animate-ping" />
              </button>
            </div>

            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </header>

        {/* Page Body Viewport */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
