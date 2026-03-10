"use client";

import { UnifiedVisitItem } from "./PatientProfileTimeline";
import { Pill, Activity, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

interface PatientManagementHistoryProps {
  visits: UnifiedVisitItem[];
}

export function PatientManagementHistory({ visits }: PatientManagementHistoryProps) {
  // Filter only visits that have prescriptions
  const prescriptionVisits = visits.filter(v => 
    v.prescription || (v.chronicData?.management?.firstPrescription?.medicine)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="p-8 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-3">
          Prescription Trajectory
        </h2>
        <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">Historical evolution of remedial measures</p>
      </div>

      <div className="divide-y divide-slate-50">
        {prescriptionVisits.length === 0 ? (
          <div className="p-20 text-center">
            <Pill className="w-12 h-12 text-slate-100 mx-auto mb-4" />
            <p className="eyebrow !text-slate-300">No prescriptions recorded yet</p>
          </div>
        ) : (
          prescriptionVisits.map((visit, idx) => {
            const isChronic = visit.isChronic;
            const medicine = isChronic 
              ? visit.chronicData?.management?.firstPrescription?.medicine 
              : visit.prescription;
            
            const details = isChronic
              ? `${visit.chronicData?.management?.firstPrescription?.potency || ""} ${visit.chronicData?.management?.firstPrescription?.dose || ""}`
              : visit.additionalNotes || "Standard Protocol";

            return (
              <div key={visit._id} className="p-8 hover:bg-slate-50/50 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={clsx(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:rotate-3",
                      isChronic ? "bg-slate-900 text-white shadow-slate-900/20" : "bg-brand-primary/10 text-brand-primary shadow-brand-primary/10"
                    )}>
                      {isChronic ? <Activity className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {new Date(visit.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className={clsx(
                          "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest",
                          isChronic ? "bg-slate-100 text-slate-600" : "bg-brand-primary/5 text-brand-primary"
                        )}>
                          {isChronic ? "Chronic" : "Acute"}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{medicine}</h3>
                      <p className="text-sm font-bold text-slate-500 mt-1">{details}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {idx < prescriptionVisits.length - 1 && (
                      <div className="hidden md:flex flex-col items-end opacity-40">
                        <span className="text-[10px] font-black uppercase tracking-widest mb-1">Previous</span>
                        <p className="text-xs font-bold text-slate-400">
                          {prescriptionVisits[idx+1].isChronic 
                            ? prescriptionVisits[idx+1].chronicData?.management?.firstPrescription?.medicine 
                            : prescriptionVisits[idx+1].prescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
