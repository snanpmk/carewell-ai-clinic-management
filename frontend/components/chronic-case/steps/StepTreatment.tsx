"use client";

import { useState } from "react";
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

export default function StepTreatment({ caseData, updateCaseData, prevStep }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const onSave = async (data: any) => {
    setLoading(true);
    setError("");

    try {
      const finalizedCase = { ...caseData, ...data, status: "Completed" as const };
      await createChronicCase(finalizedCase);
      router.push(`/patients/${caseData.patient}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save chronic case.");
    } finally {
      setLoading(false);
    }
  };

  const potencyOptions = [
    { value: "30 CH", label: "30 CH" },
    { value: "200 CH", label: "200 CH" },
    { value: "1M", label: "1M" },
    { value: "10M", label: "10M" },
    { value: "0/1", label: "0/1 (LM)" },
    { value: "Q", label: "Mother Tincture (Q)" },
  ];

  return (
    <StepLayout
      title="Management & Prescription"
      subtitle="Treatment & Remedial Plan"
      icon={<ClipboardList className="w-5 h-5" />}
      iconVariant="blue"
      onBack={prevStep}
      isLastStep
      isSubmitting={loading}
      nextLabel={loading ? "Finalizing..." : "Complete Case"}
      nextIcon={<Save className="w-4 h-4" />}
      error={error}
    >
      <form onSubmit={handleSubmit(onSave)} className="space-y-6 text-sm">
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
      </form>
    </StepLayout>
  );
}
