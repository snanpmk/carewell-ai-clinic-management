"use client";

import Link from "next/link";
import { Clock, ChevronRight, Activity, ArrowRight, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { clsx } from "clsx";

export interface DashboardConsultationItem {
  _id: string;
  consultationDate: string;
  symptoms: string;
  opNumber?: string;
  status?: string;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
           <h2 className="text-xl font-light text-slate-900 tracking-tight">Recent <span className="font-semibold">Patient Stories</span></h2>
           <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-full uppercase tracking-wider">Live Feed</span>
        </div>
        <Link 
          href="/appointments" 
          className="text-xs font-semibold text-brand-primary hover:underline underline-offset-4"
        >
          See full registry
        </Link>
      </div>

      <Card className="border-none shadow-none bg-transparent overflow-visible">
        <div className="space-y-4">
          {recentConsultations.length === 0 ? (
             <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Clock className="w-6 h-6 text-slate-300" />
               </div>
               <p className="text-sm font-medium text-slate-400">The clinic is quiet right now. No recent records to show.</p>
             </div>
          ) : (
            recentConsultations.map((apt, index) => (
              <div 
                key={apt._id} 
                className={clsx(
                  "relative group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300",
                  "animate-in fade-in slide-in-from-bottom-2",
                  index === 0 ? "ring-2 ring-brand-primary/5 border-brand-primary/20" : ""
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 shrink-0 group-hover:bg-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                      <span className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">
                        {format(new Date(apt.consultationDate), "MMM")}
                      </span>
                      <span className="text-base font-bold text-slate-900 leading-none">
                        {format(new Date(apt.consultationDate), "dd")}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                        <Link 
                          href={`/patients/${apt.patientId?._id}`}
                          className="text-lg font-medium text-slate-900 hover:text-brand-primary transition-colors tracking-tight"
                        >
                          {apt.patientId?.name || "Anonymous Patient"}
                        </Link>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-xs font-semibold text-emerald-600">Acute Care</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-slate-500">
                        <div className="flex items-center gap-1.5">
                           <Clock className="w-3.5 h-3.5 opacity-60" />
                           <span className="text-xs font-medium">
                             {format(new Date(apt.consultationDate), "hh:mm a")}
                           </span>
                        </div>
                        <span className="hidden sm:inline text-slate-200">|</span>
                        <p className="text-sm font-light italic line-clamp-1 max-w-md">
                          &quot;{apt.symptoms}&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 sm:border-l sm:border-slate-100 sm:pl-8">
                    <div className="hidden lg:flex flex-col items-end mr-2">
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Outcome</span>
                       <span className="text-xs font-semibold text-slate-600">Saved to Registry</span>
                    </div>
                    <Link
                      href={`/patients/${apt.patientId?._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-brand-primary hover:text-white rounded-xl text-slate-600 text-sm font-medium transition-all group/btn"
                    >
                      View Notes
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Status Indicator for the very latest record */}
                {index === 0 && (
                  <div className="absolute -top-2 -left-2 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-primary border-2 border-white"></span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
