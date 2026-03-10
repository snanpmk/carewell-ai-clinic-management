"use client";

import { Calendar, Search, Filter, Loader2, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllConsultations } from "@/services/consultationService";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
    <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both px-4 md:px-0 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
        <div>
          <h1>Medical Records</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium tracking-tight italic">Chronological archive of all clinical consultations.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200 shadow-inner">
          {["All", "Today", "Week"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 ${
                filter === f 
                  ? "bg-white text-slate-900 shadow-xl border border-slate-100" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
          <p className="eyebrow animate-pulse">Syncing clinical archive...</p>
        </div>
      ) : (
        /* Appointment List view */
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="relative flex-1 max-w-md w-full">
              <Input 
                placeholder="Search by patient, symptom or ID..." 
                leftIcon={<Search className="w-4 h-4" />}
                className="h-12"
              />
            </div>
            <div className="flex items-center gap-2">
               <p className="eyebrow !text-brand-primary mr-2">{consultations.length} RECORDS FOUND</p>
               <Button variant="outline" className="h-12 w-12 p-0 flex items-center justify-center rounded-2xl">
                 <Filter className="w-4 h-4" />
               </Button>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {consultations.length === 0 ? (
              <div className="py-32 text-center">
                <FileText className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <p className="eyebrow text-slate-300 tracking-widest">No clinical history found.</p>
              </div>
            ) : (
              consultations.map((apt: ConsultationRecord) => {
                const dateObj = new Date(apt.consultationDate);
                const dayStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                return (
                  <div key={apt._id} className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-slate-50/50 transition-all group gap-8">
                    <div className="flex items-center gap-10 flex-1 min-w-0">
                      <div className="flex flex-col items-center justify-center min-w-[90px] text-center bg-slate-50 border border-slate-100 p-4 rounded-3xl group-hover:bg-white group-hover:border-brand-primary/20 group-hover:shadow-lg transition-all duration-500">
                        <span className="text-xl font-black text-slate-900 leading-none italic">{timeStr.split(" ")[0]}</span>
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mt-1">{timeStr.split(" ")[1]}</span>
                      </div>
                      
                      <div className="h-14 w-px bg-slate-100 hidden sm:block" />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-primary transition-colors uppercase italic tracking-tight truncate max-w-md">
                            {apt.patientId?.name || "Anonymous Case"}
                          </h3>
                          <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-xs ${
                            apt.severity === 'severe' ? 'bg-red-50 text-red-600 border-red-100' : 
                            apt.severity === 'moderate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                          }`}>
                            {apt.severity || "Record"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 text-xs">
                          <span className="flex items-center gap-2 eyebrow !text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                            {dayStr}, {dateObj.getFullYear()}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          <span className="font-bold text-slate-500 italic truncate max-w-sm group-hover:text-slate-700 transition-colors">&quot;{apt.symptoms}&quot;</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                      <Button
                        onClick={() => router.push(`/patients/${apt.patientId?._id}`)}
                        variant="outline"
                        className="h-14 px-8 rounded-2xl group/btn"
                        rightIcon={<ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
                      >
                        Clinical Profile
                      </Button>
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
