"use client";

import { useMemo } from "react";
import { StepProps } from "../ChronicCaseWizard";
import { createChronicCase } from "@/services/chronicCaseService";
import { useRouter } from "next/navigation";
import { ClipboardList, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { treatmentSchema } from "@/lib/validations/chronicCase";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";
import { useMutation } from "@tanstack/react-query";

export default function StepTreatment({ caseData, updateCaseData, prevStep }: StepProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      management: {
        treatmentPlan: caseData.management?.treatmentPlan || "",
        firstPrescription: {
          medicine: caseData.management?.firstPrescription?.medicine || "",
          potency: caseData.management?.firstPrescription?.potency || "",
          dose: caseData.management?.firstPrescription?.dose || "",
        },
      },
    },
  });

  const saveMutation = useMutation({
    mutationFn: createChronicCase,
    onSuccess: () => {
      router.push(`/patients/${caseData.patient}`);
    }
  });

  const onSave = (data: Record<string, any>) => {
    const finalizedCase = { ...caseData, ...data, status: "Completed" as const };
    saveMutation.mutate(finalizedCase);
  };

  const potencyOptions = useMemo(() => [
    { value: "Q", label: "Mother Tincture (Q)" },
    { value: "3x/6x", label: "Trituration (3x/6x)" },
    { value: "30c", label: "30c Centesimal" },
    { value: "200c", label: "200c Centesimal" },
    { value: "1M", label: "1M Centesimal" },
    { value: "10M", label: "10M Centesimal" },
    { value: "0/1", label: "LM/1 50-Millesimal" },
    { value: "0/3", label: "LM/3 50-Millesimal" },
    { value: "0/6", label: "LM/6 50-Millesimal" },
  ], []);

  return (
    <form onSubmit={handleSubmit(onSave)} className="contents">
      <StepLayout
        title="Management & Prescription"
        subtitle="Treatment & Remedial Plan"
        icon={<ClipboardList className="w-5 h-5" />}
        iconVariant="blue"
        onBack={prevStep}
        isLastStep
        isSubmitting={saveMutation.isPending}
        nextLabel={saveMutation.isPending ? "Finalizing..." : "Complete Case"}
        nextIcon={<Save className="w-4 h-4" />}
        error={saveMutation.error?.message}
      >
        <div className="space-y-6 text-sm">
          <div className="space-y-6">
            <Textarea
              label="Treatment Strategy"
              {...register("management.treatmentPlan")}
              placeholder="Overall strategy and clinical goals..."
              className="min-h-[100px]"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="First Prescription"
                {...register("management.firstPrescription.medicine")}
                placeholder="Medicine name..."
                error={errors.management?.firstPrescription?.medicine?.message}
              />
              
              <Select
                label="Potency"
                options={potencyOptions}
                placeholder="Select Potency..."
                {...register("management.firstPrescription.potency")}
                error={errors.management?.firstPrescription?.potency?.message}
              />

              <Input
                label="Dose"
                {...register("management.firstPrescription.dose")}
                placeholder="e.g. 4 pills TDS..."
                error={errors.management?.firstPrescription?.dose?.message}
              />
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
