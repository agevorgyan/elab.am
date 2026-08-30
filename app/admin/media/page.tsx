'use client';

import React from 'react';
import { Image as ImageIcon, Upload, Search, Trash2, Copy, Sparkles } from 'lucide-react';

export default function AdminMediaPage() {
  const mediaItems = [
    { name: 'gayanes-kitchen-cover.jpg', size: '184 KB', dims: '1200x800', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80' },
    { name: 'little-prince-cover.jpg', size: '210 KB', dims: '1200x800', url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80' },
    { name: 'tntes-am-cover.jpg', size: '195 KB', dims: '1200x800', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80' },
    { name: 'mercury-houses-cover.jpg', size: '240 KB', dims: '1200x800', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
    { name: 'deka-development-cover.jpg', size: '225 KB', dims: '1200x800', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
    { name: 'mijnaberd-cover.jpg', size: '190 KB', dims: '1200x800', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Media Library<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload, optimize, and organize project screenshots, cover images, and branding assets.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all">
          <Upload className="w-4 h-4 font-black" />
          <span>Upload New Image</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <div key={item.name} className="group rounded-2xl bg-[#141722] border border-white/10 overflow-hidden space-y-3 p-4">
            <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-white/5 relative">
              <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-extrabold text-white truncate">{item.name}</div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{item.dims}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
