"use client";

import { StepProps } from "../ChronicCaseWizard";
import { History, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialPresentationSchema, InitialPresentationFormData } from "@/lib/validations/chronicCase";

export default function StepPresentingComplaints({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(initialPresentationSchema),
    defaultValues: {
      initialPresentation: {
        patientNarration: caseData.initialPresentation?.patientNarration || "",
        physicianObservation: caseData.initialPresentation?.physicianObservation || "",
        physicianInterpretation: caseData.initialPresentation?.physicianInterpretation || "",
      },
      historyOfPresentIllness: {
        progression: caseData.historyOfPresentIllness?.progression || "",
      },
    },
  });

  const onSubmit = (data: any) => {
    updateCaseData(data);
    nextStep();
  };

  const labelClass = "text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center";
  const textareaClass = "w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100/80">
        <div className="w-12 h-12 bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100/50 rounded-2xl flex items-center justify-center text-amber-600 shadow-xs shadow-amber-100">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Presentation</h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Narrative & Observation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="space-y-8 text-sm">
          {/* Patient Narration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>
                Patient's Narration
              </label>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-lg shadow-xs">Ipsisima Verba</span>
            </div>
            <textarea
              {...register("initialPresentation.patientNarration")}
              placeholder="Record the patient's exact words..."
              className={`${textareaClass} min-h-[120px]`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physician Observation */}
            <div>
              <label className={labelClass}>
                Objective Observation
              </label>
              <textarea
                {...register("initialPresentation.physicianObservation")}
                placeholder="Facial expression, gait, posture, eye contact..."
                className={`${textareaClass} min-h-[140px]`}
              />
            </div>

            {/* Complaints Summary */}
            <div>
              <label className={labelClass}>
                LSMA Framework
              </label>
              <textarea
                {...register("historyOfPresentIllness.progression")}
                placeholder="Location, Sensation, Modalities, Accompaniments..."
                className={`${textareaClass} min-h-[140px] border-dashed shadow-none`}
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
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
