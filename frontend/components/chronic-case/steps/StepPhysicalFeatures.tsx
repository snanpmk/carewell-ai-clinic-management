"use client";

import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { physicalsSchema } from "@/lib/validations/chronicCase";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";

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

  const onSubmit = (data: Record<string, unknown>) => {
    updateCaseData(data as Partial<ChronicCase>);
    nextStep();
  };

  const hintClass = "text-[11px] font-bold text-slate-400 mb-3 block italic leading-relaxed";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Physical Constitution"
        subtitle="Generals & Physical Features"
        onBack={prevStep}
        isSubmitting={isSubmitting}
        nextLabel="Special History"
      >
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Physical Build"
              {...register("physicalFeatures.generalAppearance.build")}
              placeholder="Obese, Thin..."
            />

            <Input
              label="Stature"
              {...register("physicalFeatures.generalAppearance.stature")}
              placeholder="Tall, Short..."
            />

            <Input
              label="Complexion"
              {...register("physicalFeatures.generalAppearance.complexion")}
              placeholder="Fair, Dark..."
            />

            <Input
              label="Health"
              {...register("physicalFeatures.generalAppearance.health")}
              placeholder="Good, Poor..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className={hintClass}>Record clinical generals: Sleep, Thirst, Sweat, Bowels, Appetite</span>
              <Textarea
                label="Functional Generals"
                {...register("physicalFeatures.functionalGenerals.appetite")}
                placeholder="Record patterns..."
                className="min-h-[60px]"
              />
            </div>

            <Textarea
              label="Sleep & Dreams"
              {...register("physicalFeatures.functionalGenerals.sleep")}
              placeholder="Significant dreams..."
              className="min-h-[60px] border-dashed shadow-none"
            />
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
