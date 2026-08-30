'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('hello@elab.am');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push('/admin/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc] flex flex-col justify-center items-center p-4">
      
      <div className="w-full max-w-md space-y-8">
        
        {/* Official eLab SVG Logo on Login Screen (Rules #1, #2) */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block group">
            <img
              src="https://elab.am/wp-content/uploads/2024/02/Artboard-2.svg"
              alt="eLab Digital Studio Logo"
              className="h-10 w-auto mx-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <p className="text-xs text-slate-400">
            Secure Authentication Portal for eLab Digital Studio Staff
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="p-8 rounded-3xl bg-[#141722] border border-white/10 shadow-2xl space-y-6"
        >
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-black text-xs shadow-xl shadow-[#00dc93]/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00dc93]" />
          <span>Role-Based Access Control Enabled (RBAC)</span>
        </div>

      </div>

    </div>
  );
}
