"use client";

import { StepProps } from "../ChronicCaseWizard";
import { History, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
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

  const onSubmit = (data: any) => {
    updateCaseData(data);
    nextStep();
  };

  const hintClass = "text-[11px] font-bold text-slate-400 mb-3 block italic leading-relaxed";

  return (
    <StepLayout
      title="Special Histories"
      subtitle="Life Events & Background"
      icon={<History className="w-5 h-5" />}
      iconVariant="indigo"
      onBack={prevStep}
      isSubmitting={isSubmitting}
      nextLabel="Review AI Analysis"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Previous Illness */}
          <div>
            <span className={hintClass}>Identified past illnesses, surgery, or prolonged treatments</span>
            <Textarea
              label="Past Clinical History"
              {...register("familyHistory.notes")}
              placeholder="Record any significant medical history..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Family History */}
            <div className="md:col-span-2">
              <span className={hintClass}>Examples: Father, Mother, Siblings - Diabetes, Hypertension, etc.</span>
              <Textarea
                label="Family Background & Hereditary Patterns"
                {...register("familyHistory.notes")}
                placeholder="Identify hereditary disease patterns..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>
      </form>
    </StepLayout>
  );
}

