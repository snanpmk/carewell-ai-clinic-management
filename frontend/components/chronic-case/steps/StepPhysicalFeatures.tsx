"use client";

import { StepProps } from "../ChronicCaseWizard";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { physicalsSchema, PhysicalsFormData } from "@/lib/validations/chronicCase";

export default function StepPhysicalFeatures({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(physicalsSchema),
    defaultValues: {
      physicalFeatures: {
        generalAppearance: {
          build: caseData.physicalFeatures?.generalAppearance?.build || "",
          stature: caseData.physicalFeatures?.generalAppearance?.stature || "",
          complexion: caseData.physicalFeatures?.generalAppearance?.complexion || "",
          health: caseData.physicalFeatures?.generalAppearance?.health || "",
          ageAppearance: caseData.physicalFeatures?.generalAppearance?.ageAppearance || "",
          gait: caseData.physicalFeatures?.generalAppearance?.gait || "",
          cleanliness: caseData.physicalFeatures?.generalAppearance?.cleanliness || "",
          swelling: caseData.physicalFeatures?.generalAppearance?.swelling || "",
        },
        functionalGenerals: {
          appetite: caseData.physicalFeatures?.functionalGenerals?.appetite || "",
          stool: caseData.physicalFeatures?.functionalGenerals?.stool || "",
          thirst: caseData.physicalFeatures?.functionalGenerals?.thirst || "",
          urine: caseData.physicalFeatures?.functionalGenerals?.urine || "",
          sweat: caseData.physicalFeatures?.functionalGenerals?.sweat || "",
          sleep: caseData.physicalFeatures?.functionalGenerals?.sleep || "",
          dreams: caseData.physicalFeatures?.functionalGenerals?.dreams || "",
        },
      },
    },
  });

  const onSubmit = (data: any) => {
    updateCaseData(data);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={labelClass}>
               Physical Build
            </label>
            <input
              type="text"
              {...register("physicalFeatures.generalAppearance.build")}
              placeholder="Obese, Thin, Stocky..."
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              Stature
            </label>
            <input
              type="text"
              {...register("physicalFeatures.generalAppearance.stature")}
              placeholder="Tall, Short..."
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              Complexion
            </label>
            <input
              type="text"
              {...register("physicalFeatures.generalAppearance.complexion")}
              placeholder="Fair, Dark..."
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>
              Health
            </label>
            <input
              type="text"
              {...register("physicalFeatures.generalAppearance.health")}
              placeholder="Good, Poor..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className={labelClass}>
              Functional Generals
            </label>
            <span className={hintClass}>Record clinical generals: Sleep, Thirst, Sweat, Bowels, Appetite</span>
            <textarea
              {...register("physicalFeatures.functionalGenerals.appetite")}
              placeholder="Record patterns and irregularities..."
              className={`${textareaClass} min-h-[100px]`}
            />
          </div>

          <div>
            <label className={labelClass}>
              Sleep & Dreams
            </label>
            <textarea
              {...register("physicalFeatures.functionalGenerals.sleep")}
              placeholder="Sleep patterns and significant dreams..."
              className={`${textareaClass} min-h-[100px] border-dashed shadow-none`}
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
            isLoading={isSubmitting}
          >
            Special History
          </Button>
        </div>
      </form>
    </div>
  );
}
