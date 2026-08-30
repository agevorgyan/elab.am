'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { DbPortfolioProject } from '@/lib/portfolio-db';
import { DbPortfolioCategory } from '@/lib/portfolio-categories';
import { PORTFOLIO_PROJECTS } from '@/lib/portfolio-data';
import { ExternalLink, X, ArrowUpRight, Layers, Sparkles } from 'lucide-react';

interface PortfolioSectionProps {
  lang: Language;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].portfolio;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [dbProjects, setDbProjects] = useState<DbPortfolioProject[]>([]);
  const [dbCategories, setDbCategories] = useState<DbPortfolioCategory[]>([]);
  const [selectedProject, setSelectedProject] = useState<DbPortfolioProject | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setDbProjects(data.projects);
        }
      })
      .catch(() => {});

    fetch('/api/portfolio/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setDbCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Map dbProjects or fallback to initial PORTFOLIO_PROJECTS
  const allList: DbPortfolioProject[] = dbProjects.length > 0
    ? dbProjects
    : PORTFOLIO_PROJECTS.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        client: p.client,
        category: p.category,
        categoryLabel: p.categoryLabel[lang] || p.category,
        summary: p.description[lang],
        overview: p.overview[lang],
        challenge: p.challenge[lang],
        solution: p.solution[lang],
        services: p.services,
        results: p.results ? p.results.map((r) => `${r.value} ${r.label}`) : [],
        year: String(p.year),
        liveUrl: p.websiteUrl,
        heroImage: p.coverImage,
        featured: p.featured,
        published: true,
        sortOrder: p.order,
        gallery: p.gallery ? p.gallery.map((url) => ({ url })) : [],
      }));

  // Categories list from database or default
  const categoriesList = dbCategories.length > 0
    ? dbCategories.map((c) => ({ id: c.slug, label: c.name }))
    : [
        { id: 'all', label: t.all },
        { id: 'corporate', label: t.corporate },
        { id: 'ecommerce', label: t.ecommerce },
        { id: 'landing-page', label: t.landingPage },
        { id: 'business-card', label: t.businessCard },
      ];

  const filteredProjects = activeCategory === 'all'
    ? allList
    : allList.filter((p) => p.category === activeCategory);

  const featuredProject = filteredProjects.find((p) => p.featured) || filteredProjects[0];
  const gridProjects = filteredProjects.filter((p) => p.id !== featuredProject?.id);

  return (
    <section id="portfolio" className="py-24 bg-[#090a0f] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#00dc93]">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Dynamic Database Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#00dc93] text-black shadow-lg shadow-[#00dc93]/20 scale-105'
                  : 'bg-[#141722] text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FEATURED HERO PROJECT */}
        {featuredProject && (
          <div
            onClick={() => setSelectedProject(featuredProject)}
            className="group cursor-pointer rounded-3xl bg-[#141722] border border-white/10 overflow-hidden hover:border-[#00dc93]/50 transition-all duration-500 mb-12 shadow-2xl hover:shadow-[#00dc93]/10 grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 relative h-72 lg:h-[420px] overflow-hidden bg-slate-900">
              <img
                src={featuredProject.heroImage || ''}
                alt={featuredProject.title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00dc93] text-black font-extrabold text-[11px] shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured Case Study</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[#00dc93] font-bold border border-white/10">
                    {featuredProject.categoryLabel || featuredProject.category}
                  </span>
                  <span className="font-mono text-slate-500 font-bold">{featuredProject.year}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#00dc93] transition-colors leading-tight">
                  {featuredProject.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {featuredProject.summary}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {featuredProject.services.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-white/5 text-[11px] font-mono text-slate-300 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#00dc93]">
                <span>{t.viewCase}</span>
                <div className="w-10 h-10 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 flex items-center justify-center group-hover:bg-[#00dc93] group-hover:text-black transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDITORIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer rounded-2xl bg-[#141722] border border-white/10 overflow-hidden hover:border-[#00dc93]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-[#00dc93]/10 flex flex-col justify-between"
            >
              <div className="relative h-60 overflow-hidden bg-slate-900">
                <img
                  src={project.heroImage || ''}
                  alt={project.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141722] via-transparent to-transparent opacity-80" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#0b0c10]/80 backdrop-blur-md text-[11px] font-bold text-[#00dc93] border border-white/10">
                    {project.categoryLabel || project.category}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-10 h-10 rounded-full bg-[#00dc93] text-black flex items-center justify-center shadow-lg">
                    <ArrowUpRight className="w-5 h-5 font-bold" />
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-white group-hover:text-[#00dc93] transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">{project.year}</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {project.services.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-300 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Work Link */}
        <div className="text-center pt-12">
          <Link
            href="/work"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00dc93]/50 text-white hover:text-[#00dc93] font-bold text-xs transition-all shadow-lg"
          >
            <span>View All Work &amp; Dedicated Case Studies</span>
            <ArrowUpRight className="w-4 h-4 text-[#00dc93]" />
          </Link>
        </div>

      </div>

      {/* Case Study Detailed Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#141722] border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-[#00dc93] uppercase tracking-wider">
                  {selectedProject.categoryLabel || selectedProject.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 max-h-80">
              <img
                src={selectedProject.heroImage || ''}
                alt={selectedProject.title}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/5 text-xs">
              <div>
                <div className="text-slate-400 font-medium">{t.modal.client}</div>
                <div className="text-white font-bold mt-0.5">{selectedProject.client}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">{t.modal.year}</div>
                <div className="text-white font-bold mt-0.5">{selectedProject.year}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">{t.modal.category}</div>
                <div className="text-white font-bold mt-0.5">{selectedProject.categoryLabel || selectedProject.category}</div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">Market</div>
                <div className="text-[#00dc93] font-bold mt-0.5">Armenia &amp; Global</div>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <div className="p-4 rounded-xl bg-[#0b0c10] border border-white/5 space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-red-400 tracking-wider">
                  {t.modal.challenge}
                </h4>
                <p className="text-slate-300">{selectedProject.challenge}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0b0c10] border border-white/5 space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-[#00dc93] tracking-wider">
                  {t.modal.solution}
                </h4>
                <p className="text-slate-300">{selectedProject.solution}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <Link
                href={`/work/${selectedProject.slug}`}
                onClick={() => setSelectedProject(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs text-center shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
              >
                Read Dedicated Case Study Page →
              </Link>

              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-xs text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{t.liveSite}</span>
                  <ExternalLink className="w-4 h-4 text-[#00dc93]" />
                </a>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
