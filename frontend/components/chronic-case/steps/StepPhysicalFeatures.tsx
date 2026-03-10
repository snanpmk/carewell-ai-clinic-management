"use client";

import { StepProps } from "../ChronicCaseWizard";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function StepPhysicalFeatures({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const labelClass = "text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center";
  const inputClass = "w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]";
  const textareaClass = "w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]";
  const hintClass = "text-[11px] font-bold text-slate-400 mb-3 block italic leading-relaxed";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100/80">
        <div className="w-12 h-12 bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-xs shadow-emerald-100">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Physical Constitution</h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Generals & Physical Features</p>
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
        <div className="flex justify-between items-center pt-8 border-t border-slate-100/80">
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Special History
          </Button>
        </div>
      </form>
    </div>
  );
}
