"use client";

import { useForm } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";
import { createChronicCase, updateChronicCase } from "@/services/chronicCaseService";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pill, ShieldAlert, Save } from "lucide-react";

export default function StepTreatment({ caseData, updateCaseData, prevStep }: StepProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      management: {
        plan: caseData.management?.plan || "",
        restrictions: caseData.management?.restrictions || {},
        firstPrescription: caseData.management?.firstPrescription || {},
      }
    }
  });

  const saveMutation = useMutation({
    mutationFn: (finalData: any) => {
      if (finalData._id) return updateChronicCase(finalData._id, finalData);
      return createChronicCase(finalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chronicCases"] });
      toast.success(caseData._id ? "Chronic record updated" : "Chronic record committed to registry");
      router.push(`/patients/${caseData.patient}`);
    }
  });

  const onSubmit = (data: any) => {
    const finalizedCase = { ...caseData, ...data, status: "Completed" };
    saveMutation.mutate(finalizedCase);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Management & Treatment"
        subtitle="Plan of Treatment & First Prescription"
        onBack={prevStep}
        isLastStep
        isSubmitting={saveMutation.isPending}
        nextLabel={caseData._id ? "Update Case" : "Complete Case"}
        nextIcon={<Save className="w-4 h-4" />}
      >
        <div className="space-y-12">
          {/* Plan of Treatment */}
          <div className="space-y-6">
            <p className="eyebrow text-brand-primary flex items-center gap-3">
              Treatment Strategy
            </p>
            <Textarea 
              label="Clinical Plan" 
              {...register("management.plan")} 
              placeholder="General, surgical, or accessory measures..." 
              rows={3}
            />
          </div>

          {/* Restrictions */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <p className="eyebrow text-red-500 flex items-center gap-3">
              <ShieldAlert className="w-4 h-4" /> Dietary & Regimen Restrictions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Dietary Restrictions" {...register("management.restrictions.diet")} />
              <Input label="Regimen Restrictions" {...register("management.restrictions.regimen")} />
              <Input label="Medicinal Restrictions" {...register("management.restrictions.medicinal")} />
            </div>
          </div>

          {/* First Prescription */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <p className="eyebrow text-brand-accent flex items-center gap-3">
              <Pill className="w-4 h-4" /> Final Selection (First Prescription)
            </p>
            <Textarea 
              label="Basis of Selection" 
              {...register("management.firstPrescription.basis")} 
              placeholder="Rationale for the selected remedy and potency..." 
              rows={2}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
              <Input label="Remedy / Medicine" {...register("management.firstPrescription.medicine")} required />
              <Input label="Potency" {...register("management.firstPrescription.potency")} required />
              <Input label="Dosage" {...register("management.firstPrescription.dose")} required />
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
