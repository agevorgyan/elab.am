'use client';

import React from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { Cpu } from 'lucide-react';

interface TechStackProps {
  lang: Language;
}

export const TechStack: React.FC<TechStackProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].tech;

  const technologies = [
    { name: 'Next.js', category: 'Frontend & SSR', desc: 'Blazing fast React Framework' },
    { name: 'React', category: 'UI Library', desc: 'Interactive User Interfaces' },
    { name: 'TypeScript', category: 'Language', desc: 'Type-safe strict code' },
    { name: 'Tailwind CSS', category: 'Styling', desc: 'Modern Utility-first CSS' },
    { name: 'Node.js / NestJS', category: 'Backend API', desc: 'Scalable Microservices' },
    { name: 'PHP & WordPress', category: 'CMS Engine', desc: 'Easy Content Management' },
    { name: 'WooCommerce', category: 'E-Commerce', desc: 'Robust Online Shopping' },
    { name: 'PostgreSQL', category: 'Database', desc: 'High-performance SQL' },
  ];

  return (
    <section id="tech" className="py-24 bg-[#0d0e14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#00dc93]">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="p-6 rounded-2xl bg-[#141722] border border-white/10 hover:border-[#00dc93]/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <span className="text-[10px] font-mono text-[#00dc93] font-bold block uppercase tracking-wider mb-1">
                {tech.category}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-[#00dc93] transition-colors">
                {tech.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
