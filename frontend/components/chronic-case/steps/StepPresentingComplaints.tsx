"use client";

import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialPresentationSchema } from "@/lib/validations/chronicCase";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";

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

  const onSubmit = (data: Record<string, unknown>) => {
    updateCaseData(data as Partial<ChronicCase>);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Clinical Presentation"
        subtitle="Narrative & Observation"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-6 text-sm">
          {/* Patient Narration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100/50 px-2 py-0.5 rounded-lg">Ipsisima Verba</span>
            </div>
            <Textarea
              label="Patient's Narration"
              {...register("initialPresentation.patientNarration")}
              placeholder="Record the patient's exact words..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Physician Observation */}
            <Textarea
              label="Objective Observation"
              {...register("initialPresentation.physicianObservation")}
              placeholder="Facial expression, gait, posture, eye contact..."
              className="min-h-[120px]"
            />

            {/* Complaints Summary */}
            <Textarea
              label="LSMA Framework (Loc/Sens/Mod/Acc)"
              {...register("historyOfPresentIllness.progression")}
              placeholder="Location, Sensation, Modalities, Accompaniments..."
              className="min-h-[120px] border-dashed shadow-none"
            />
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
