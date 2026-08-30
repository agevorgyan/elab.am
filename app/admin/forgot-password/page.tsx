'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok && res.status === 429) {
        setErrorMsg(data.error || 'Too many reset requests. Please try again later.');
      } else {
        setSuccessMsg(data.message || 'If an account with that email exists, we sent a password reset link.');
        setEmail('');
      }
    } catch {
      setSuccessMsg('If an account with that email exists, we sent a password reset link.');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Logo */}
        <div className="text-center space-y-4">
          <BrandLogo href="/" className="h-14 sm:h-16 w-auto mx-auto" />
          <p className="text-xs text-slate-400">
            Secure Admin Workspace · Password Reset Request
          </p>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-xl font-black text-white">Forgot Password?</h1>
            <p className="text-xs text-slate-400">
              Enter your admin email address below and we will send you a link to reset your password.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-xl bg-[#00dc93]/10 border border-[#00dc93]/30 text-[#00dc93] text-xs flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>

              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#00dc93] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Admin Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-300 uppercase tracking-wider">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@elab.am"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-black text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Sending Request...' : 'Send Reset Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/admin/login"
                  className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
