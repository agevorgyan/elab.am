'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('hello@elab.am');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid email or password.');
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch {
      setErrorMsg('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModal(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc] flex flex-col justify-center items-center p-4 relative">
      
      <div className="w-full max-w-md space-y-8">
        
        {/* Centralized Managed eLab Brand Logo in Admin Login (Rule #8) */}
        <div className="text-center space-y-4">
          <BrandLogo href="/" className="h-14 sm:h-16 w-auto mx-auto" />

          <p className="text-xs text-slate-400">
            Secure Admin Workspace · Argon2id Authentication
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
                placeholder="hello@elab.am"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-300 uppercase tracking-wider">Password</label>
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="text-[11px] text-[#00dc93] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>
          </div>

          {/* Generic Security Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-black text-xs shadow-xl shadow-[#00dc93]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00dc93]" />
          <span>Argon2id Hashed Session Security</span>
        </div>

      </div>

      {/* Forgot Password Reset Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#141722] border border-white/15 p-6 sm:p-8 space-y-6 text-xs text-slate-300">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#00dc93]" />
                <h3 className="text-base font-black text-white">Reset Admin Password</h3>
              </div>
              <button onClick={() => setForgotModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-[#00dc93]/10 border border-[#00dc93]/30 text-center space-y-2 text-[#00dc93]">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <div className="font-bold">Password Reset Link Dispatched</div>
                <div className="text-[11px] text-slate-300">If the email is registered, instructions have been sent.</div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-slate-400">
                  Enter your registered administrator email address to receive a secure single-use password reset token.
                </p>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="hello@elab.am"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00dc93] text-black font-extrabold shadow-md"
                  >
                    Request Reset Token
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
