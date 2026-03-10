"use client";

import { StepProps } from "../ChronicCaseWizard";
import { Activity, Thermometer, Zap, Clipboard, ChevronLeft, ChevronRight, Brain } from "lucide-react";

export default function StepPhysicalFeatures({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const labelClass = "block font-medium text-slate-700 mb-1.5";
  const inputClass = "w-full bg-white border border-slate-200 text-slate-900 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400";
  const textareaClass = "w-full bg-white border border-slate-200 text-slate-900 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none text-sm";
  const hintClass = "text-xs text-slate-500 mb-2 block";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 shadow-sm">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-slate-900">Physical Constitution</h2>
          <p className="text-sm text-slate-500 mt-0.5">Generals & Physical Features</p>
        </div>
      </div>

      <form onSubmit={handleNext} className="space-y-6 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>
               Physical Build
            </label>
            <input
              type="text"
              placeholder="Obese, Thin, Stocky..."
              className={inputClass}
              value={caseData.physicalFeatures?.generalAppearance?.build || ""}
              onChange={(e) =>
                updateCaseData({ 
                  physicalFeatures: { 
                    ...caseData.physicalFeatures, 
                    generalAppearance: { ...caseData.physicalFeatures?.generalAppearance, build: e.target.value } 
                  } 
                })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              Thermal State
            </label>
            <select
              className={`${inputClass} appearance-none`}
              value={caseData.constitution?.thermalState || ""}
              onChange={(e) =>
                updateCaseData({ constitution: { ...caseData.constitution, thermalState: e.target.value } })
              }
            >
              <option value="">Select Thermal...</option>
              <option value="Hot">Hot</option>
              <option value="Cold">Cold</option>
              <option value="Ambithermal">Ambithermal</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              Temperament
            </label>
            <input
              type="text"
              placeholder="Choleric, Melancholic..."
              className={inputClass}
              value={caseData.constitution?.temperament || ""}
              onChange={(e) =>
                updateCaseData({ constitution: { ...caseData.constitution, temperament: e.target.value } })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              Side Affinity
            </label>
            <select
              className={`${inputClass} appearance-none`}
              value={caseData.constitution?.sideAffinity || ""}
              onChange={(e) =>
                updateCaseData({ constitution: { ...caseData.constitution, sideAffinity: e.target.value } })
              }
            >
              <option value="">Select Side...</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
              <option value="Alternating">Alternating</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className={labelClass}>
              Functional Generals
            </label>
            <span className={hintClass}>Record clinical generals: Sleep, Thirst, Sweat, Bowels, Appetite</span>
            <textarea
              placeholder="Record patterns and irregularities..."
              className={`${textareaClass} min-h-[100px]`}
              value={caseData.physicalFeatures?.functionalGenerals?.appetite || ""}
              onChange={(e) =>
                updateCaseData({ 
                  physicalFeatures: { 
                    ...caseData.physicalFeatures, 
                    functionalGenerals: { ...caseData.physicalFeatures?.functionalGenerals, appetite: e.target.value } 
                  } 
                })
              }
            />
          </div>

          <div>
            <label className={labelClass}>
              Clinical Examination
            </label>
            <span className={hintClass}>Systemic examination findings & vitals</span>
            <textarea
              placeholder="Observations..."
              className={`${textareaClass} min-h-[100px] border-dashed shadow-none`}
              value={caseData.physicalExamination?.systemicExamination || ""}
              onChange={(e) =>
                updateCaseData({ physicalExamination: { ...caseData.physicalExamination, systemicExamination: e.target.value } })
              }
            />
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
            Special History
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </form>
    </div>
  );
}
