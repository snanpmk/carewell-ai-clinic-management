"use client";

import { Sparkles, Loader2 } from "lucide-react";

interface PatientProfileSummaryCardProps {
  visitsCount: number;
  summaryLoading: boolean;
  aiSummary: string | undefined;
}

export function PatientProfileSummaryCard({ visitsCount, summaryLoading, aiSummary }: PatientProfileSummaryCardProps) {
  return (
    <div className="bg-linear-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 shadow-xl shadow-emerald-600/20 relative overflow-hidden text-white group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full pointer-events-none blur-3xl group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-800/20 rounded-tr-full pointer-events-none blur-2xl group-hover:scale-110 transition-transform duration-700" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-xs border border-white/10">
          <Sparkles className="w-5 h-5 text-emerald-50" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-50">Clinical Trajectory</h3>
      </div>
      
      <div className="text-[15px] text-emerald-50 leading-relaxed font-medium relative z-10 italic">
        {visitsCount === 0 ? (
          <span className="opacity-80">
            No visits recorded yet. Summary will generate after the first consultation.
          </span>
        ) : summaryLoading ? (
          <span className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl w-max backdrop-blur-sm border border-white/10">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-200" /> 
            <span className="text-sm tracking-tight">Distilling clinical history...</span>
          </span>
        ) : (
          aiSummary ? (
            <div className="relative">
              <span className="absolute -top-4 -left-3 text-4xl text-emerald-400/30 font-serif leading-none">&ldquo;</span>
              <span className="relative z-10">{aiSummary}</span>
              <span className="absolute -bottom-6 -right-3 text-4xl text-emerald-400/30 font-serif leading-none">&rdquo;</span>
            </div>
          ) : (
            <span className="opacity-80">Unable to generate insight summary.</span>
          )
        )}
      </div>
    </div>
  );
}
