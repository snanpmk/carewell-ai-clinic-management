"use client";

import { Activity, Clock, FileText, Sparkles } from "lucide-react";
import { ChronicCase } from "@/types/chronicCase";

export interface UnifiedVisitItem {
  _id: string;
  isChronic?: boolean;
  date: Date;
  symptoms?: string;
  diagnosis?: string;
  doctorEditedNotes?: string | Record<string, unknown>;
  aiGeneratedNotes?: string | Record<string, unknown>;
  additionalNotes?: string;
  chronicData?: ChronicCase;
}

interface PatientProfileTimelineProps {
  visits: UnifiedVisitItem[];
}

export function PatientProfileTimeline({ visits }: PatientProfileTimelineProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-100/50 shadow-xs shadow-indigo-100">
            <Clock className="w-5 h-5 text-indigo-500" />
          </div>
          Clinical Timeline
        </h2>
      </div>

      <div className="space-y-6">
        {visits.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200/80 rounded-3xl p-16 text-center shadow-xs">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Empty Record</p>
            <p className="text-slate-400 text-sm mt-2">No past visits found for this patient.</p>
          </div>
        ) : (
          visits.map((visit: UnifiedVisitItem, idx: number) => {
            
            // --- Chronic Case Rendering ---
            if (visit.isChronic && visit.chronicData) {
              const c = visit.chronicData;
              const totality = c.homeopathicDiagnosis?.totalityOfSymptoms || "No totality extracted.";
              // @ts-ignore
              const rubric = c.homeopathicDiagnosis?.repertorizationRubrics || "No rubrics run.";
              
              // @ts-ignore
              const suggestedArray = c.homeopathicDiagnosis?.suggestedRemedies || [];
              const remedies = Array.isArray(suggestedArray) && suggestedArray.length > 0
                ? (suggestedArray as Array<{ remedyName: string; potency: string }>).map((r) => `${r.remedyName} (${r.potency})`).join(", ")
                : "No suggestions.";

              const docPrescription = c.management?.firstPrescription?.medicine 
                ? `${c.management.firstPrescription.medicine} ${c.management.firstPrescription.potency || ""} - ${c.management.firstPrescription.dose || ""}`
                : "No prescription finalized.";

              return (
                <div key={visit._id} className="bg-linear-to-b from-rose-50/50 to-white border border-rose-200/70 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300 group relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-rose-500 to-pink-500 opacity-100" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-rose-100/60">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-linear-to-br from-rose-100 to-pink-100 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 shadow-xs shadow-rose-200/40">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Chronic Evaluation</h3>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                           {visit.date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-700 border border-rose-200/60 shadow-xs shadow-rose-100">
                        Chronic Focus
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-rose-500" /> Totality of Symptoms
                         </p>
                         <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-[0_2px_10px_-3px_rgba(255,228,230,0.5)]">
                           <p className="text-sm font-medium text-slate-700 leading-relaxed italic line-clamp-4">&quot;{totality}&quot;</p>
                         </div>
                      </div>

                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Rubrics & Remedies
                         </p>
                         <div className="p-5 bg-white/50 rounded-2xl border border-indigo-100/60 shadow-[0_2px_10px_-3px_rgba(224,231,255,0.5)]">
                           <p className="text-xs font-medium text-slate-600 leading-relaxed max-h-24 overflow-y-auto mb-3 border-b border-indigo-50 pb-3">{rubric}</p>
                           <p className="text-xs font-bold text-indigo-700"><span className="text-indigo-400 font-medium">Suggestions:</span> {remedies}</p>
                         </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-linear-to-br from-rose-50 to-pink-50/30 rounded-3xl p-7 border border-rose-200/60 relative shadow-[0_4px_20px_-4px_rgba(255,228,230,0.5)] h-full">
                         <div className="absolute top-5 right-5 text-rose-300">
                           <FileText className="w-8 h-8 opacity-40 mix-blend-multiply" />
                         </div>
                         <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">First Prescription</p>
                         <p className="text-lg font-black text-slate-800 leading-tight mb-2 tracking-tight line-clamp-2">
                           {docPrescription}
                         </p>
                         {c.management?.supportiveMeasures && (
                           <p className="text-xs text-slate-500 font-medium italic mt-5 pt-5 border-t border-rose-200/50">
                             <span className="text-rose-400 not-italic font-bold mr-1">Advice:</span> {c.management.supportiveMeasures}
                           </p>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // --- Acute Case Rendering ---
            let aiNotes = null;
            let parsedDoctorNotes = visit.doctorEditedNotes;
            
            try { if (typeof visit.aiGeneratedNotes === "string") aiNotes = JSON.parse(visit.aiGeneratedNotes); } catch { }
            try { 
              if (visit.doctorEditedNotes && typeof visit.doctorEditedNotes === 'string' && visit.doctorEditedNotes.startsWith('{')) {
                const parsed = JSON.parse(visit.doctorEditedNotes);
                parsedDoctorNotes = parsed.advice || parsed.doctorEditedNotes || visit.doctorEditedNotes;
              }
            } catch { }

            return (
              <div key={visit._id} className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-xs rounded-2xl flex items-center justify-center text-slate-500 font-black text-lg group-hover:text-blue-600 transition-colors">
                      {visits.length - idx}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Acute Consultation</h3>
                      <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                         {visit.date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-200/60 shadow-xs group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                      {visit.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Activity className="w-3.5 h-3.5 text-amber-500" /> Patient Report
                      </p>
                      <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100/80 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
                        <p className="text-sm font-medium text-slate-700 leading-relaxed italic">&quot;{visit.symptoms}&quot;</p>
                        {visit.diagnosis && (
                          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] uppercase tracking-widest font-black rounded-lg border border-amber-100/50">
                              Assessed: <span className="font-bold">{visit.diagnosis}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {aiNotes?.assessment && (
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Clinical Logic
                          </p>
                          <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100/50 shadow-[0_2px_10px_-3px_rgba(224,231,255,0.4)]">
                            <p className="text-sm font-medium text-slate-600 leading-relaxed pl-3 border-l-[3px] border-indigo-200/50">
                              {aiNotes.assessment}
                            </p>
                          </div>
                       </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-linear-to-br from-emerald-50/80 to-teal-50/30 rounded-3xl p-7 border border-emerald-100/80 relative shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)] h-full">
                       <div className="absolute top-5 right-5 text-emerald-300">
                         <FileText className="w-8 h-8 opacity-30 mix-blend-multiply" />
                       </div>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Final Prescription</p>
                      <p className="text-lg font-black text-slate-800 leading-tight mb-2 tracking-tight line-clamp-3">
                        {parsedDoctorNotes || (aiNotes?.advice || "No advice recorded.")}
                      </p>
                      {visit.additionalNotes && (
                        <p className="text-xs text-slate-500 font-medium italic mt-5 pt-5 border-t border-emerald-200/40">
                          <span className="text-emerald-500 not-italic font-bold mr-1">Note:</span> {visit.additionalNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
