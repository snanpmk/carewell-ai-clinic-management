"use client";

import { Activity, Clock, FileText, Sparkles, ChevronDown, ChevronUp, Pill, Printer } from "lucide-react";
import { ChronicCase } from "@/types/chronicCase";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { ChronicCaseDetails } from "./ChronicCaseDetails";
import { clsx } from "clsx";
import { generatePrescriptionPDF } from "@/lib/pdfGenerator";

export interface UnifiedVisitItem {
  _id: string;
  isChronic?: boolean;
  date: Date;
  symptoms?: string;
  modalities?: string;
  generals?: string;
  mentals?: string;
  diagnosis?: string;
  prescription?: string;
  doctorEditedNotes?: string | Record<string, unknown>;
  aiGeneratedNotes?: string | Record<string, unknown>;
  additionalNotes?: string;
  chronicData?: ChronicCase;
  doctorId?: {
    _id: string;
    name: string;
    profileImage?: string;
    licenseNumber?: string;
  };
  doctor?: {
    _id: string;
    name: string;
    profileImage?: string;
    licenseNumber?: string;
  };
  opNumber?: string;
}

interface Patient {
  name: string;
  age: number;
  gender: string;
}

interface MedicineItem {
  medicine: string;
  potency: string;
  form: string;
  dosage: string;
  dose?: string;
  name?: string;
  quantity?: string;
}

interface PatientProfileTimelineProps {
  visits: UnifiedVisitItem[];
  patient: Patient;
}

