"use client";

import { Sparkles, Loader2 } from "lucide-react";

interface PatientProfileSummaryCardProps {
  visitsCount: number;
  summaryLoading: boolean;
  aiSummary: string | undefined;
}

export function PatientProfileSummaryCard({ visitsCount, summaryLoading, aiSummary }: PatientProfileSummaryCardProps) {
  return (
    <div className="bg-linear-to-br from-brand-secondary to-slate-900 rounded-3xl p-8 shadow-2xl shadow-brand-secondary/20 relative overflow-hidden text-white group transition-all duration-500">
      {/* Decorative Glows */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl group-hover:bg-brand-primary/30 transition-all duration-700 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl group-hover:bg-brand-accent/20 transition-all duration-700 pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
          <Sparkles className="w-6 h-6 text-brand-accent animate-pulse" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent/80 leading-none mb-1.5">AI Insights</h3>
          <p className="text-lg font-black text-white tracking-tight uppercase italic">Clinical Trajectory</p>
        </div>
      </div>
      
      <div className="relative z-10 italic">
        {visitsCount === 0 ? (
          <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-wide">
            No visits recorded yet. Summary will generate after the first consultation.
          </p>
        ) : summaryLoading ? (
          <div className="flex items-center gap-3 bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
            <Loader2 className="w-5 h-5 animate-spin text-brand-accent" /> 
            <span className="text-sm font-black uppercase tracking-widest text-brand-accent/70">Distilling history...</span>
          </div>
        ) : aiSummary ? (
          <div className="relative px-4">
            <span className="absolute -top-6 -left-2 text-6xl text-brand-primary/20 font-serif leading-none select-none">&ldquo;</span>
            <p className="text-sm md:text-base font-medium text-slate-100 leading-relaxed relative z-10">
              {aiSummary}
            </p>
            <span className="absolute -bottom-10 -right-2 text-6xl text-brand-primary/20 font-serif leading-none select-none">&rdquo;</span>
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">
            Unable to generate insight summary.
          </p>
        )}
      </div>
    </div>
  );
}
