"use client";

import Link from "next/link";
import { Clock, ChevronRight, Activity, ArrowRight, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";

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
    <Card className="border-none shadow-slate-200/40 overflow-visible">
      <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
             <Activity className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Clinical Feed</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time interaction log</p>
          </div>
        </div>
        <Link 
          href="/appointments" 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-accent transition-colors"
        >
          View Full Registry
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="divide-y divide-slate-50">
        {recentConsultations.length === 0 ? (
           <div className="p-20 text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
               <Clock className="w-8 h-8 text-slate-200" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No recent clinical records found</p>
           </div>
        ) : (
          recentConsultations.map((apt) => (
            <div key={apt._id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center min-w-[60px] py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-brand-primary/20 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                    {format(new Date(apt.consultationDate), "MMM")}
                  </span>
                  <span className="text-lg font-black text-slate-900 leading-none">
                    {format(new Date(apt.consultationDate), "dd")}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/patients/${apt.patientId?._id}`}
                      className="text-base font-black text-slate-900 hover:text-brand-primary transition-colors tracking-tight"
                    >
                      {apt.patientId?.name || "Anonymous Patient"}
                    </Link>
                    <Badge label="Acute" variant="primary" className="scale-75 origin-left" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {format(new Date(apt.consultationDate), "hh:mm a")}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-md italic">
                      &quot;{apt.symptoms}&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end mr-4">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                   <span className="text-[10px] font-black text-emerald-600 uppercase">Completed</span>
                </div>
                <Link
                  href={`/patients/${apt.patientId?._id}`}
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-white hover:shadow-lg hover:shadow-brand-primary/10 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live System Active</span>
         </div>
         <span className="text-[10px] font-medium text-slate-400 italic">Showing 5 most recent entries</span>
      </div>
    </Card>
  );
}
