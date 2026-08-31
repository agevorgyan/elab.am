import React, { Suspense } from 'react';
import { getCurrentAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from './AdminLoginForm';

export default async function AdminLoginPage() {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc] flex flex-col justify-center items-center p-4 relative">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading auth portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}

