"use client";

import { useState, useEffect } from "react";
import { StepProps } from "../ChronicCaseWizard";
import { analyzeChronicCaseWithAI } from "@/services/chronicCaseService";
import { Sparkles, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";

export default function StepAIAnalysis({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      homeopathicDiagnosis: {
        totalityOfSymptoms: caseData.homeopathicDiagnosis?.totalityOfSymptoms || "",
        miasmaticExpression: caseData.homeopathicDiagnosis?.miasmaticExpression || "",
        repertorization: caseData.homeopathicDiagnosis?.repertorization || [],
      }
    }
  });

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await analyzeChronicCaseWithAI(caseData);
      
      setValue("homeopathicDiagnosis.totalityOfSymptoms", result.totalityOfSymptoms || "");
      setValue("homeopathicDiagnosis.miasmaticExpression", result.miasmaticExpression || "");
      setValue("homeopathicDiagnosis.repertorization", result.repertorization || []);

      updateCaseData({
        homeopathicDiagnosis: {
          ...caseData.homeopathicDiagnosis,
          totalityOfSymptoms: result.totalityOfSymptoms,
          miasmaticExpression: result.miasmaticExpression,
          repertorization: result.repertorization,
        }
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to run AI analysis");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    updateCaseData(data);
    nextStep();
  };

  const labelClass = "text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center";
  const textareaClass = "w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100/80">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 border border-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Miasmatic Analysis</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">AI Totality & Expression</p>
          </div>
        </div>
        
        <Button
          type="button"
          onClick={runAnalysis}
          disabled={loading}
          variant="primary"
          className="shadow-md shadow-indigo-500/20 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none px-6"
          leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        >
          {loading ? "Analyzing..." : "Generate Analysis"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Totality */}
          <div>
            <label className={labelClass}>
              Totality of Symptoms
            </label>
            <textarea
              {...register("homeopathicDiagnosis.totalityOfSymptoms")}
              placeholder="Waiting for AI synthesis..."
              className={`${textareaClass} min-h-[100px]`}
            />
          </div>

          <div>
            {/* Miasm */}
            <label className={labelClass}>
              Miasmatic Expression
            </label>
            <textarea
              {...register("homeopathicDiagnosis.miasmaticExpression")}
              placeholder="Psora, Sycosis, Syphilis dominant..."
              className={`${textareaClass} min-h-[140px]`}
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
            Final Management
          </Button>
        </div>
      </form>
    </div>
  );
}
