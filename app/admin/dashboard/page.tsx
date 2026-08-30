'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_LEADS } from '@/lib/admin-store';
import { Users, Briefcase, FileText, TrendingUp, Plus, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';
import { HealthCheckResponse } from '@/app/api/health/route';

export default function AdminDashboardPage() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data: HealthCheckResponse) => setHealth(data))
      .catch(() => {
        setHealth({
          status: 'unhealthy',
          database: 'unhealthy',
          storage: 'unhealthy',
          config: 'unhealthy',
          timestamp: new Date().toISOString(),
        });
      });
  }, []);
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Good morning, eLab<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here is your live overview for <span className="text-white font-mono font-bold">elab.am</span> content, leads, and performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="px-4 py-2.5 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4 font-black" />
            <span>Add New Case Study</span>
          </Link>
        </div>
      </div>

      {/* Actionable Metrics Grid (Rule #9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-2xl bg-[#141722] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Leads</span>
            <div className="w-10 h-10 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">12</div>
          <div className="text-[11px] text-[#00dc93] font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3 new inquiries today</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#141722] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portfolio Cases</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">18</div>
          <div className="text-[11px] text-indigo-400 font-medium">6 Featured on Homepage</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#141722] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Services</span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">6</div>
          <div className="text-[11px] text-teal-400 font-medium">From 150,000 AMD</div>
        </div>

        <div className="p-6 rounded-2xl bg-[#141722] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Lead Response</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">15 min</div>
          <div className="text-[11px] text-amber-400 font-medium">99.4% SLA Target</div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Inquiries / Leads (Rule #9) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white">Recent Project Inquiries</h2>
              <p className="text-xs text-slate-400">Incoming submissions from elab.am contact form</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-[#00dc93] hover:underline flex items-center gap-1"
            >
              <span>View All Leads</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3 font-bold">Client Name</th>
                  <th className="pb-3 font-bold">Company</th>
                  <th className="pb-3 font-bold">Project Type</th>
                  <th className="pb-3 font-bold">Budget</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {INITIAL_LEADS.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-white">{lead.name}</td>
                    <td className="py-4 text-slate-300">{lead.company}</td>
                    <td className="py-4 text-slate-400 capitalize">{lead.projectType.replace('-', ' ')}</td>
                    <td className="py-4 font-mono text-[#00dc93] font-bold">{lead.budget}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        lead.status === 'New' ? 'bg-[#00dc93]/20 text-[#00dc93]' :
                        lead.status === 'Contacted' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Stream & Quick Settings */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
            <h3 className="text-base font-extrabold text-white">Recent Admin Activity</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                  <span>Avetis</span>
                  <span>Today 10:15</span>
                </div>
                <div className="text-white font-bold">Published case study: Gayane&apos;s Kitchen</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                  <span>Garegin</span>
                  <span>Yesterday 16:00</span>
                </div>
                <div className="text-white font-bold">Changed lead status to Contacted (Siranush M.)</div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                  <span>System</span>
                  <span>Aug 28</span>
                </div>
                <div className="text-white font-bold">Updated phone contact to +374 55 77 60 66</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#141722] to-[#181b26] border border-[#00dc93]/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00dc93]">
                <ShieldCheck className="w-4 h-4" />
                <span>Real System Health</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                health?.status === 'healthy' ? 'bg-[#00dc93]/20 text-[#00dc93]' :
                health?.status === 'degraded' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {health ? health.status.toUpperCase() : 'CHECKING...'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-300">PostgreSQL Database</span>
                <span className={`font-mono font-bold text-[11px] ${
                  health?.database === 'healthy' ? 'text-[#00dc93]' : 'text-red-400'
                }`}>
                  {health ? health.database : 'Checking...'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-300">Storage System</span>
                <span className={`font-mono font-bold text-[11px] ${
                  health?.storage === 'healthy' ? 'text-[#00dc93]' : 'text-red-400'
                }`}>
                  {health ? health.storage : 'Checking...'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-300">Environment Config</span>
                <span className={`font-mono font-bold text-[11px] ${
                  health?.config === 'healthy' ? 'text-[#00dc93]' : 'text-red-400'
                }`}>
                  {health ? health.config : 'Checking...'}
                </span>
              </div>
            </div>

            <Link
              href="/admin/settings"
              className="w-full py-2.5 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs text-center block shadow-md hover:opacity-90 transition-opacity"
            >
              Configure Site Settings →
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
