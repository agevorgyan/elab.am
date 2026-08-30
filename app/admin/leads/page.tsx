'use client';

import React, { useState } from 'react';
import { INITIAL_LEADS, Lead } from '@/lib/admin-store';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [newNoteText, setNewNoteText] = useState<string>('');

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      text: newNoteText.trim(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: 'Avetis',
    };

    const updatedLead = {
      ...selectedLead,
      notes: [...(selectedLead.notes || []), newNote],
    };

    setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? updatedLead : l)));
    setSelectedLead(updatedLead);
    setNewNoteText('');
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Company,Phone,Email,ProjectType,Budget,Status,CreatedAt'];
    const rows = leads.map(
      (l) =>
        `"${l.id}","${l.name}","${l.company}","${l.phone}","${l.email}","${l.projectType}","${l.budget}","${l.status}","${l.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `elab_leads_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Leads & Mini CRM<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage incoming project inquiries, pipeline stages, and internal client communications.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-[#00dc93]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#141722] border border-white/10">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, company, phone, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-[#00dc93] text-black'
                  : 'bg-[#0b0c10] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Main CRM Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Leads Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white">Inquiries ({filteredLeads.length})</h2>
            <span className="text-xs font-mono text-[#00dc93]">Live Pipeline</span>
          </div>

          <div className="space-y-3">
            {filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#181b26] border-[#00dc93] shadow-lg shadow-[#00dc93]/10'
                      : 'bg-[#0b0c10] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-white text-sm">{lead.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      lead.status === 'New' ? 'bg-[#00dc93]/20 text-[#00dc93]' :
                      lead.status === 'Contacted' ? 'bg-amber-500/20 text-amber-400' :
                      lead.status === 'Won' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {lead.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{lead.company}</span>
                    <span className="font-mono text-[#00dc93] font-bold">{lead.budget}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    {lead.message}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lead Detail & Notes Drawer (Rule #44 & #45) */}
        {selectedLead ? (
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{selectedLead.id}</span>
                <h3 className="text-xl font-black text-white">{selectedLead.name}</h3>
                <p className="text-xs text-[#00dc93] font-bold">{selectedLead.company}</p>
              </div>

              {/* Status Change Selector */}
              <select
                value={selectedLead.status}
                onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as Lead['status'])}
                className="px-3 py-1.5 rounded-xl bg-[#0b0c10] border border-[#00dc93]/40 text-[#00dc93] text-xs font-bold focus:outline-none"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
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
              <div className="pt-2 border-t border-white/5 text-slate-300">
                <span className="text-slate-500 font-bold block mb-1">Message:</span>
                "{selectedLead.message}"
              </div>
            </div>

            {/* Internal Notes Feed (Rule #45) */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Internal Client Notes
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedLead.notes?.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-[#0b0c10] border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{n.author}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-slate-300">{n.text}</p>
                  </div>
                ))}
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
                  className="px-4 py-2 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center justify-center shrink-0"
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
