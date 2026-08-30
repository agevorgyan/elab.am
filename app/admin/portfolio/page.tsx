'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '@/lib/portfolio-data';
import { Briefcase, Plus, Search, Edit3, Eye, Trash2, CheckCircle2, XCircle, Sparkles, Layers } from 'lucide-react';

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>(PORTFOLIO_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');

  const togglePublished = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Portfolio CMS Manager<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, feature, and organize case studies displayed across elab.am.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all">
          <Plus className="w-4 h-4 font-black" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141722] border border-white/10 flex items-center gap-4">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter project title or client..."
          className="w-full bg-transparent text-white text-xs focus:outline-none placeholder:text-slate-600"
        />
      </div>

      {/* Projects Table */}
      <div className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="pb-3 font-bold">Cover</th>
                <th className="pb-3 font-bold">Project Name</th>
                <th className="pb-3 font-bold">Client</th>
                <th className="pb-3 font-bold">Category</th>
                <th className="pb-3 font-bold">Featured</th>
                <th className="pb-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3">
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                      <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 font-extrabold text-white">{p.title}</td>
                  <td className="py-3 text-slate-300">{p.client}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 text-[#00dc93] font-bold border border-white/5">
                      {p.categoryLabel.en}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => togglePublished(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.featured ? 'bg-[#00dc93]/20 text-[#00dc93]' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {p.featured ? 'Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/work/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-[#00dc93]"
                        title="Preview Public Case Study"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
