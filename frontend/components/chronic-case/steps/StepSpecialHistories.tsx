"use client";

import { StepProps } from "../ChronicCaseWizard";
import { History, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { specialHistorySchema, SpecialHistoryFormData } from "@/lib/validations/chronicCase";

export default function StepSpecialHistories({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(specialHistorySchema),
    defaultValues: {
      previousIllnessHistory: caseData.previousIllnessHistory || [],
      familyHistory: {
        notes: caseData.familyHistory?.notes || "",
      },
    },
  });

  const onSubmit = (data: any) => {
    updateCaseData(data);
    nextStep();
  };

  const labelClass = "text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center";
  const textareaClass = "w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]";
  const hintClass = "text-[11px] font-bold text-slate-400 mb-3 block italic leading-relaxed";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100/80">
        <div className="w-12 h-12 bg-linear-to-br from-indigo-50 to-cyan-50 border border-indigo-100/50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xs shadow-indigo-100">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Special Histories</h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Life Events & Background</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Previous Illness */}
          <div>
            <label className={labelClass}>
              Past Clinical History
            </label>
            <span className={hintClass}>Identified past illnesses, surgery, or prolonged treatments</span>
            <textarea
              {...register("familyHistory.notes")}
              placeholder="Record any significant medical history..."
              className={`${textareaClass} min-h-[100px]`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Family History */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                Family Background & Hereditary Patterns
              </label>
              <span className={hintClass}>Examples: Father, Mother, Siblings - Diabetes, Hypertension, etc.</span>
              <textarea
                {...register("familyHistory.notes")}
                placeholder="Identify hereditary disease patterns..."
                className={`${textareaClass} min-h-[120px]`}
              />
            </div>
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
            isLoading={isSubmitting}
          >
            Review AI Analysis
          </Button>
        </div>
      </form>
    </div>
  );
}
