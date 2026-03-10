"use client";

import { StepProps } from "../ChronicCaseWizard";
import { Brain } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mentalProfileSchema } from "@/lib/validations/chronicCase";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";

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

  const hintClass = "text-[11px] font-bold text-slate-400 mb-3 block italic leading-relaxed";

  return (
    <StepLayout
      title="Mental Profile"
      subtitle="Disposition & Life Space"
      icon={<Brain className="w-5 h-5" />}
      iconVariant="purple"
      onBack={prevStep}
      isSubmitting={isSubmitting}
      nextLabel="Physical Analysis"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Traits */}
          <div>
            <span className={hintClass}>Examples: Fastidious, timid, jealous, cheerful, optimistic.</span>
            <Textarea
              label="Traits & Disposition"
              {...register("lifeSpaceInvestigation.cognitiveFunctions")}
              placeholder="Describe the patient's dominant mental traits..."
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotional Upsets */}
            <div className="md:col-span-2">
              <span className={hintClass}>Examples: Company, solitude, music, reprimands, consolation.</span>
              <Textarea
                label="Social and environmental reaction patterns"
                {...register("lifeSpaceInvestigation.cognitiveFunctions")}
                placeholder="Social and environmental reaction patterns..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>
      </form>
    </StepLayout>
  );
}
