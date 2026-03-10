"use client";

import { StepProps } from "../ChronicCaseWizard";
import { Brain, Heart, Zap, ChevronLeft, ChevronRight } from "lucide-react";

export default function StepLifeSpace({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
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
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-slate-900">Mental Profile</h2>
          <p className="text-sm text-slate-500 mt-0.5">Disposition & Life Space</p>
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Traits */}
          <div>
            <label className={labelClass}>
              Traits & Disposition
            </label>
            <span className={hintClass}>Examples: Fastidious, timid, jealous, cheerful, optimistic.</span>
            <textarea
              placeholder="Describe the patient's dominant mental traits..."
              className={`${textareaClass} min-h-[100px]`}
              value={caseData.lifeSpaceInvestigation?.cognitiveFunctions || ""}
              onChange={(e) =>
                updateCaseData({ lifeSpaceInvestigation: { ...caseData.lifeSpaceInvestigation, cognitiveFunctions: e.target.value } })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotional Upsets */}
            <div>
              <label className={labelClass}>
                Emotional Reactions
              </label>
              <span className={hintClass}>Examples: Grief, anger, fright, shock, disappointment.</span>
              <textarea
                placeholder="How does the patient react to emotional triggers?"
                className={`${textareaClass} min-h-[120px]`}
                value={caseData.personalHistory?.domesticRelations || ""}
                onChange={(e) =>
                  updateCaseData({ personalHistory: { ...caseData.personalHistory, domesticRelations: e.target.value } })
                }
              />
            </div>

            {/* Reaction Patterns */}
            <div>
              <label className={labelClass}>
                Environmental Sensitivities
              </label>
              <span className={hintClass}>Examples: Company, solitude, music, reprimands, consolation.</span>
              <textarea
                placeholder="Social and environmental reaction patterns..."
                className={`${textareaClass} min-h-[120px] border-dashed shadow-none`}
                value={caseData.personalHistory?.sexualRelations || ""}
                onChange={(e) =>
                  updateCaseData({ personalHistory: { ...caseData.personalHistory, sexualRelations: e.target.value } })
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
            Physical Analysis
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </form>
    </div>
  );
}
