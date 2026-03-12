"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { createChronicCase, updateChronicCase } from "@/services/chronicCaseService";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pill, ShieldAlert, Save, Plus, Trash2, Activity, Archive } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import StepLayout from "../StepLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { treatmentSchema, TreatmentFormData } from "@/lib/validations/chronicCase";
import { useEffect } from "react";

export default function StepTreatment({ caseData, nextStep, prevStep }: StepProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitStatus, setSubmitStatus] = useState<"Draft" | "Active" | "Completed">("Active");

  const { register, handleSubmit, control, reset, formState: { isSubmitting, errors } } = useForm<TreatmentFormData>({
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
                form: m.form || "Pills",
                dose: m.dose || "",
                quantity: m.quantity || "",
                indication: m.indication || "",
              }))
            : [{ medicine: "", potency: "", form: "Pills", dose: "", quantity: "", indication: "" }],
        },
      }
    }
  });

  useEffect(() => {
    if (caseData.management) {
      reset({
        management: {
          plan: caseData.management.plan || "",
          restrictions: caseData.management.restrictions || { diet: "", regimen: "", medicinal: "" },
          firstPrescription: {
            basis: caseData.management.firstPrescription?.basis || "",
            medicines: caseData.management.firstPrescription?.medicines?.length 
              ? caseData.management.firstPrescription.medicines.map(m => ({
                  medicine: m.medicine || "",
                  potency: m.potency || "",
                  form: m.form || "Pills",
                  dose: m.dose || "",
                  quantity: m.quantity || "",
                  indication: m.indication || "",
                }))
              : [{ medicine: "", potency: "", form: "Pills", dose: "", quantity: "", indication: "" }],
          },
        }
      });
    }
  }, [caseData, reset]);

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
    const finalizedCase = { ...caseData, ...data, status: submitStatus as ChronicCase["status"] };
    saveMutation.mutate(finalizedCase);
  };

  const onFormError = () => {
    toast.error("Please ensure the prescription details are complete.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onFormError)} className="contents">
      <StepLayout
        title="Treatment Plan"
        subtitle="Management strategy and initial prescription details"
        onBack={prevStep}
        isLastStep
        isSubmitting={isSubmitting || saveMutation.isPending}
        nextLabel={caseData._id ? "Update Case" : "Complete Case"}
        nextIcon={<Save className="w-4 h-4" />}
        customActions={
          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              onClick={() => setSubmitStatus("Draft")}
              variant="outline"
              size="sm"
              isLoading={saveMutation.isPending && submitStatus === "Draft"}
              leftIcon={<Archive className="w-4 h-4" />}
              className="rounded-xl"
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              onClick={() => setSubmitStatus("Active")}
              variant="secondary"
              size="sm"
              isLoading={saveMutation.isPending && submitStatus === "Active"}
              leftIcon={<Activity className="w-4 h-4" />}
              className="rounded-xl"
            >
              Activate Case
            </Button>
            <Button
              type="submit"
              onClick={() => setSubmitStatus("Completed")}
              variant="primary"
              size="sm"
              isLoading={saveMutation.isPending && submitStatus === "Completed"}
              leftIcon={<Save className="w-4 h-4" />}
              className="rounded-xl"
            >
              {caseData._id ? "Update & Complete" : "Complete Case"}
            </Button>
          </div>
        }
      >
        <div className="space-y-12">
          {/* Plan of Treatment */}
          <div className="space-y-6">
            <div className="eyebrow flex items-center gap-3">
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
            <div className="eyebrow flex items-center gap-3">
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
              <div className="eyebrow flex items-center gap-3">
                <Pill className="w-4 h-4" /> Final Selection (Prescriptions)
              </div>
              <Button
                type="button"
                onClick={() => append({ medicine: "", potency: "", form: "Pills", dose: "", quantity: "", indication: "" })}
                variant="primary"
                size="sm"
                className="h-9 rounded-2xl"
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
                  {/* Card */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 shadow-inner overflow-hidden">
                    {/* Header row: index + remove */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
                      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Rx {index + 1}</span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Row 1: Medicine · Potency · Form */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5">
                          <Input 
                            label="Medicine / Remedy" 
                            {...register(`management.firstPrescription.medicines.${index}.medicine` as const)} 
                            placeholder="e.g. Sulphur, Nux Vomica"
                            error={(errors.management?.firstPrescription?.medicines as Array<{ medicine?: { message?: string } }>)?.[index]?.medicine?.message}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Input 
                            label="Potency" 
                            {...register(`management.firstPrescription.medicines.${index}.potency` as const)} 
                            placeholder="e.g. 200c, 1M, Q"
                            error={(errors.management?.firstPrescription?.medicines as Array<{ potency?: { message?: string } }>)?.[index]?.potency?.message}
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Select 
                            label="Physician Form" 
                            options={[
                              { label: "Pills / Globules", value: "Pills" },
                              { label: "Liquid / Droplets", value: "Liquid" },
                              { label: "Powder / Trituration", value: "Powder" },
                              { label: "Tablets", value: "Tablets" },
                              { label: "Mother Tincture (Q)", value: "Q" },
                              { label: "External / Ointment", value: "External" },
                              { label: "Injection", value: "Injection" },
                            ]}
                            {...register(`management.firstPrescription.medicines.${index}.form` as const)} 
                            error={(errors.management?.firstPrescription?.medicines as Array<{ form?: { message?: string } }>)?.[index]?.form?.message}
                          />
                        </div>
                      </div>

                      {/* Row 2: Dose schedule · Quantity */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Input 
                            label="Dose / Schedule" 
                            {...register(`management.firstPrescription.medicines.${index}.dose` as const)} 
                            placeholder="e.g. 4 pills OD, 10 drops TDS"
                            error={(errors.management?.firstPrescription?.medicines as Array<{ dose?: { message?: string } }>)?.[index]?.dose?.message}
                          />
                        </div>
                        <div>
                          <Input 
                            label="Quantity / Supply" 
                            {...register(`management.firstPrescription.medicines.${index}.quantity` as const)}
                            placeholder="e.g. 1 dram, 10 ml, 2 weeks supply"
                          />
                        </div>
                      </div>

                      {/* Row 3: Indication */}
                      <div>
                        <Input
                          label="Indication (Why)"
                          {...register(`management.firstPrescription.medicines.${index}.indication` as const)}
                          placeholder="Clinical reason — e.g. for chronic skin eruptions with burning, worse at night"
                        />
                      </div>
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
