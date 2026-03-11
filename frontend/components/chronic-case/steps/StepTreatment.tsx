"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { createChronicCase, updateChronicCase } from "@/services/chronicCaseService";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pill, ShieldAlert, Save, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { treatmentSchema, TreatmentFormData } from "@/lib/validations/chronicCase";

export default function StepTreatment({ caseData, nextStep, prevStep }: StepProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit, control, formState: { isSubmitting, errors } } = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      management: {
        plan: caseData.management?.plan || "",
        restrictions: caseData.management?.restrictions || { diet: "", regimen: "", medicinal: "" },
        firstPrescription: {
          basis: caseData.management?.firstPrescription?.basis || "",
          medicines: caseData.management?.firstPrescription?.medicines?.length 
            ? caseData.management.firstPrescription.medicines.map(m => ({
                medicine: m.medicine || "",
                potency: m.potency || "",
                dose: m.dose || ""
              }))
            : [{ medicine: "", potency: "", dose: "" }],
        },
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "management.firstPrescription.medicines"
  });

  const saveMutation = useMutation({
    mutationFn: (finalData: Partial<ChronicCase>) => {
      if (finalData._id) return updateChronicCase(finalData._id, finalData);
      return createChronicCase(finalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chronicCases"] });
      toast.success(caseData._id ? "Chronic record updated" : "Chronic record committed to registry");
      router.push(`/patients/${caseData.patient}`);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      toast.error(error.response?.data?.error || "Failed to save chronic case");
    }
  });

  const onSubmit = (data: TreatmentFormData) => {
    const finalizedCase = { ...caseData, ...data, status: "Completed" as const };
    saveMutation.mutate(finalizedCase);
  };

  const onFormError = () => {
    toast.error("Please ensure the prescription details are complete.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onFormError)} className="contents">
      <StepLayout
        title="Management & Treatment"
        subtitle="Plan of Treatment & First Prescription"
        onBack={prevStep}
        isLastStep
        isSubmitting={isSubmitting}
        nextLabel={caseData._id ? "Update Case" : "Complete Case"}
        nextIcon={<Save className="w-4 h-4" />}
      >
        <div className="space-y-12">
          {/* Plan of Treatment */}
          <div className="space-y-6">
            <div className="eyebrow text-brand-primary flex items-center gap-3">
              Treatment Strategy
            </div>
            <Textarea 
              label="Clinical Plan" 
              {...register("management.plan")} 
              placeholder="General, surgical, or accessory measures..." 
              rows={3}
            />
          </div>

          {/* Restrictions */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow text-red-500 flex items-center gap-3">
              <ShieldAlert className="w-4 h-4" /> Dietary & Regimen Restrictions
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Dietary Restrictions" {...register("management.restrictions.diet")} />
              <Input label="Regimen Restrictions" {...register("management.restrictions.regimen")} />
              <Input label="Medicinal Restrictions" {...register("management.restrictions.medicinal")} />
            </div>
          </div>

          {/* First Prescription */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <div className="flex items-center justify-between">
              <div className="eyebrow text-brand-accent flex items-center gap-3">
                <Pill className="w-4 h-4" /> Final Selection (Prescriptions)
              </div>
              <Button
                type="button"
                onClick={() => append({ medicine: "", potency: "", dose: "" })}
                variant="primary"
                size="sm"
                className="h-9 rounded-lg"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Medicine
              </Button>
            </div>

            <Textarea 
              label="Basis of Selection" 
              {...register("management.firstPrescription.basis")} 
              placeholder="Rationale for the selected remedies..." 
              rows={2}
            />

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                    <div className="md:col-span-5">
                      <Input 
                        label={`Medicine ${index + 1}`} 
                        {...register(`management.firstPrescription.medicines.${index}.medicine` as const)} 
                        placeholder="Remedy Name"
                        error={(errors.management?.firstPrescription?.medicines as Array<{ medicine?: { message?: string } }>)?.[index]?.medicine?.message}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Input 
                        label="Potency" 
                        {...register(`management.firstPrescription.medicines.${index}.potency` as const)} 
                        placeholder="e.g. 200c"
                        error={(errors.management?.firstPrescription?.medicines as Array<{ potency?: { message?: string } }>)?.[index]?.potency?.message}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Input 
                        label="Dosage" 
                        {...register(`management.firstPrescription.medicines.${index}.dose` as const)} 
                        placeholder="e.g. 4 pills TDS"
                        error={(errors.management?.firstPrescription?.medicines as Array<{ dose?: { message?: string } }>)?.[index]?.dose?.message}
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end justify-center pb-2">
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
