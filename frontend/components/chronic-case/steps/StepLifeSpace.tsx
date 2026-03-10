"use client";

import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mentalProfileSchema } from "@/lib/validations/chronicCase";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";

export default function StepLifeSpace({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(mentalProfileSchema),
    defaultValues: {
      lifeSpaceInvestigation: {
        traits: caseData.lifeSpaceInvestigation?.traits || "",
        emotionalUpsets: caseData.lifeSpaceInvestigation?.emotionalUpsets || "",
        cognitiveFunctions: caseData.lifeSpaceInvestigation?.cognitiveFunctions || "",
      },
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    updateCaseData(data as Partial<ChronicCase>);
    nextStep();
  };

  const hintClass = "text-[11px] font-bold text-slate-400 mb-3 block italic leading-relaxed";

  // Debugging: Log errors if any
  if (Object.keys(errors).length > 0) {
    console.log("Validation Errors:", errors);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Mental Profile"
        subtitle="Disposition & Life Space"
        onBack={prevStep}
        isSubmitting={isSubmitting}
        nextLabel="Physical Analysis"
        error={Object.keys(errors).length > 0 ? "Please review the highlighted fields." : undefined}
      >
        <div className="space-y-6 text-sm">
          <div className="space-y-6">
            {/* Traits */}
            <div>
              <span className={hintClass}>Examples: Fastidious, timid, jealous, cheerful, optimistic.</span>
              <Textarea
                label="Traits & Disposition"
                {...register("lifeSpaceInvestigation.traits")}
                placeholder="Describe the patient's dominant mental traits..."
                className="min-h-[100px]"
                error={(errors.lifeSpaceInvestigation as any)?.traits?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Social and Environmental */}
              <div className="md:col-span-2">
                <span className={hintClass}>Examples: Company, solitude, music, reprimands, consolation.</span>
                <Textarea
                  label="Social and environmental reaction patterns"
                  {...register("lifeSpaceInvestigation.cognitiveFunctions")}
                  placeholder="Social and environmental reaction patterns..."
                  className="min-h-[120px]"
                  error={(errors.lifeSpaceInvestigation as any)?.cognitiveFunctions?.message}
                />
              </div>

              {/* Emotional Upsets */}
              <div className="md:col-span-2">
                <span className={hintClass}>Significant emotional events or triggers.</span>
                <Textarea
                  label="Emotional Upsets & Factors"
                  {...register("lifeSpaceInvestigation.emotionalUpsets")}
                  placeholder="Describe past emotional traumas or recurring triggers..."
                  className="min-h-[100px]"
                  error={(errors.lifeSpaceInvestigation as any)?.emotionalUpsets?.message}
                />
              </div>
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
