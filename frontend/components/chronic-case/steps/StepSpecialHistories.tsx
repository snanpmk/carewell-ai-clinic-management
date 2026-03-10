"use client";

import { StepProps } from "../ChronicCaseWizard";
import { History, Users, Waves, ChevronLeft, ChevronRight } from "lucide-react";

export default function StepSpecialHistories({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const labelClass = "block font-medium text-slate-700 mb-1.5";
  const textareaClass = "w-full bg-white border border-slate-200 text-slate-900 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none text-sm";
  const hintClass = "text-xs text-slate-500 mb-2 block";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 shadow-sm">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-slate-900">Special Histories</h2>
          <p className="text-sm text-slate-500 mt-0.5">Life Events & Background</p>
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Previous Illness */}
          <div>
            <label className={labelClass}>
              Past Clinical History
            </label>
            <span className={hintClass}>List major past illnesses, surgery, or prolonged treatments</span>
            <textarea
              placeholder="Record any significant medical history..."
              className={`${textareaClass} min-h-[100px]`}
              value={caseData.historyOfPresentIllness?.previousTreatments || ""}
              onChange={(e) =>
                updateCaseData({ historyOfPresentIllness: { ...caseData.historyOfPresentIllness, previousTreatments: e.target.value } })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Family History */}
            <div>
              <label className={labelClass}>
                Family Background
              </label>
              <span className={hintClass}>Examples: Father, Mother, Siblings - Diabetes, Hypertension, etc.</span>
              <textarea
                placeholder="Identify hereditary disease patterns..."
                className={`${textareaClass} min-h-[120px]`}
                value={caseData.familyHistory?.notes || ""}
                onChange={(e) =>
                  updateCaseData({ familyHistory: { ...caseData.familyHistory, notes: e.target.value } })
                }
              />
            </div>

            {/* Menstrual History */}
            <div>
              <label className={labelClass}>
                Biological Cycles
              </label>
              <span className={hintClass}>If applicable: LMP, Cycle details, pregnancies, etc.</span>
              <textarea
                placeholder="Record menstrual or obstetrical history..."
                className={`${textareaClass} min-h-[120px] border-dashed shadow-none`}
                value={caseData.menstrualHistory?.lmp || ""}
                onChange={(e) =>
                  updateCaseData({ menstrualHistory: { ...caseData.menstrualHistory, lmp: e.target.value } })
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
            Review AI Analysis
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </form>
    </div>
  );
}
