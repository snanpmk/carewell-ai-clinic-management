"use client";

import { StepProps } from "../ChronicCaseWizard";
import { MessageSquare, Eye, ListFilter, ChevronLeft, ChevronRight, History } from "lucide-react";

export default function StepPresentingComplaints({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const labelClass = "block font-medium text-slate-700 mb-1.5";
  const textareaClass = "w-full bg-white border border-slate-200 text-slate-900 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none text-sm";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 shadow-sm">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-slate-900">Clinical Presentation</h2>
          <p className="text-sm text-slate-500 mt-0.5">Narrative & Observation</p>
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Patient Narration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-slate-700 flex items-center gap-2">
                Patient's Narration
              </label>
              <span className="text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">Ipsisima Verba</span>
            </div>
            <textarea
              placeholder="Record the patient's exact words..."
              className={`${textareaClass} min-h-[120px]`}
              value={caseData.initialPresentation?.patientNarration || ""}
              onChange={(e) =>
                updateCaseData({ initialPresentation: { ...caseData.initialPresentation, patientNarration: e.target.value } })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physician Observation */}
            <div>
              <label className={labelClass}>
                Objective Observation
              </label>
              <textarea
                placeholder="Facial expression, gait, posture, eye contact..."
                className={`${textareaClass} min-h-[140px]`}
                value={caseData.initialPresentation?.physicianObservation || ""}
                onChange={(e) =>
                  updateCaseData({ initialPresentation: { ...caseData.initialPresentation, physicianObservation: e.target.value } })
                }
              />
            </div>

            {/* Complaints Summary */}
            <div>
              <label className={labelClass}>
                LSMA Framework
              </label>
              <textarea
                placeholder="Location, Sensation, Modalities, Accompaniments..."
                className={`${textareaClass} min-h-[140px] border-dashed shadow-none`}
                value={caseData.historyOfPresentIllness?.progression || ""}
                onChange={(e) =>
                  updateCaseData({ historyOfPresentIllness: { ...caseData.historyOfPresentIllness, progression: e.target.value } })
                }
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors active:scale-[0.98]"
          >
            Continue
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </form>
    </div>
  );
}
