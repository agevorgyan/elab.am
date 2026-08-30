'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Download,
  Phone,
  Mail,
  Send,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Check,
  Filter,
} from 'lucide-react';

interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface LeadItem {
  id: string;
  name: string;
  company?: string | null;
  phone: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'WON' | 'LOST';
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: LeadNote[];
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter & Pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form states
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [assignName, setAssignName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const statuses = [
    { key: 'ALL', label: 'All' },
    { key: 'NEW', label: 'New' },
    { key: 'CONTACTED', label: 'Contacted' },
    { key: 'QUALIFIED', label: 'Qualified' },
    { key: 'PROPOSAL_SENT', label: 'Proposal Sent' },
    { key: 'WON', label: 'Won' },
    { key: 'LOST', label: 'Lost' },
  ];

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({
      page: String(page),
      limit: '10',
      search: searchTerm,
      status: statusFilter,
      sortBy,
      sortOrder,
    });

    fetch(`/api/admin/leads?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data.leads)) {
          setLeads(data.leads);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.total || 0);

          setSelectedLead((prev) => {
            if (prev) {
              const fresh = data.leads.find((l: LeadItem) => l.id === prev.id);
              if (fresh) {
                setAssignName(fresh.assignedTo || '');
                return fresh;
              }
            }
            if (data.leads.length > 0) {
              setAssignName(data.leads[0].assignedTo || '');
              return data.leads[0];
            }
            return null;
          });
        }
      })
      .catch(() => {
        if (active) setErrorMsg('Failed to fetch CRM leads.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        search: searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data.leads)) {
        setLeads(data.leads);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch {
      setErrorMsg('Failed to fetch CRM leads.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadItem['status']) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Status updated to '${newStatus}'`);
        fetchLeads();
      } else {
        setErrorMsg(data.error || 'Failed to update status.');
      }
    } catch {
      setErrorMsg('Error updating status.');
    }
  };

  const handleAssignLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: assignName }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Lead assigned to '${assignName || 'Unassigned'}'`);
        fetchLeads();
      } else {
        setErrorMsg(data.error || 'Failed to assign lead.');
      }
    } catch {
      setErrorMsg('Error assigning lead.');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNoteText.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewNoteText('');
        setSuccessMsg('Note added successfully.');
        fetchLeads();
      } else {
        setErrorMsg(data.error || 'Failed to add note.');
      }
    } catch {
      setErrorMsg('Error adding note.');
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete lead '${name}'? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Deleted lead '${name}' cleanly.`);
        setSelectedLead(null);
        fetchLeads();
      } else {
        setErrorMsg(data.error || 'Failed to delete lead.');
      }
    } catch {
      setErrorMsg('Error deleting lead.');
    }
  };

  const handleExportCSV = () => {
    window.open('/api/admin/leads/export', '_blank');
  };

  const getStatusBadge = (status: LeadItem['status']) => {
    switch (status) {
      case 'NEW':
        return 'bg-[#00dc93]/20 text-[#00dc93]';
      case 'CONTACTED':
        return 'bg-amber-500/20 text-amber-400';
      case 'QUALIFIED':
        return 'bg-blue-500/20 text-blue-400';
      case 'PROPOSAL_SENT':
        return 'bg-purple-500/20 text-purple-400';
      case 'WON':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'LOST':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Leads &amp; Mini CRM<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage incoming project inquiries, pipeline stages, client assignments, and internal communications.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-lg"
        >
          <Download className="w-4 h-4 text-[#00dc93]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#00dc93]/10 border border-[#00dc93]/30 text-[#00dc93] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#141722] border border-white/10">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, company, phone, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statuses.map((st) => (
            <button
              key={st.key}
              onClick={() => {
                setStatusFilter(st.key);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st.key
                  ? 'bg-[#00dc93] text-black shadow-md'
                  : 'bg-[#0b0c10] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

      </div>

      {/* Main CRM Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Leads Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white">Inquiries ({totalItems})</h2>
            <span className="text-xs font-mono text-[#00dc93]">PostgreSQL Pipeline</span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#00dc93]" />
              <span>Loading CRM leads from database...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400 space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No leads found in database matching query.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;

                return (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setAssignName(lead.assignedTo || '');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#181b26] border-[#00dc93] shadow-lg shadow-[#00dc93]/10'
                        : 'bg-[#0b0c10] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-white text-sm">{lead.name}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{lead.company || 'Private Inquiry'}</span>
                      <span className="font-mono text-[#00dc93] font-bold">{lead.budget}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {lead.message}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <span className="text-slate-400">
                Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Lead Detail & Notes Drawer */}
        {selectedLead ? (
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{selectedLead.id}</span>
                <h3 className="text-xl font-black text-white">{selectedLead.name}</h3>
                <p className="text-xs text-[#00dc93] font-bold">{selectedLead.company || 'Private Client'}</p>
              </div>

              {/* Status Change Selector */}
              <select
                value={selectedLead.status}
                onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadItem['status'])}
                className="px-3 py-1.5 rounded-xl bg-[#0b0c10] border border-[#00dc93]/40 text-[#00dc93] text-xs font-bold focus:outline-none"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PROPOSAL_SENT">Proposal Sent</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            {/* Direct Contact Links */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <a
                href={`tel:${selectedLead.phone}`}
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#00dc93]/40 flex items-center gap-2 text-white font-bold transition-colors"
              >
                <Phone className="w-4 h-4 text-[#00dc93]" />
                <span className="truncate">{selectedLead.phone}</span>
              </a>

              <a
                href={`mailto:${selectedLead.email}`}
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#00dc93]/40 flex items-center gap-2 text-white font-bold transition-colors"
              >
                <Mail className="w-4 h-4 text-[#00dc93]" />
                <span className="truncate">{selectedLead.email}</span>
              </a>
            </div>

            {/* Assignment Form */}
            <form onSubmit={handleAssignLead} className="flex gap-2">
              <input
                type="text"
                value={assignName}
                onChange={(e) => setAssignName(e.target.value)}
                placeholder="Assign to manager..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold transition-colors"
              >
                Assign
              </button>
            </form>

            {/* Project Details Box */}
            <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Project Type</span>
                <span className="text-white font-bold uppercase">{selectedLead.projectType}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimated Budget</span>
                <span className="text-[#00dc93] font-mono font-bold">{selectedLead.budget}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Source</span>
                <span className="text-slate-300 font-medium">{selectedLead.source}</span>
              </div>
              <div className="pt-2 border-t border-white/5 text-slate-300">
                <span className="text-slate-500 font-bold block mb-1">Message:</span>
                &quot;{selectedLead.message}&quot;
              </div>
            </div>

            {/* Internal Notes Feed */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Internal Client Notes ({selectedLead.notes?.length || 0})
                </h4>
                <button
                  onClick={() => handleDeleteLead(selectedLead.id, selectedLead.name)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Lead</span>
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-[#0b0c10] border border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{n.author?.name || 'Administrator'}</span>
                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-300">{n.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No notes added yet.</p>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add internal note..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-5 p-12 rounded-3xl bg-[#141722] border border-white/10 text-center text-xs text-slate-400">
            Select a lead from the list to view contact details, update status, and add internal notes.
          </div>
        )}

      </div>

    </div>
  );
}
