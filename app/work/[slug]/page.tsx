import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PORTFOLIO_PROJECTS } from '@/lib/portfolio-data';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ExternalLink, ArrowRight, Check, Sparkles, Quote, Layers, Cpu } from 'lucide-react';

interface CaseStudyProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return PORTFOLIO_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PORTFOLIO_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found | eLab.am',
    };
  }

  return {
    title: `${project.title} — Case Study | eLab Digital Studio`,
    description: project.description.en,
    openGraph: {
      title: `${project.title} — eLab Web Development Case Study`,
      description: project.description.en,
      url: `https://elab.am/work/${project.slug}`,
      images: [{ url: project.coverImage }],
    },
    alternates: {
      canonical: `https://elab.am/work/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = await params;
  const projectIndex = PORTFOLIO_PROJECTS.findIndex((p) => p.slug === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = PORTFOLIO_PROJECTS[projectIndex];
  const nextProjectIndex = (projectIndex + 1) % PORTFOLIO_PROJECTS.length;
  const nextProject = PORTFOLIO_PROJECTS[nextProjectIndex];

  // Schema.org Structured Data for CreativeWork Case Study (Rule #39)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.description.en,
    image: project.coverImage,
    author: {
      '@type': 'Organization',
      name: 'eLab Digital Studio',
      url: 'https://elab.am',
    },
    provider: {
      '@type': 'Organization',
      name: project.client,
    },
    url: `https://elab.am/work/${project.slug}`,
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header lang="en" />

      {/* Case Study Hero (Rule #12) */}
      <section className="pt-36 pb-20 bg-grid-pattern relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Link href="/" className="hover:text-[#00dc93] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/work" className="hover:text-[#00dc93] transition-colors">Work</Link>
            <span>/</span>
            <span className="text-white font-bold">{project.title}</span>
          </div>

          <div className="max-w-4xl space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-bold text-[#00dc93] inline-block uppercase tracking-wider">
              {project.categoryLabel.en}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              {project.description.en}
            </p>
          </div>

          {/* Project Metadata Block (Rule #14) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#141722] border border-white/10 text-xs">
            <div>
              <div className="text-slate-400 font-medium">CLIENT</div>
              <div className="text-white font-bold text-sm mt-0.5">{project.client}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">YEAR</div>
              <div className="text-white font-bold text-sm mt-0.5">{project.year}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">SERVICES</div>
              <div className="text-[#00dc93] font-bold text-sm mt-0.5">{project.services.join(', ')}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">TECHNOLOGY</div>
              <div className="text-white font-bold text-sm mt-0.5">{project.technologies.slice(0, 3).join(', ')}</div>
            </div>
          </div>

          {/* Large Hero Image (Rule #12) */}
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 max-h-[550px]">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover object-top"
            />
          </div>

        </div>
      </section>

      {/* Case Study Details Narrative (Rule #13 - #26) */}
      <section className="py-20 bg-[#0d0e14] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Overview (Rule #13) */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#00dc93] uppercase tracking-widest">
              Overview
            </h2>
            <p className="text-base text-slate-300 leading-relaxed font-normal">
              {project.overview.en}
            </p>
          </div>

          {/* Challenge & Solution Grid (Rule #15 & #16) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-xl font-extrabold text-white">The Challenge</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.challenge.en}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#141722] border border-[#00dc93]/30 space-y-4 shadow-xl shadow-[#00dc93]/5">
              <div className="w-10 h-10 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-xl font-extrabold text-white">The Solution</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {project.solution.en}
              </p>
            </div>
          </div>

          {/* Measurable Results (Rule #21) */}
          {project.results && project.results.length > 0 && (
            <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Key Performance Results
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {project.results.map((res) => (
                  <div key={res.label} className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                    <div className="text-3xl font-black text-[#00dc93] font-mono">{res.value}</div>
                    <div className="text-xs text-slate-300 font-medium">{res.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real Client Testimonial (Rule #22) */}
          {project.testimonial && (
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#141722] to-[#181b26] border border-[#00dc93]/30 relative space-y-4 shadow-xl">
              <Quote className="w-10 h-10 text-[#00dc93]/30" />
              <p className="text-base sm:text-lg italic text-white leading-relaxed">
                "{project.testimonial.quote}"
              </p>
              <div>
                <div className="text-sm font-bold text-white">{project.testimonial.author}</div>
                <div className="text-xs text-[#00dc93]">{project.testimonial.title}</div>
              </div>
            </div>
          )}

          {/* Technical Implementation & Integrations (Rule #19 & #20) */}
          <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Technical Implementation & Integrations
            </h3>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 mb-2">Built With</div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3.5 py-1.5 rounded-xl bg-[#00dc93]/10 border border-[#00dc93]/30 text-[#00dc93] text-xs font-mono font-bold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.integrations && project.integrations.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs text-slate-400 mb-2">Systems Integrated</div>
                  <div className="flex flex-wrap gap-2">
                    {project.integrations.map((item) => (
                      <span key={item} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Website Link (Rule #23) */}
          {project.websiteUrl && (
            <div className="text-center pt-4">
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#00dc93] text-black font-extrabold text-sm shadow-xl shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}

          {/* Project Contextual CTA (Rule #24) */}
          <div className="p-10 rounded-3xl bg-gradient-to-br from-[#141722] to-[#181b26] border border-white/10 text-center space-y-4">
            <h3 className="text-2xl font-black text-white">Like what you see?</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Let's discuss how eLab can design and engineer a similar solution for your business.
            </p>
            <div className="pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
              >
                <span>Discuss Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* NEXT PROJECT NAVIGATION (Rule #25) */}
          <div className="pt-16 border-t border-white/10 space-y-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Next Case Study →
            </div>

            <Link
              href={`/work/${nextProject.slug}`}
              className="group block p-8 rounded-3xl bg-[#141722] border border-white/10 hover:border-[#00dc93]/50 transition-all duration-300 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#00dc93] uppercase">
                    {nextProject.categoryLabel.en}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#00dc93] transition-colors">
                    {nextProject.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                    {nextProject.description.en}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#00dc93] group-hover:text-black flex items-center justify-center text-white shrink-0 transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}
