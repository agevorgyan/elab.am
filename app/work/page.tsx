import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPortfolioProjects } from '@/lib/portfolio-db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Layers, ArrowUpRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Selected Work & Case Studies | eLab Digital Studio Armenia',
  description: 'Explore eLab\'s portfolio of high-converting websites, landing pages, e-commerce stores, and digital solutions engineered for Armenian and global businesses.',
  alternates: {
    canonical: 'https://elab.am/work',
  },
  openGraph: {
    title: 'eLab Portfolio — Web Development Case Studies',
    description: 'Explore eLab\'s selected portfolio of corporate portals, e-commerce stores, and high-converting landing pages.',
    url: 'https://elab.am/work',
  },
};

interface WorkPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams?.category || 'all';

  const projectsRaw = await getPublishedPortfolioProjects();
  const projects = (projectsRaw ?? []).map((p) => ({
    ...p,
    services: Array.isArray(p?.services) ? p.services : [],
    results: Array.isArray(p?.results) ? p.results : [],
  }));

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'landing-page', label: 'Landing Pages' },
    { id: 'business-card', label: 'Business Card' },
  ];

  const filteredProjects = currentCategory === 'all'
    ? projects
    : projects.filter((p) => p && p.category === currentCategory);

  const featuredProject = filteredProjects.find((p) => p?.featured) || filteredProjects[0];
  const gridProjects = filteredProjects.filter((p) => p && p.id !== featuredProject?.id);

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc]">
      <Header lang="en" />

      {/* Hero Section */}
      <section className="pt-36 pb-16 bg-grid-pattern relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-bold text-[#00dc93]">
            <Layers className="w-4 h-4" />
            <span>eLab Portfolio Showcase</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight">
            Selected Work<span className="text-[#00dc93]">.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A curated collection of web applications, e-commerce systems, and digital platforms engineered for growth, performance, and conversion.
          </p>

          {/* Category Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.id;
              const href = cat.id === 'all' ? '/work' : `/work?category=${cat.id}`;

              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#00dc93] text-black shadow-lg shadow-[#00dc93]/20 scale-105'
                      : 'bg-[#141722] text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Portfolio Presentation */}
      <section className="py-12 bg-[#090a0f] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Zero Projects Fallback */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16 rounded-3xl bg-[#141722] border border-white/10 space-y-3">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Portfolio Projects Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are currently no active case studies in this category.
              </p>
            </div>
          )}

          {/* FEATURED HERO PROJECT */}
          {featuredProject && (
            <Link
              href={`/work/${featuredProject.slug}`}
              className="group block rounded-3xl bg-[#141722] border border-white/10 overflow-hidden hover:border-[#00dc93]/50 transition-all duration-500 shadow-2xl hover:shadow-[#00dc93]/10 grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-7 relative h-72 lg:h-[450px] overflow-hidden bg-slate-900">
                <img
                  src={featuredProject.heroImage || ''}
                  alt={featuredProject.title || 'Featured Project'}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00dc93] text-black font-extrabold text-xs shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Case Study</span>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[#00dc93] font-bold border border-white/10">
                      {featuredProject.categoryLabel || featuredProject.category || 'Corporate'}
                    </span>
                    <span className="font-mono text-slate-500 font-bold">{featuredProject.year || ''}</span>
                  </div>

                  <h2 className="text-3xl font-black text-white group-hover:text-[#00dc93] transition-colors leading-tight">
                    {featuredProject.title}
                  </h2>

                  {featuredProject.summary && (
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {featuredProject.summary}
                    </p>
                  )}

                  {(featuredProject.services ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(featuredProject.services ?? []).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded bg-white/5 text-[11px] font-mono text-slate-300 border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#00dc93]">
                  <span>View Case Study</span>
                  <div className="w-10 h-10 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 flex items-center justify-center group-hover:bg-[#00dc93] group-hover:text-black transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* EDITORIAL GRID */}
          {gridProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/work/${project.slug}`}
                  className="group block rounded-2xl bg-[#141722] border border-white/10 overflow-hidden hover:border-[#00dc93]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
                >
                  <div className="relative h-60 overflow-hidden bg-slate-900">
                    <img
                      src={project.heroImage || ''}
                      alt={project.title || 'Project'}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141722] via-transparent to-transparent opacity-80" />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-[#0b0c10]/80 backdrop-blur-md text-[11px] font-bold text-[#00dc93] border border-white/10">
                        {project.categoryLabel || project.category || 'Corporate'}
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
                      <span className="text-xs font-mono text-slate-500">{project.year || ''}</span>
                    </div>

                    {project.summary && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>
                    )}

                    {(project.services ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                        {(project.services ?? []).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-300 border border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Contextual CTA */}
          <div className="p-10 rounded-3xl bg-gradient-to-r from-[#141722] via-[#181b26] to-[#141722] border border-[#00dc93]/30 text-center space-y-4 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white">Need a custom website or digital solution like these?</h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Tell us about your business goals and we will engineer a conversion-focused platform tailored to your market.
            </p>
            <div className="pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#00dc93] text-black font-extrabold text-xs shadow-xl shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
              >
                <span>Discuss Your Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
