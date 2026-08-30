'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!token) {
      setErrorMsg('Invalid or missing password reset token.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to reset password.');
      } else {
        setSuccessMsg(data.message || 'Your password has been reset successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setErrorMsg('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 shadow-2xl space-y-6 text-center">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Invalid or missing reset token.</span>
        </div>
        <Link
          href="/admin/forgot-password"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#00dc93] hover:underline"
        >
          <span>Request a new password reset link</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 shadow-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl font-black text-white">Reset Your Password</h1>
        <p className="text-xs text-slate-400">
          Enter a new strong password for your eLab Admin account.
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
            className="w-full py-3.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span>Go to Admin Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-300 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-300 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-black text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Resetting Password...' : 'Reset Password & Update Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Logo */}
        <div className="text-center space-y-4">
          <BrandLogo href="/" className="h-14 sm:h-16 w-auto mx-auto" />
          <p className="text-xs text-slate-400">
            Secure Admin Workspace · Argon2id Password Reset
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Loading...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
