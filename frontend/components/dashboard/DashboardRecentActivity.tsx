"use client";

import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";

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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-linear-to-r from-slate-50 to-white">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
           <Clock className="w-5 h-5 text-brand-primary" /> Recent Consultations
        </h2>
        <Link href="/appointments" className="text-sm font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-1 group">
          View All Records <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {recentConsultations.length === 0 ? (
           <div className="p-12 text-center text-slate-400 font-medium">No recent consultations found.</div>
        ) : (
          recentConsultations.map((apt) => (
            <div key={apt._id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
              <div className="flex items-center gap-8">
                <div className="text-center min-w-[80px]">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                    {new Date(apt.consultationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-[10px] font-bold text-slate-300">
                    {new Date(apt.consultationDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div>
                  <p className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors uppercase tracking-tight">{apt.patientId?.name || "Unknown Patient"}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-md italic">&quot;{apt.symptoms}&quot;</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100`}>
                  Record
                </span>
                <Link
                  href={`/patients/${apt.patientId?._id}`}
                  className="text-sm font-bold text-slate-400 hover:text-brand-primary border border-slate-200 px-4 py-2 rounded-lg hover:border-brand-accent hover:bg-white transition-all shadow-sm"
                >
                  Profile
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
