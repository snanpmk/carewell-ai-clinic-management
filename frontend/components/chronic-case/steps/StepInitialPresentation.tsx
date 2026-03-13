"use client";

import { useForm } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
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

  const onSubmit = (data: Partial<ChronicCase>) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Opening Narrative"
        subtitle="Capturing the patient's own words and initial clinical impressions"
        patientContext={caseData.demographics?.name ? {
          name: caseData.demographics.name,
          age: caseData.demographics.age || 0,
          gender: caseData.demographics.sex || ""
        } : undefined}
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[9px] font-bold uppercase tracking-widest rounded-2xl border border-brand-primary/20 italic">Ipsisima Verba</span>
              <p className="eyebrow">Exact Patient Expressions</p>
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