export function PatientProfileTimeline({ visits, patient }: PatientProfileTimelineProps) {
  const { user } = useAuthStore();
  const aiEnabled = user?.clinic?.aiEnabled ?? true;
  const [expandedCases, setExpandedCases] = useState<Record<string, boolean>>({});

  const toggleCase = (id: string) => {
    setExpandedCases((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrintVisit = (visit: UnifiedVisitItem) => {
    let adviceText = "";
    let aiNotes: Record<string, string> | null = null;

    try {
      if (typeof visit.aiGeneratedNotes === "string") {
        aiNotes = JSON.parse(visit.aiGeneratedNotes) as Record<string, string>;
      } else if (typeof visit.aiGeneratedNotes === "object") {
        aiNotes = visit.aiGeneratedNotes as Record<string, string>;
      }
    } catch {
      // ignore
    }

    try {
      if (typeof visit.doctorEditedNotes === "string") {
        if (visit.doctorEditedNotes.startsWith("{")) {
          const parsed = JSON.parse(visit.doctorEditedNotes) as Record<string, string>;
          adviceText = parsed.advice || "";
        } else {
          adviceText = visit.doctorEditedNotes;
        }
      } else if (typeof visit.doctorEditedNotes === "object" && visit.doctorEditedNotes !== null) {
        const edited = visit.doctorEditedNotes as Record<string, string>;
        adviceText = edited.advice || "";
      }
    } catch {
      // ignore
    }

    if (!adviceText) adviceText = (aiNotes?.advice as string) || "";

    // Parse medicines from prescription string or array
    let prescriptions: MedicineItem[] = [];
    const p = visit.prescription;
    
    if (visit.isChronic && visit.chronicData?.management?.firstPrescription?.medicines) {
      prescriptions = visit.chronicData.management.firstPrescription.medicines.map(m => ({
        medicine: m.medicine || "",
        potency: m.potency || "",
        form: m.form || "Pills",
        dosage: m.dose || ""
      }));
    } else if (p) {
      try {
        const rxArr = typeof p === "string" && p.startsWith("[") ? JSON.parse(p) as MedicineItem[] : (Array.isArray(p) ? p as MedicineItem[] : null);
        if (Array.isArray(rxArr)) {
          prescriptions = rxArr.map((m: MedicineItem) => ({
            medicine: m.medicine || m.name || "",
            potency: m.potency || "",
            form: m.form || "Pills",
            dosage: m.dosage || m.dose || ""
          }));
        } else {
           // Fallback for simple string format "Med Potency (Form) - Dose"
           const items = (p as string).split(", ").map(item => {
             const parts = item.match(/(.+)\s+(\w+)\s+\((\w+)\)\s+-\s+(.+)/);
             if (parts) return { medicine: parts[1], potency: parts[2], form: parts[3], dosage: parts[4] };
             return { medicine: item, potency: "", form: "", dosage: "" };
           });
           prescriptions = items;
        }
      } catch {
        prescriptions = [{ medicine: p, potency: "", form: "", dosage: "" }];
      }
    }

    generatePrescriptionPDF({
      clinicName: user?.clinic?.name || "Carewell Clinic",
      clinicAddress: user?.clinic?.address,
      doctorName: visit.doctorId?.name || visit.doctor?.name || user?.name || "Doctor",
      doctorLicense: visit.doctorId?.licenseNumber || visit.doctor?.licenseNumber || user?.licenseNumber,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      date: visit.date.toLocaleDateString('en-IN'),
      opNumber: visit.opNumber || (visit.isChronic ? visit.chronicData?.header?.opNumber : ""),
      diagnosis: visit.diagnosis || (visit.isChronic ? visit.chronicData?.summaryDiagnosis?.diseaseDiagnosis : ""),
      symptoms: visit.symptoms,
      modalities: visit.modalities,
      generals: visit.generals,
      mentals: visit.mentals,
      prescriptions: prescriptions,
      advice: adviceText
    });
  };

  if (visits.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
        <FileText className="w-8 h-8 text-slate-200 mx-auto mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No visits yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visits.map((visit: UnifiedVisitItem, idx: number) => {
        // --- Chronic Case ---
        if (visit.isChronic && visit.chronicData) {
          const c = visit.chronicData;
          const isExpanded = !!expandedCases[visit._id];
          const totality = c.analysisAndDiagnosis?.evaluation?.totalityOfSymptoms;
          const remedy = c.analysisAndDiagnosis?.finalDiagnosis?.homeopathicDiagnosis;
          const diagnosis = c.summaryDiagnosis?.diseaseDiagnosis || c.analysisAndDiagnosis?.finalDiagnosis?.disease;

          return (
            <div
              key={visit._id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Collapsed header */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                onClick={() => toggleCase(visit._id)}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-brand-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Chronic Evaluation</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {visit.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {(visit.doctorId || visit.doctor) && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dr. {visit.doctorId?.name || visit.doctor?.name}</span>
                      </>
                    )}
                  </div>
                  <p className="text-base font-semibold text-slate-900 truncate">
                    {diagnosis || "Comprehensive Chronic Record"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrintVisit(visit); }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-slate-600 hover:text-brand-primary border border-slate-200 shadow-sm transition-all group/print"
                    title="Print Prescription"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Print</span>
                  </button>
                  
                  {remedy && !isExpanded && (
                    <span className="hidden sm:inline text-[10px] font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-3 py-1 rounded-lg uppercase tracking-wide">
                      {remedy}
                    </span>
                  )}
                  <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-brand-primary/30 text-slate-400 hover:text-brand-primary flex items-center justify-center transition-all">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-white">
                  {totality && (
                    <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-brand-primary" /> Totality of Symptoms
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">&quot;{totality}&quot;</p>
                    </div>
                  )}
                  <div className="p-6">
                    <ChronicCaseDetails data={c} />
                  </div>
                </div>
              )}
            </div>
          );
        }

        // --- Acute Case ---
        let aiNotes: Record<string, unknown> | null = null;
        let adviceText = "";

        try {
          if (typeof visit.aiGeneratedNotes === "string") aiNotes = JSON.parse(visit.aiGeneratedNotes);
          else if (typeof visit.aiGeneratedNotes === "object") aiNotes = visit.aiGeneratedNotes as Record<string, unknown>;
        } catch {
          // ignore
        }

        try {
          if (typeof visit.doctorEditedNotes === "string") {
            if (visit.doctorEditedNotes.startsWith("{")) {
              const parsed = JSON.parse(visit.doctorEditedNotes);
              adviceText = parsed.advice || "";
            } else {
              adviceText = visit.doctorEditedNotes;
            }
          } else if (typeof visit.doctorEditedNotes === "object" && visit.doctorEditedNotes !== null) {
            const edited = visit.doctorEditedNotes as Record<string, string>;
            adviceText = edited.advice || "";
          }
        } catch {
          // ignore
        }

        if (!adviceText) adviceText = (aiNotes?.advice as string) || "";

        return (
          <div
            key={visit._id}
            className={clsx(
              "group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200",
              "animate-in fade-in slide-in-from-bottom-1"
            )}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            {/* Header row */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/30">
              {/* Visit number */}
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all shrink-0">
                {String(visits.length - idx).padStart(2, "0")}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acute Consultation</span>
                  {(visit.doctorId || visit.doctor) && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Dr. {visit.doctorId?.name || visit.doctor?.name}</span>
                    </>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {visit.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}
                  {visit.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {visit.diagnosis && (
                <span className="hidden sm:inline text-[10px] font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-3 py-1 rounded-lg uppercase tracking-wide shrink-0">
                  {visit.diagnosis}
                </span>
              )}

              <button 
                onClick={() => handlePrintVisit(visit)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-slate-600 hover:text-brand-primary border border-slate-200 shadow-sm transition-all shrink-0 ml-2 group/print"
                title="Print Prescription"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Print</span>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Symptoms */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-brand-primary" /> Symptoms & Observation
                  </p>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    &quot;{visit.symptoms || "No symptoms recorded"}&quot;
                  </p>
                </div>
                
                {(visit.modalities || visit.generals) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    {visit.modalities && (
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Modalities</p>
                        <p className="text-xs text-slate-600 font-medium">{visit.modalities}</p>
                      </div>
                    )}
                    {visit.generals && (
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Physical Generals</p>
                        <p className="text-xs text-slate-600 font-medium">{visit.generals}</p>
                      </div>
                    )}
                  </div>
                )}

                {aiEnabled && aiNotes && !!aiNotes["assessment"] && (
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> AI Clinical Logic
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-brand-accent/30 pl-3 font-medium">
                      {aiNotes["assessment"] as string}
                    </p>
                  </div>
                )}
              </div>

              {/* Prescription */}
              <div className="md:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5" /> Prescription
                </p>
                <div className="space-y-3">
                  {(() => {
                    const p = visit.prescription;
                    if (!p) return <p className="text-xs font-semibold text-slate-400 uppercase">No prescription recorded</p>;

                    try {
                      const rxArr = typeof p === "string" && p.startsWith("[") ? JSON.parse(p) as MedicineItem[] : (Array.isArray(p) ? p as MedicineItem[] : null);

                      if (Array.isArray(rxArr)) {
                        return rxArr.map((m: MedicineItem, i: number) => (
                          <div key={i} className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-900 uppercase">{m.medicine} <span className="text-brand-primary ml-1">{m.potency}</span></p>
                              {m.quantity && <span className="text-[9px] font-bold text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-lg border border-brand-primary/10">{m.quantity}</span>}
                            </div>
                            <div className="flex items-center gap-4">
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                 <Clock className="w-3 h-3 text-slate-400" /> {m.dosage || m.dose}
                               </p>
                               {m.form && (
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                   <div className="w-1 h-1 rounded-full bg-slate-300" /> {m.form}
                                 </p>
                               )}
                            </div>
                          </div>
                        ));
                      }
                    } catch {
                      // ignore
                    }

                    return (
                      <p className="text-sm font-semibold text-slate-700 leading-snug uppercase">
                        {visit.prescription}
                      </p>
                    );
                  })()}
                </div>
                {adviceText && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1.5">Patient Advice</p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{adviceText}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
