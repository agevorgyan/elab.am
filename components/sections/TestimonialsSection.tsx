'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '@/lib/translations';

interface TestimonialItem {
  id: string;
  name: string;
  company?: string | null;
  position?: string | null;
  content: string;
  photo?: string | null;
  rating: number;
}

interface TestimonialsSectionProps {
  lang?: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-[#0b0c10] border-y border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-bold text-[#00dc93]">
            <Quote className="w-3.5 h-3.5" />
            <span>Client Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What Our Partners Say<span className="text-[#00dc93]">.</span>
          </h2>
          <p className="text-sm text-slate-400">
            Real feedback from businesses and startups transformed by eLab digital solutions.
          </p>
        </div>

        {/* Testimonial Card Display */}
        <div className="max-w-3xl mx-auto relative">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#141722] border border-white/10 shadow-2xl space-y-6 text-center relative">
            
            {/* Star Rating */}
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-5 h-5 ${
                    idx < current.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Content Quote */}
            <blockquote className="text-lg sm:text-xl font-medium text-slate-100 italic leading-relaxed">
              &quot;{current.content}&quot;
            </blockquote>

            {/* Author Details */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
              {current.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.photo}
                  alt={current.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#00dc93]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#00dc93]/20 text-[#00dc93] flex items-center justify-center font-black text-lg border border-[#00dc93]/30">
                  {current.name.charAt(0)}
                </div>
              )}
              <div className="text-left">
                <div className="text-base font-extrabold text-white">{current.name}</div>
                <div className="text-xs text-slate-400">
                  {current.position ? `${current.position}, ` : ''}{current.company || 'Client'}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentIndex ? 'w-6 bg-[#00dc93]' : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
