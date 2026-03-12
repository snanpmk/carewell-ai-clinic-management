"use client";

import { UnifiedVisitItem } from "./PatientProfileTimeline";
import { Pill } from "lucide-react";
import { clsx } from "clsx";

interface PatientManagementHistoryProps {
  visits: UnifiedVisitItem[];
}

export function PatientManagementHistory({ visits }: PatientManagementHistoryProps) {
  // Filter only visits that have prescriptions
  const prescriptionVisits = visits.filter(v => 
    v.prescription || (v.chronicData?.management?.firstPrescription?.medicines?.length)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-4 bg-brand-primary rounded-full" /> Remedy Trajectory
          </h3>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-1">Historical progression of prescriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {prescriptionVisits.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
            <Pill className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">No prescription history found</p>
          </div>
        ) : (
          prescriptionVisits.map((visit) => {
            const isChronic = visit.isChronic;
            interface MedicineItem {
              name: string;
              potency: string;
              dosage: string;
              form: string;
              dose?: string;
              medicine?: string;
            }
            let medicineItems: MedicineItem[] = [];
            
            if (isChronic) {
              const meds = visit.chronicData?.management?.firstPrescription?.medicines || [];
              medicineItems = meds.map(m => ({
                name: m.medicine || "",
                potency: m.potency || "",
                dosage: m.dose || "",
                form: m.form || ""
              }));
            } else {
              try {
                const rxArr = typeof visit.prescription === "string" && visit.prescription.startsWith("[") 
                  ? JSON.parse(visit.prescription) 
                  : (Array.isArray(visit.prescription) ? visit.prescription : null);
                
                if (Array.isArray(rxArr)) {
                  medicineItems = rxArr.map((m: MedicineItem) => ({
                    name: m.medicine || m.name || "",
                    potency: m.potency || "",
                    dosage: m.dosage || m.dose || "",
                    form: m.form || ""
                  }));
                } else {
                  medicineItems = [{ name: visit.prescription || "", potency: "", dosage: "", form: "" }];
                }
              } catch {
                medicineItems = [{ name: visit.prescription || "", potency: "", dosage: "", form: "" }];
              }
            }

            return (
              <div key={visit._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row">
                  {/* Date & Type Sidebar */}
                  <div className={clsx(
                    "md:w-40 p-5 flex md:flex-col items-center md:items-start justify-between md:justify-center gap-2 border-b md:border-b-0 md:border-r border-slate-100",
                    isChronic ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
                  )}>
                    <div className="space-y-1">
                      <p className={clsx("text-[10px] font-bold uppercase tracking-widest", isChronic ? "text-brand-accent" : "text-slate-500")}>
                        {new Date(visit.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-2xl font-semibold tracking-tight leading-none">
                        {new Date(visit.date).toLocaleDateString('en-IN', { day: '2-digit' })}
                      </p>
                    </div>
                    <span className={clsx(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                      isChronic ? "bg-white/10 border-white/20 text-white" : "bg-brand-primary/10 border-brand-primary/20 text-brand-primary"
                    )}>
                      {isChronic ? "Chronic" : "Acute"}
                    </span>
                  </div>

                  {/* Remedial Details */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-wrap gap-3">
                      {medicineItems.map((med, mIdx) => (
                        <div key={mIdx} className="bg-white border border-slate-100 rounded-xl p-4 flex-1 min-w-[200px] shadow-sm group-hover:border-brand-primary/30 transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Remedy {mIdx + 1}</span>
                            <Pill className="w-3.5 h-3.5 text-slate-300" />
                          </div>
                          <h4 className="text-base font-semibold text-slate-900 uppercase mb-1">{med.name}</h4>
                          <div className="flex items-center gap-3">
                            {med.potency && <span className="text-xs font-medium text-brand-primary">{med.potency}</span>}
                            {med.dosage && (
                              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                {med.dosage}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {(visit.additionalNotes || visit.doctorId) && (
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Prescribed by Dr. {visit.doctorId?.name || visit.doctor?.name || "Practitioner"}</span>
                        </div>
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
