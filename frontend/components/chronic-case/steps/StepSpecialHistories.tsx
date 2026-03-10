"use client";

import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { specialHistorySchema } from "@/lib/validations/chronicCase";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";

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

  const onSubmit = (data: Record<string, unknown>) => {
    updateCaseData(data as Partial<ChronicCase>);
    nextStep();
  };

  const hintClass = "text-[11px] font-bold text-slate-400 mb-2 block italic leading-relaxed";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Special Histories"
        subtitle="Life Events & Background"
        onBack={prevStep}
        isSubmitting={isSubmitting}
        nextLabel="Draft Totality"
      >
        <div className="space-y-4 text-sm">
          {/* Previous Illness */}
          <div>
            <span className={hintClass}>Identified past illnesses, surgery, or prolonged treatments</span>
            <Textarea
              label="Past Clinical History"
              {...register("familyHistory.notes")}
              placeholder="Record any significant medical history..."
              className="min-h-[80px]"
            />
          </div>

          {/* Family History */}
          <div>
            <span className={hintClass}>Examples: Father, Mother, Siblings - Diabetes, Hypertension, etc.</span>
            <Textarea
              label="Family Background & Hereditary Patterns"
              {...register("familyHistory.notes")}
              placeholder="Identify hereditary disease patterns..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
