"use client";

import { Activity, Clock, FileText, Sparkles, ChevronDown, ChevronUp, Pill, Stethoscope, Hash, Info } from "lucide-react";
import { ChronicCase } from "@/types/chronicCase";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { ChronicCaseDetails } from "./ChronicCaseDetails";
import { clsx } from "clsx";

export interface UnifiedVisitItem {
  _id: string;
  isChronic?: boolean;
  date: Date;
  symptoms?: string;
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
  };
  doctor?: {
    _id: string;
    name: string;
    profileImage?: string;
  };
}

interface PatientProfileTimelineProps {
  visits: UnifiedVisitItem[];
}

export function PatientProfileTimeline({ visits }: PatientProfileTimelineProps) {
  const { user } = useAuthStore();
  const aiEnabled = user?.clinic?.aiEnabled ?? true;
  const [expandedCases, setExpandedCases] = useState<Record<string, boolean>>({});

  const toggleCase = (id: string) => {
    setExpandedCases((prev) => ({ ...prev, [id]: !prev[id] }));
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
              className="group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 transition-all duration-300"
            >
              {/* Collapsed header */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer"
                onClick={() => toggleCase(visit._id)}
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest">Chronic Evaluation</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[9px] text-slate-500 font-medium">
                      {visit.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {visit.doctor && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">Dr. {visit.doctor.name}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white truncate">
                    {diagnosis || "Chronic Case Record"}
                  </p>
                </div>

                {/* Collapse toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  {remedy && !isExpanded && (
                    <span className="hidden sm:inline text-[9px] font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-1 rounded-lg uppercase tracking-wide truncate max-w-[120px]">
                      {remedy}
                    </span>
                  )}
                  <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-brand-primary/20 text-slate-400 hover:text-brand-primary flex items-center justify-center transition-all">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-white/5">
                  {totality && (
                    <div className="px-5 py-4 border-b border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-brand-primary" /> Totality of Symptoms
                      </p>
                      <p className="text-sm text-slate-300 italic leading-relaxed line-clamp-4">&quot;{totality}&quot;</p>
                    </div>
                  )}
                  <div className="p-4">
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
        } catch {}

        try {
          if (typeof visit.doctorEditedNotes === "string") {
            if (visit.doctorEditedNotes.startsWith("{")) {
              const parsed = JSON.parse(visit.doctorEditedNotes);
              adviceText = parsed.advice || "";
            } else {
              adviceText = visit.doctorEditedNotes;
            }
          } else if (typeof visit.doctorEditedNotes === "object" && visit.doctorEditedNotes !== null) {
            adviceText = (visit.doctorEditedNotes as Record<string, unknown>).advice as string || "";
          }
        } catch {}

        if (!adviceText) adviceText = (aiNotes?.advice as string) || "";

        return (
          <div
            key={visit._id}
            className={clsx(
              "group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200",
              "animate-in fade-in slide-in-from-bottom-1"
            )}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            {/* Header row */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-50">
              {/* Visit number */}
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:text-brand-primary group-hover:border-brand-primary/20 group-hover:bg-brand-primary/5 transition-all shrink-0">
                {String(visits.length - idx).padStart(2, "0")}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Acute Consultation</span>
                  {(visit.doctorId || visit.doctor) && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">Dr. {visit.doctorId?.name || visit.doctor?.name}</span>
                    </>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-500">
                  {visit.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}
                  {visit.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {visit.diagnosis && (
                <span className="hidden sm:inline text-[9px] font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-2 py-1 rounded-lg uppercase tracking-wide shrink-0">
                  {visit.diagnosis}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Symptoms */}
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-brand-primary" /> Symptoms
                </p>
                <p className="text-sm text-slate-600 italic leading-relaxed line-clamp-3">
                  &quot;{visit.symptoms || "Not recorded"}&quot;
                </p>
                {aiEnabled && aiNotes && !!aiNotes["assessment"] && (
                  <div className="mt-3 pt-3 border-t border-slate-50">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brand-accent" /> AI Reasoning
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 border-l-2 border-brand-accent/20 pl-2">
                      {aiNotes["assessment"] as string}
                    </p>
                  </div>
                )}
              </div>

              {/* Prescription */}
              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-[9px] font-bold text-brand-accent uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Pill className="w-3 h-3" /> Prescription
                </p>
                <div className="space-y-2">
                  {(() => {
                    const p = visit.prescription;
                    if (!p) return <p className="text-sm font-semibold text-white uppercase italic opacity-50">Not recorded</p>;

                    try {
                      // Try to parse if it's a JSON array string
                      const rxArr = typeof p === "string" && p.startsWith("[") ? JSON.parse(p) : (Array.isArray(p) ? p : null);

                      if (Array.isArray(rxArr)) {
                        return rxArr.map((m: any, i: number) => (
                          <div key={i} className="bg-white/5 rounded-lg p-2.5 border border-white/5 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-black text-white uppercase italic">{m.medicine} {m.potency}</p>
                              {m.quantity && <span className="text-[9px] font-bold text-brand-accent uppercase bg-brand-accent/10 px-1.5 py-0.5 rounded">{m.quantity}</span>}
                            </div>
                            <div className="flex items-center gap-3">
                               <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest leading-none flex items-center gap-1">
                                 <Clock className="w-2.5 h-2.5" /> {m.dosage || m.dose}
                               </p>
                               {m.form && (
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none flex items-center gap-1">
                                   <Activity className="w-2.5 h-2.5" /> {m.form}
                                 </p>
                               )}
                            </div>
                            {m.indication && (
                              <p className="text-[10px] text-slate-400 italic leading-snug pt-1 border-t border-white/5 mt-1 flex items-start gap-1">
                                <Info className="w-2.5 h-2.5 mt-0.5 shrink-0" /> {m.indication}
                              </p>
                            )}
                          </div>
                        ));
                      }
                    } catch (e) {
                      // fallback to string display if parsing fails
                    }

                    return (
                      <p className="text-sm font-semibold text-white leading-snug line-clamp-2 uppercase italic">
                        {visit.prescription}
                      </p>
                    );
                  })()}
                </div>
                {adviceText && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1">Advice</p>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 italic">{adviceText}</p>
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
