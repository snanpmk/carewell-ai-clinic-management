"use client";

import { useForm } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";

export default function StepInitialPresentation({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      initialPresentation: {
        patientNarration: caseData.initialPresentation?.patientNarration || "",
        physicianInterpretation: caseData.initialPresentation?.physicianInterpretation || "",
        physicianObservation: caseData.initialPresentation?.physicianObservation || "",
      }
    }
  });

  const onSubmit = (data: any) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Initial Presentation"
        subtitle="Patient Narrative & Physician Observations"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-brand-primary/20 italic">Ipsisima Verba</span>
              <p className="eyebrow !text-slate-400">Exact Patient Expressions</p>
            </div>
            <Textarea 
              label="Patient's Narration" 
              {...register("initialPresentation.patientNarration")} 
              placeholder="Record the patient's narration in the very expressions used by him..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            <Textarea 
              label="Physician's Interpretation" 
              {...register("initialPresentation.physicianInterpretation")} 
              placeholder="Analysis of narration, interrogation results..."
              rows={4}
            />
            <Textarea 
              label="Physician's Observation" 
              {...register("initialPresentation.physicianObservation")} 
              placeholder="Objective clinical observations during presentation..."
              rows={4}
            />
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
