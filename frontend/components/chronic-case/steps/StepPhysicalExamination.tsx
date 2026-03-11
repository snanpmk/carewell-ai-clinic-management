"use client";

import { useForm, useWatch } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";
import { useEffect } from "react";
import { Stethoscope, Activity, FileSearch } from "lucide-react";

export default function StepPhysicalExamination({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, control, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      physicalExamination: {
        general: caseData.physicalExamination?.general || {},
        vitals: caseData.physicalExamination?.vitals || {},
        systemic: caseData.physicalExamination?.systemic || {},
      }
    }
  });

  const height = useWatch({ control, name: "physicalExamination.vitals.height" });
  const weight = useWatch({ control, name: "physicalExamination.vitals.weight" });

  useEffect(() => {
    if (height && weight) {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      if (h > 0 && w > 0) {
        const bmi = (w / (h * h)).toFixed(1);
        setValue("physicalExamination.vitals.bmi", bmi);
      }
    }
  }, [height, weight, setValue]);

  const onSubmit = (data: Partial<ChronicCase>) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Clinical Examination"
        subtitle="Objective vitals and systemic clinical findings"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-12">
          {/* General Examination */}
          <div className="space-y-6">
            <div className="eyebrow flex items-center gap-3">
              <FileSearch className="w-4 h-4" /> General Examination
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input label="Jaundice" {...register("physicalExamination.general.jaundice")} />
              <Input label="Anemia" {...register("physicalExamination.general.anemia")} />
              <Input label="Oedema" {...register("physicalExamination.general.oedema")} />
              <Input label="Cyanosis" {...register("physicalExamination.general.cyanosis")} />
              <Input label="Clubbing" {...register("physicalExamination.general.clubbing")} />
              <Input label="Lymphadenopathy" {...register("physicalExamination.general.lymphadenopathy")} />
              <Input label="Skin Color" {...register("physicalExamination.general.skinColor")} />
              <Input label="Eruptions" {...register("physicalExamination.general.eruptions")} />
            </div>
          </div>

          {/* Vitals */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow flex items-center gap-3">
              <Activity className="w-4 h-4" /> Vitals & Anthropometry
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input label="Height (cm)" type="number" {...register("physicalExamination.vitals.height")} />
              <Input label="Weight (kg)" type="number" {...register("physicalExamination.vitals.weight")} />
              <Input label="BMI Index" readOnly {...register("physicalExamination.vitals.bmi")} className="bg-slate-50" />
              <Input label="Blood Pressure" {...register("physicalExamination.vitals.bp")} placeholder="120/80" />
              <Input label="Pulse Rate" {...register("physicalExamination.vitals.pulse")} />
              <Input label="Respiratory Rate" {...register("physicalExamination.vitals.respiration")} />
              <Input label="Temperature (°F)" {...register("physicalExamination.vitals.temperature")} />
            </div>
          </div>

          {/* Systemic Examination */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow flex items-center gap-3">
              <Stethoscope className="w-4 h-4" /> Systemic Examination
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Textarea label="Respiratory System" {...register("physicalExamination.systemic.respiratory")} rows={2} />
              <Textarea label="Cardiovascular" {...register("physicalExamination.systemic.cardiovascular")} rows={2} />
              <Textarea label="Gastrointestinal" {...register("physicalExamination.systemic.gastrointestinal")} rows={2} />
              <Textarea label="CNS & Neuro" {...register("physicalExamination.systemic.cns")} rows={2} />
              <Textarea label="Musculoskeletal" {...register("physicalExamination.systemic.musculoskeletal")} rows={2} />
              <Textarea label="Special Senses" {...register("physicalExamination.systemic.specialSenses")} rows={2} />
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
