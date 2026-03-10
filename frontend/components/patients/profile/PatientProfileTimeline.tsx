"use client";

import { Activity, Clock, FileText, Sparkles } from "lucide-react";
import { ChronicCase } from "@/types/chronicCase";

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
}

interface PatientProfileTimelineProps {
  visits: UnifiedVisitItem[];
}

export function PatientProfileTimeline({ visits }: PatientProfileTimelineProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-4 tracking-tight uppercase italic">
          <div className="p-3 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 shadow-inner">
            <Clock className="w-6 h-6 text-brand-primary" />
          </div>
          Clinical Timeline
        </h2>
      </div>

      <div className="space-y-8">
        {visits.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-200" />
            </div>
            <p className="eyebrow">Empty Medical Record</p>
            <p className="text-slate-400 text-sm mt-3 font-medium">No past visits found for this patient.</p>
          </div>
        ) : (
          visits.map((visit: UnifiedVisitItem, idx: number) => {
            
            // --- Chronic Case Rendering ---
            if (visit.isChronic && visit.chronicData) {
              const c = visit.chronicData;
              const totality = c.homeopathicDiagnosis?.totalityOfSymptoms || "No totality extracted.";
                // @ts-expect-error - HomeopathicDiagnosis needs updated types
                const rubric = c.homeopathicDiagnosis?.repertorizationRubrics || "No rubrics run.";
                
                // @ts-expect-error - HomeopathicDiagnosis needs updated types
                const suggestedArray = c.homeopathicDiagnosis?.suggestedRemedies || [];
              const remedies = Array.isArray(suggestedArray) && suggestedArray.length > 0
                ? (suggestedArray as Array<{ remedyName: string; potency: string }>).map((r) => `${r.remedyName} (${r.potency})`).join(", ")
                : "No suggestions.";

              const docPrescription = c.management?.firstPrescription?.medicine 
                ? `${c.management.firstPrescription.medicine} ${c.management.firstPrescription.potency || ""} - ${c.management.firstPrescription.dose || ""}`
                : "No prescription finalized.";

              return (
                <div key={visit._id} className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group transition-all duration-500">
                  <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-brand-primary to-brand-accent opacity-100" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-primary/10 transition-all duration-700" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-linear-to-br from-brand-primary to-brand-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl  text-white! tracking-tight uppercase italic">Chronic Evaluation</h3>
                        <p className="eyebrow text-brand-accent! mt-1.5 opacity-100">
                           {visit.date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 text-brand-accent border border-white/10 shadow-inner">
                        Depth Focus
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                         <p className="eyebrow mb-4 flex items-center gap-2 !text-slate-300">
                            <Activity className="w-4 h-4 text-brand-primary" /> Totality of Symptoms
                         </p>
                         <div className="p-6 bg-white/5 rounded-3xl border border-white/5 shadow-inner backdrop-blur-md">
                           <p className="text-sm md:text-base font-medium text-slate-200 leading-relaxed italic line-clamp-4">&quot;{totality}&quot;</p>
                         </div>
                      </div>

                      <div>
                         <p className="eyebrow mb-4 flex items-center gap-2 !text-slate-300">
                            <Sparkles className="w-4 h-4 text-brand-accent" /> Repertorization
                         </p>
                         <div className="p-6 bg-slate-900 rounded-3xl border border-white/5 shadow-inner">
                           <p className="text-xs font-medium text-slate-300 leading-relaxed max-h-32 overflow-y-auto mb-4 border-b border-white/5 pb-4 custom-scrollbar">{rubric}</p>
                           <p className="text-xs font-black text-brand-accent uppercase tracking-widest leading-snug"><span className="!text-slate-400 font-black mr-2">Suggestions:</span> {remedies}</p>
                         </div>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <div className="bg-linear-to-br from-white/5 to-transparent rounded-[2rem] p-8 border border-white/10 relative shadow-2xl h-full flex flex-col justify-center">
                         <div className="absolute top-6 right-6 text-white/5">
                           <FileText className="w-12 h-12" />
                         </div>
                         <p className="eyebrow !text-brand-accent mb-6">Management Plan</p>
                         <p className="text-2xl font-black text-white leading-tight mb-4 tracking-tight line-clamp-2 uppercase italic">
                           {docPrescription}
                         </p>
                         {c.management?.supportiveMeasures && (
                           <div className="mt-6 pt-6 border-t border-white/5">
                             <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                               <span className="eyebrow !text-brand-accent not-italic mr-2">Advice:</span> {c.management.supportiveMeasures}
                             </p>
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // --- Acute Case Rendering ---
            let aiNotes: Record<string, unknown> | null = null;
            let adviceText = "";

            try { 
                if (typeof visit.aiGeneratedNotes === "string") aiNotes = JSON.parse(visit.aiGeneratedNotes);
                else if (typeof visit.aiGeneratedNotes === "object") aiNotes = visit.aiGeneratedNotes as Record<string, unknown>;
            } catch { }

            try { 
              if (typeof visit.doctorEditedNotes === 'string') {
                if (visit.doctorEditedNotes.startsWith('{')) {
                  const parsed = JSON.parse(visit.doctorEditedNotes);
                  adviceText = parsed.advice || "";
                } else {
                  adviceText = visit.doctorEditedNotes;
                }
              } else if (typeof visit.doctorEditedNotes === 'object' && visit.doctorEditedNotes !== null) {
                adviceText = (visit.doctorEditedNotes as Record<string, unknown>).advice as string || "";
              }
            } catch { }

            if (!adviceText) {
                adviceText = (aiNotes?.advice as string) || "No advice recorded.";
            }

            return (
              <div key={visit._id} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 group relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
                <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-brand-primary/20 to-brand-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-200 shadow-inner rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all duration-500">
                      {visits.length - idx}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Acute Consultation</h3>
                      <p className="eyebrow mt-1.5">
                         {visit.date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-slate-100 text-slate-500 border border-slate-200 shadow-inner group-hover:bg-brand-primary/10 group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all duration-500">
                      {visit.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <p className="eyebrow mb-4 flex items-center gap-2">
                         <Activity className="w-4 h-4 text-brand-primary" /> Presenting Symptoms
                      </p>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                        <p className="text-sm md:text-base font-medium text-slate-700 leading-relaxed italic">&quot;{visit.symptoms}&quot;</p>
                        {visit.diagnosis && (
                          <div className="mt-6 pt-5 border-t border-slate-200/60 flex items-center gap-3">
                            <span className="px-3 py-1.5 bg-brand-primary/5 text-brand-primary text-[10px] uppercase tracking-[0.2em] font-black rounded-lg border border-brand-primary/10">
                              Assessment: <span className="text-slate-900 ml-1">{visit.diagnosis}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {aiNotes && !!aiNotes["assessment"] && (
                       <div>
                          <p className="eyebrow mb-4 flex items-center gap-2">
                             <Sparkles className="w-4 h-4 text-brand-accent" /> Clinical Reasoning
                          </p>
                          <div className="p-6 bg-brand-primary/5 rounded-3xl border border-brand-primary/10 shadow-inner">
                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-4 border-brand-primary/20 pl-4">
                              {aiNotes["assessment"] as string}
                            </p>
                          </div>
                       </div>
                    )}
                  </div>
                  
                  <div className="space-y-8">
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 border border-slate-800 relative shadow-2xl h-full flex flex-col justify-center">
                       <div className="absolute top-6 right-6 text-white/5">
                         <FileText className="w-12 h-12" />
                       </div>
                      <p className="eyebrow !text-brand-accent mb-6">Prescription</p>
                      <p className="text-2xl font-black text-white leading-tight mb-4 tracking-tight line-clamp-3 uppercase italic">
                        {visit.prescription || "No prescription recorded."}
                      </p>

                      <div className="mt-6 pt-6 border-t border-white/5">
                         <p className="eyebrow !text-slate-400 mb-3">Advice & Follow-up</p>
                         <p className="text-sm text-slate-200 font-medium leading-relaxed italic">
                           {adviceText}
                         </p>
                      </div>

                      {visit.additionalNotes && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                          <p className="text-xs text-slate-300 font-medium italic">
                            <span className="eyebrow !text-slate-400 not-italic mr-2">Note:</span> {visit.additionalNotes}
                          </p>
                        </div>
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
