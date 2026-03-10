"use client";

import { StepProps } from "../ChronicCaseWizard";
import { Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mentalProfileSchema, MentalProfileFormData } from "@/lib/validations/chronicCase";

export default function StepLifeSpace({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(mentalProfileSchema),
    defaultValues: {
      lifeSpaceInvestigation: {
        traits: caseData.lifeSpaceInvestigation?.traits || [],
        emotionalUpsets: caseData.lifeSpaceInvestigation?.emotionalUpsets || [],
        cognitiveFunctions: caseData.lifeSpaceInvestigation?.cognitiveFunctions || "",
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
        <div className="w-12 h-12 bg-linear-to-br from-purple-50 to-fuchsia-50 border border-purple-100/50 rounded-2xl flex items-center justify-center text-purple-600 shadow-xs shadow-purple-100">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mental Profile</h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Disposition & Life Space</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Traits */}
          <div>
            <label className={labelClass}>
              Traits & Disposition
            </label>
            <span className={hintClass}>Examples: Fastidious, timid, jealous, cheerful, optimistic.</span>
            <textarea
              {...register("lifeSpaceInvestigation.cognitiveFunctions")}
              placeholder="Describe the patient's dominant mental traits..."
              className={`${textareaClass} min-h-[100px]`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotional Upsets */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                Social and environmental reaction patterns
              </label>
              <span className={hintClass}>Examples: Company, solitude, music, reprimands, consolation.</span>
              <textarea
                {...register("lifeSpaceInvestigation.cognitiveFunctions")}
                placeholder="Social and environmental reaction patterns..."
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
            Physical Analysis
          </Button>
        </div>
      </form>
    </div>
  );
}
