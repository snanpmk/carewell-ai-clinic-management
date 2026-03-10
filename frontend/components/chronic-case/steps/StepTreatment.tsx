"use client";

import { useState } from "react";
import { StepProps } from "../ChronicCaseWizard";
import { createChronicCase } from "@/services/chronicCaseService";
import { useRouter } from "next/navigation";
import { ClipboardList, Pill, ListChecks, ShieldCheck, ChevronLeft, Save, Loader2, AlertCircle } from "lucide-react";

export default function StepTreatment({ caseData, updateCaseData, prevStep }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const finalizedCase = { ...caseData, status: "Completed" as const };
      await createChronicCase(finalizedCase);
      router.push(`/patients/${caseData.patient}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save chronic case.");
    } finally {
      setLoading(false);
    }
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
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-slate-900">Management & Prescription</h2>
          <p className="text-sm text-slate-500 mt-0.5">Treatment & Remedial Plan</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Plan */}
          <div>
            <label className={labelClass}>
              Treatment Strategy
            </label>
            <textarea
              placeholder="Overall strategy and clinical goals..."
              className={`${textareaClass} min-h-[100px]`}
              value={caseData.management?.treatmentPlan || ""}
              onChange={(e) =>
                updateCaseData({ 
                  management: { ...caseData.management, treatmentPlan: e.target.value } 
                })
              }
            />
          </div>

          {/* Prescription Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>
                First Prescription
              </label>
              <input
                type="text"
                placeholder="Medicine name..."
                required
                className={inputClass}
                value={caseData.management?.firstPrescription?.medicine || ""}
                onChange={(e) =>
                  updateCaseData({ 
                    management: { 
                      ...caseData.management, 
                      firstPrescription: { ...caseData.management?.firstPrescription, medicine: e.target.value } 
                    } 
                  })
                }
              />
            </div>
            
            <div>
              <label className={labelClass}>Potency</label>
              <select
                className={`${inputClass} appearance-none`}
                value={caseData.management?.firstPrescription?.potency || ""}
                onChange={(e) =>
                  updateCaseData({ 
                    management: { 
                      ...caseData.management, 
                      firstPrescription: { ...caseData.management?.firstPrescription, potency: e.target.value } 
                    } 
                  })
                }
              >
                <option value="">Select Potency...</option>
                <option value="30 CH">30 CH</option>
                <option value="200 CH">200 CH</option>
                <option value="1M">1M</option>
                <option value="10M">10M</option>
                <option value="0/1">0/1 (LM)</option>
                <option value="Q">Mother Tincture (Q)</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Dose</label>
              <input
                type="text"
                placeholder="e.g. 4 pills TDS..."
                className={inputClass}
                value={caseData.management?.firstPrescription?.dose || ""}
                onChange={(e) =>
                  updateCaseData({ 
                    management: { 
                      ...caseData.management, 
                      firstPrescription: { ...caseData.management?.firstPrescription, dose: e.target.value } 
                    } 
                  })
                }
              />
            </div>
          </div>

          {/* Advice */}
          <div>
            <label className={labelClass}>
              Restrictions & Supportive Advice
            </label>
            <span className={hintClass}>Diet, lifestyle, and medicinal restrictions...</span>
            <textarea
              placeholder="Record advice..."
              className={`${textareaClass} min-h-[100px] border-dashed shadow-none`}
              value={caseData.management?.supportiveMeasures || ""}
              onChange={(e) =>
                updateCaseData({ 
                  management: { ...caseData.management, supportiveMeasures: e.target.value } 
                })
              }
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm font-medium">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

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
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Finalizing..." : "Complete Case"}
          </button>
        </div>
      </form>
    </div>
  );
}
