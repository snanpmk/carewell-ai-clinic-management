"use client";

import { useState } from "react";
import { StepProps } from "../ChronicCaseWizard";
import { analyzeChronicCaseWithAI } from "@/services/chronicCaseService";
import { Sparkles, Brain, FlaskConical, ListChecks, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";

export default function StepAIAnalysis({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await analyzeChronicCaseWithAI(caseData);
      
      updateCaseData({
        homeopathicDiagnosis: {
          ...caseData.homeopathicDiagnosis,
          totalityOfSymptoms: result.totalityOfSymptoms,
          miasmaticExpression: result.miasmaticExpression,
          repertorization: result.repertorization,
        },
        management: {
          ...caseData.management,
          treatmentPlan: "AI Suggestions: " + (Array.isArray(result.suggestedRemedies) ? result.suggestedRemedies.map((r: any) => `${r.remedyName} (${r.potency})`).join(", ") : result.suggestedRemedies)
        }
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to run AI analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const labelClass = "block font-medium text-slate-700 mb-1.5";
  const textareaClass = "w-full bg-white border border-slate-200 text-slate-900 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none text-sm";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-slate-900">Miasmatic Analysis</h2>
            <p className="text-sm text-slate-500 mt-0.5">Totality & Miasmatic Expression</p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={runAnalysis}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? "Analyzing..." : "Generate Analysis"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm font-medium">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Totality */}
          <div>
            <label className={labelClass}>
              Totality of Symptoms
            </label>
            <textarea
              placeholder="Waiting for AI synthesis..."
              className={`${textareaClass} min-h-[100px]`}
              value={caseData.homeopathicDiagnosis?.totalityOfSymptoms || ""}
              onChange={(e) =>
                updateCaseData({ 
                  homeopathicDiagnosis: { ...caseData.homeopathicDiagnosis, totalityOfSymptoms: e.target.value } 
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Miasm */}
            <div>
              <label className={labelClass}>
                Miasmatic Expression
              </label>
              <textarea
                placeholder="Psora, Sycosis, Syphilis dominant..."
                className={`${textareaClass} min-h-[140px]`}
                value={caseData.homeopathicDiagnosis?.miasmaticExpression || ""}
                onChange={(e) =>
                  updateCaseData({ 
                    homeopathicDiagnosis: { ...caseData.homeopathicDiagnosis, miasmaticExpression: e.target.value } 
                  })
                }
              />
            </div>

            {/* Repertorial Rubrics */}
            <div>
              <label className={labelClass}>
                Repertorial Analysis
              </label>
              <textarea
                placeholder="Rubrics data will appear here..."
                className={`${textareaClass} min-h-[140px] font-mono text-[13px] border-dashed shadow-none`}
                value={caseData.homeopathicDiagnosis?.repertorization ? JSON.stringify(caseData.homeopathicDiagnosis.repertorization, null, 2) : ""}
                onChange={(e) => {
                  try {
                    const arr = JSON.parse(e.target.value);
                    updateCaseData({ 
                      homeopathicDiagnosis: { ...caseData.homeopathicDiagnosis, repertorization: arr } 
                    })
                  } catch { /* ignore */ }
                }}
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
            Final Management
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </form>
    </div>
  );
}
