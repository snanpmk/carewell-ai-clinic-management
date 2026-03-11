"use client";

import Link from "next/link";
import { Clock, ChevronRight, Activity, ExternalLink } from "lucide-react";

export interface DashboardConsultationItem {
  _id: string;
  consultationDate: string;
  symptoms: string;
  patientId?: {
    _id: string;
    name: string;
  };
}

interface DashboardRecentActivityProps {
  recentConsultations: DashboardConsultationItem[];
}

export function DashboardRecentActivity({ recentConsultations }: DashboardRecentActivityProps) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden transition-all duration-300">
      <div className="px-10 py-7 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-primary/10 rounded-xl">
             <Activity className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Recent Clinical Activity</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live Patient Interaction Log</p>
          </div>
        </div>
        <Link href="/appointments" className="text-xs font-black text-brand-primary uppercase tracking-widest hover:text-brand-accent transition-colors flex items-center gap-2 group border-b-2 border-brand-primary/10 hover:border-brand-accent/30 pb-1">
          Registry <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {recentConsultations.length === 0 ? (
           <div className="p-16 text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <Clock className="w-8 h-8 text-slate-200" />
             </div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No recent interactions logged.</p>
           </div>
        ) : (
          recentConsultations.map((apt) => (
            <div key={apt._id} className="px-10 py-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/80 transition-all group relative">
              <div className="flex items-center gap-8 mb-4 md:mb-0">
                <div className="text-left min-w-[100px] border-l-2 border-slate-100 pl-4 group-hover:border-brand-primary transition-colors">
                  <p className="text-xs font-black text-slate-900 tracking-tight uppercase italic">
                    {new Date(apt.consultationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                    {new Date(apt.consultationDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <div className="flex flex-col">
                  <p className="text-lg font-black text-slate-900 group-hover:text-brand-primary transition-colors uppercase tracking-tight italic">{apt.patientId?.name || "Unknown Patient"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Presenting:</span>
                    <p className="text-xs font-medium text-slate-500 line-clamp-1 max-w-sm italic">&quot;{apt.symptoms}&quot;</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Medical Log</span>
                </div>
                <Link
                  href={`/patients/${apt.patientId?._id}`}
                  className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-brand-primary hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/5 transition-all"
                  title="View Patient Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-10 py-4 bg-slate-50/30 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
         Auto-refresh enabled • High Fidelity Clinical Record System
      </div>
    </div>
  );
}
