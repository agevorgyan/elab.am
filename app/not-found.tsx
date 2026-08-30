import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Layers, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc] flex flex-col justify-between">
      
      {/* Simple Header */}
      <header className="p-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00dc93] to-[#3b82f6] p-[2px]">
              <div className="w-full h-full bg-[#0b0c10] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-lg text-white">e</span>
                <span className="font-bold text-lg text-[#00dc93]">L</span>
              </div>
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              eLab<span className="text-[#00dc93]">.am</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="max-w-3xl mx-auto px-4 text-center space-y-8 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-bold text-[#00dc93]">
          <Sparkles className="w-4 h-4" />
          <span>Error 404 — Page Not Found</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black text-white tracking-tighter">
          404<span className="text-[#00dc93]">.</span>
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Looking for something?</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you are trying to reach does not exist or has been moved. Let's get you back on track to explore eLab's digital solutions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/#portfolio"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#141722] border border-white/10 hover:border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Layers className="w-4 h-4 text-[#00dc93]" />
            <span>Explore Portfolio Work</span>
          </Link>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="p-6 border-t border-white/5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} eLab.am. All Rights Reserved.
      </footer>
    </div>
  );
}
