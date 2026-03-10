"use client";

import { StepProps } from "../ChronicCaseWizard";
import { History } from "lucide-react";
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

  const onSubmit = (data: Record<string, any>) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Clinical Presentation"
        subtitle="Narrative & Observation"
        icon={<History className="w-5 h-5" />}
        iconVariant="amber"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-8 text-sm">
          {/* Patient Narration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-lg shadow-xs">Ipsisima Verba</span>
            </div>
            <Textarea
              label="Patient's Narration"
              {...register("initialPresentation.patientNarration")}
              placeholder="Record the patient's exact words..."
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physician Observation */}
            <Textarea
              label="Objective Observation"
              {...register("initialPresentation.physicianObservation")}
              placeholder="Facial expression, gait, posture, eye contact..."
              className="min-h-[140px]"
            />

            {/* Complaints Summary */}
            <Textarea
              label="LSMA Framework (Loc/Sens/Mod/Acc)"
              {...register("historyOfPresentIllness.progression")}
              placeholder="Location, Sensation, Modalities, Accompaniments..."
              className="min-h-[140px] border-dashed shadow-none"
            />
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
