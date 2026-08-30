'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Edit2,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  FileImage,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  path: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  alt?: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mimeFilter, setMimeFilter] = useState<'all' | 'image' | 'svg'>('all');

  // Modals & Active State
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [replacingId, setReplacingId] = useState<string | null>(null);
  
  // Feedback Messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const params = new URLSearchParams({
      page: String(page),
      limit: '12',
      search: searchQuery,
      filter: mimeFilter,
    });

    fetch(`/api/admin/media?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data.media)) {
          setMediaList(data.media);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.total || 0);
        }
      })
      .catch(() => {
        if (active) setErrorMsg('Failed to load media assets.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, searchQuery, mimeFilter]);

  const fetchMedia = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
        search: searchQuery,
        filter: mimeFilter,
      });

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data.media)) {
        setMediaList(data.media);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch {
      setErrorMsg('Failed to load media assets.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Successfully uploaded '${file.name}'`);
        fetchMedia();
      } else {
        setErrorMsg(data.error || 'Upload failed.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during upload.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleReplaceFile = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setReplacingId(id);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Replaced media with '${file.name}'`);
        fetchMedia();
      } else {
        setErrorMsg(data.error || 'Replacement failed.');
      }
    } catch {
      setErrorMsg('Error replacing media file.');
    } finally {
      setReplacingId(null);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAltText = async () => {
    if (!editingItem) return;

    try {
      const res = await fetch(`/api/admin/media/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt: editAltText }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Updated alt text successfully.');
        setEditingItem(null);
        fetchMedia();
      } else {
        setErrorMsg(data.error || 'Failed to update alt text.');
      }
    } catch {
      setErrorMsg('Error updating alt text.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete '${name}'? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Deleted '${name}' cleanly.`);
        fetchMedia();
      } else {
        setErrorMsg(data.error || 'Failed to delete media.');
      }
    } catch {
      setErrorMsg('Error deleting media file.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Media Storage &amp; Assets<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Production-ready media manager with MIME type validation, SVG security sanitization, and PostgreSQL metadata.
          </p>
        </div>

        <label className={`px-5 py-3 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 font-black" />}
          <span>{uploading ? 'Uploading...' : 'Upload New Image'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,image/avif"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#00dc93]/10 border border-[#00dc93]/30 text-[#00dc93] text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search media by filename or alt text..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141722] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00dc93]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => { setMimeFilter('all'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mimeFilter === 'all'
                ? 'bg-[#00dc93] text-black shadow-md'
                : 'bg-[#141722] text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            All Media ({totalItems})
          </button>
          <button
            onClick={() => { setMimeFilter('image'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mimeFilter === 'image'
                ? 'bg-[#00dc93] text-black shadow-md'
                : 'bg-[#141722] text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            Raster Images
          </button>
          <button
            onClick={() => { setMimeFilter('svg'); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mimeFilter === 'svg'
                ? 'bg-[#00dc93] text-black shadow-md'
                : 'bg-[#141722] text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            Vector SVGs
          </button>
        </div>

      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-24 text-xs text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-[#00dc93]" />
          <span>Loading production media assets...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#141722] border border-white/10 space-y-3">
          <FileImage className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No media files found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery ? `No files matched '${searchQuery}'` : 'Upload project screenshots, cover images, or brand assets to store them.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaList.map((item) => (
            <div key={item.id} className="group rounded-2xl bg-[#141722] border border-white/10 overflow-hidden space-y-3 p-4 hover:border-[#00dc93]/40 transition-all shadow-xl flex flex-col justify-between">
              
              <div className="h-48 rounded-xl overflow-hidden bg-slate-900 border border-white/5 relative flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.alt || item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setPreviewItem(item)}
                    title="Preview Image"
                    className="p-1.5 rounded-lg text-white hover:text-[#00dc93] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(item.id, item.url)}
                    title="Copy URL"
                    className="p-1.5 rounded-lg text-white hover:text-[#00dc93] transition-colors"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-[#00dc93]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setEditAltText(item.alt || '');
                    }}
                    title="Edit Alt Text"
                    className="p-1.5 rounded-lg text-white hover:text-[#00dc93] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <label
                    title="Replace Image File"
                    className="p-1.5 rounded-lg text-white hover:text-[#00dc93] cursor-pointer transition-colors"
                  >
                    {replacingId === item.id ? <RefreshCw className="w-4 h-4 animate-spin text-[#00dc93]" /> : <RefreshCw className="w-4 h-4" />}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,image/avif"
                      onChange={(e) => handleReplaceFile(item.id, e)}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    title="Delete Media"
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="font-extrabold text-white truncate">{item.name}</div>
                {item.alt && <div className="text-[11px] text-slate-400 italic truncate">Alt: &quot;{item.alt}&quot;</div>}
                
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-white/5">
                  <span className="uppercase">{item.mimeType.replace('image/', '')}</span>
                  <span>{formatSize(item.sizeBytes)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs">
          <span className="text-slate-400">
            Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span> ({totalItems} items total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3.5 py-2 rounded-xl bg-[#141722] border border-white/10 text-white font-bold hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3.5 py-2 rounded-xl bg-[#141722] border border-white/10 text-white font-bold hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#141722] border border-white/15 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white truncate">{previewItem.name}</h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-white/5 max-h-[60vh] flex items-center justify-center">
              <img
                src={previewItem.url}
                alt={previewItem.alt || previewItem.name}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs pt-2">
              <div className="space-y-0.5 text-slate-400">
                <div>MIME: <span className="text-white font-mono">{previewItem.mimeType}</span></div>
                <div>Size: <span className="text-white font-mono">{formatSize(previewItem.sizeBytes)}</span></div>
                {previewItem.alt && <div>Alt: <span className="text-[#00dc93]">&quot;{previewItem.alt}&quot;</span></div>}
              </div>

              <button
                onClick={() => handleCopyUrl(previewItem.id, previewItem.url)}
                className="px-4 py-2 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedId === previewItem.id ? 'Copied URL!' : 'Copy Public URL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Alt Text Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#141722] border border-white/15 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">Edit Media Alt Text</h3>
            <p className="text-xs text-slate-400 truncate">File: {editingItem.name}</p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Alt Text (Accessibility &amp; SEO)</label>
              <input
                type="text"
                value={editAltText}
                onChange={(e) => setEditAltText(e.target.value)}
                placeholder="Describe image for accessibility..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAltText}
                className="px-4 py-2 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
