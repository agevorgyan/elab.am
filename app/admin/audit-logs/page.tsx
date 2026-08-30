'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  User,
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight,
  Activity,
  FileText,
  KeyRound,
  Trash2,
  PlusCircle,
  Edit3,
  LogIn,
  LogOut,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface AuditLogUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuditLogItem {
  id: string;
  userId: string | null;
  user: AuditLogUser | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  resource: string;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const loadLogs = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: '15',
          search: search.trim(),
          action: actionFilter,
          entityType: entityFilter,
        });

        const res = await fetch(`/api/admin/audit-logs?${query.toString()}`);
        const data = await res.json();

        if (isMounted && res.ok && data.logs) {
          setLogs(data.logs);
          setTotal(data.total);
          setTotalPages(data.totalPages || 1);
        }
      } catch {
        // safe error handling
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, [page, search, actionFilter, entityFilter, refreshKey]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setRefreshKey((k) => k + 1);
  };

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();

    if (act.includes('LOGIN_SUCCESS') || act.includes('SUCCESS')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
          <LogIn className="w-3 h-3" />
          <span>{action}</span>
        </span>
      );
    }

    if (act.includes('FAILED') || act.includes('FAIL') || act.includes('DELETE') || act.includes('DELETED')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold">
          {act.includes('FAILED') ? <AlertTriangle className="w-3 h-3" /> : <Trash2 className="w-3 h-3" />}
          <span>{action}</span>
        </span>
      );
    }

    if (act.includes('CREATE') || act.includes('CREATED') || act.includes('UPLOAD')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold">
          <PlusCircle className="w-3 h-3" />
          <span>{action}</span>
        </span>
      );
    }

    if (act.includes('UPDATE') || act.includes('UPDATED') || act.includes('EDIT')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold">
          <Edit3 className="w-3 h-3" />
          <span>{action}</span>
        </span>
      );
    }

    if (act.includes('PASSWORD') || act.includes('RESET') || act.includes('AUTH')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
          <KeyRound className="w-3 h-3" />
          <span>{action}</span>
        </span>
      );
    }

    if (act.includes('LOGOUT')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-bold">
          <LogOut className="w-3 h-3" />
          <span>{action}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">
        <Activity className="w-3 h-3" />
        <span>{action}</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            System Audit Logs<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Security &amp; administrative audit trail: Tracks logins, setting edits, content mutations, and security events.
          </p>
        </div>

        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="p-2.5 rounded-xl bg-[#141722] hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
          
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search action, resource, details, IP, or user email..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
            />
          </div>

          {/* Action Filter */}
          <div className="sm:col-span-3">
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
            >
              <option value="">All Actions</option>
              <option value="LOGIN_SUCCESS">Login Success</option>
              <option value="LOGIN_FAILED">Login Failed</option>
              <option value="LOGOUT">Logout</option>
              <option value="CHANGE_PASSWORD">Change Password</option>
              <option value="PASSWORD_RESET_COMPLETED">Password Reset</option>
              <option value="CREATE_PORTFOLIO_PROJECT">Portfolio Created</option>
              <option value="UPDATE_PORTFOLIO_PROJECT">Portfolio Updated</option>
              <option value="DELETE_PORTFOLIO_PROJECT">Portfolio Deleted</option>
              <option value="UPLOAD_MEDIA">Media Uploaded</option>
              <option value="DELETE_MEDIA">Media Deleted</option>
              <option value="CREATE_SERVICE">Service Created</option>
              <option value="UPDATE_SETTINGS">Settings Updated</option>
            </select>
          </div>

          {/* Entity Filter */}
          <div className="sm:col-span-3">
            <select
              value={entityFilter}
              onChange={(e) => {
                setEntityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
            >
              <option value="">All Entity Types</option>
              <option value="User">User Account</option>
              <option value="PortfolioProject">Portfolio Project</option>
              <option value="Lead">CRM Lead</option>
              <option value="Media">Media Asset</option>
              <option value="Service">Service</option>
              <option value="Settings">Site Settings</option>
            </select>
          </div>

        </form>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl bg-[#141722] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0b0c10] text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Actor / User</th>
                <th className="py-4 px-6">Resource / Entity</th>
                <th className="py-4 px-6">Details / Summary</th>
                <th className="py-4 px-6 text-right">IP &amp; Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-bold">
                    Loading audit trail from PostgreSQL...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-bold">
                    No matching audit log records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Timestamp */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>

                    {/* Actor */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {log.user ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#00dc93]/20 text-[#00dc93] flex items-center justify-center font-black text-[10px]">
                            {log.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{log.user.name}</div>
                            <div className="text-[10px] text-slate-500">{log.user.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">System / Anonymous</span>
                      )}
                    </td>

                    {/* Resource / Entity */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-mono text-xs text-white font-bold">
                        {log.resource}
                      </div>
                      {log.entityType && (
                        <div className="text-[10px] text-slate-500">
                          {log.entityType} {log.entityId ? `(#${log.entityId.slice(-6)})` : ''}
                        </div>
                      )}
                    </td>

                    {/* Details */}
                    <td className="py-4 px-6 max-w-xs truncate">
                      <span className="text-slate-300" title={log.details || ''}>
                        {log.details || '—'}
                      </span>
                    </td>

                    {/* IP & Client */}
                    <td className="py-4 px-6 text-right whitespace-nowrap font-mono text-[11px]">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 text-slate-400 border border-white/5">
                        <Globe className="w-3 h-3 text-slate-500" />
                        <span>{log.ipAddress || '127.0.0.1'}</span>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-[#0b0c10] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing total <span className="font-bold text-white">{total}</span> audit records
          </div>

          <div className="flex items-center gap-4">
            <span>
              Page <span className="font-bold text-white">{page}</span> of{' '}
              <span className="font-bold text-white">{totalPages}</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
