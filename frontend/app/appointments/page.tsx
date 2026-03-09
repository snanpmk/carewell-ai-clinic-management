"use client";

import { Calendar, Search, Filter, Loader2, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllConsultations } from "@/services/consultationService";

export default function AppointmentsPage() {
  const [filter, setFilter] = useState("All");

  const { data: response, isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: getAllConsultations,
  });

  interface ConsultationRecord {
    _id: string;
    consultationDate: string;
    severity?: string;
    symptoms: string;
    patientId?: {
      _id: string;
      name: string;
    };
  }

  const consultations = response?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-purple-100 rounded-xl"><FileText className="w-6 h-6 text-purple-600" /></div>
             Medical Records
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Chronological record of clinic consultations.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {["All", "Today", "Week"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                filter === f 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        /* Appointment List view */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-linear-to-r from-slate-50 to-white flex justify-between items-center gap-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find a specific record..." 
                className="w-full pl-11 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white transition-all font-medium"
              />
            </div>
            <button className="p-3 text-slate-400 hover:text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {consultations.length === 0 ? (
              <div className="py-24 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                Archive is empty.
              </div>
            ) : (
              consultations.map((apt: ConsultationRecord) => {
                const dateObj = new Date(apt.consultationDate);
                const dayStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                return (
                  <div key={apt._id} className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-blue-50/20 transition-all group gap-8">
                    <div className="flex items-center gap-10 flex-1">
                      <div className="flex flex-col items-center justify-center min-w-[100px] text-center">
                        <span className="text-xl font-black text-slate-900 leading-none">{timeStr.split(" ")[0]}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{timeStr.split(" ")[1]}</span>
                      </div>
                      
                      <div className="h-12 w-px bg-slate-100" />

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                            {apt.patientId?.name || "Anonymous Patient"}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            apt.severity === 'severe' ? 'bg-red-50 text-red-700 border-red-200' : 
                            apt.severity === 'moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {apt.severity || "Record"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <span className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-tighter">
                            <Calendar className="w-3 h-3" />
                            {dayStr}
                          </span>
                          <span className="text-slate-200">•</span>
                          <span className="font-bold text-slate-500 italic pl-1">&quot;{apt.symptoms}&quot;</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <Link
                        href={`/patients/${apt.patientId?._id}`}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-500 text-[10px] uppercase font-black tracking-widest rounded-xl hover:text-blue-600 hover:border-blue-400 hover:shadow-lg shadow-blue-100 transition-all active:scale-95 ml-auto flex items-center gap-2"
                      >
                        Profile History <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
