"use client";

import { StepProps } from "../ChronicCaseWizard";
import { User } from "lucide-react";
import { useEffect, useMemo } from "react";
import { getAllPatients } from "@/services/patientService";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { demographicsSchema } from "@/lib/validations/chronicCase";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useUIStore } from "@/store/useUIStore";
import StepLayout from "../StepLayout";

interface Patient {
  _id: string;
  name: string;
  age: number;
  phone: string;
  sex?: string;
}

export default function StepPatientDemographics({ caseData, updateCaseData, nextStep }: StepProps) {
  const { data: allPatientsRes, isLoading: allPatientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const { privacyMode } = useUIStore();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(demographicsSchema),
    defaultValues: {
      patient: caseData.patient || "",
      demographics: {
        name: caseData.demographics?.name || "",
        age: caseData.demographics?.age || 0,
        sex: caseData.demographics?.sex || "",
        religion: caseData.demographics?.religion || "",
        occupation: caseData.demographics?.occupation || "",
        address: caseData.demographics?.address || "",
      },
    },
  });

  const selectedPatientId = useWatch({
    control,
    name: "patient" as const,
  });

  const memoPatients = useMemo(() => allPatientsRes?.data || [], [allPatientsRes?.data]);

  useEffect(() => {
    if (selectedPatientId) {
      const patient = (memoPatients as Patient[]).find((p: Patient) => p._id === selectedPatientId);
      if (patient) {
        setValue("demographics.name", patient.name);
        setValue("demographics.age", patient.age);
        setValue("demographics.sex", patient.sex || "");
      }
    }
  }, [selectedPatientId, memoPatients, setValue]);

  const onSubmit = (data: Record<string, unknown>) => {
    updateCaseData(data);
    nextStep();
  };

  const patientOptions = useMemo(() => 
    (memoPatients as Patient[]).map((p: Patient) => ({
      value: p._id,
      label: `${p.name} (${p.phone || "No Phone"})`,
    })), [memoPatients]);

  const sexOptions = useMemo(() => [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ], []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Administrative Data"
        subtitle="Patient Demographics & Identification"
        isFirstStep
        isSubmitting={isSubmitting}
        error={Object.keys(errors).length > 0 ? "Please check the required fields below." : undefined}
      >
        <div className="space-y-4">
          {/* Patient Selection */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h3 className="eyebrow text-slate-900! flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-blue-500" /> Choose Registered Patient
            </h3>
            <div className="max-w-md">
              {allPatientsLoading ? (
                <div className="h-10 w-full bg-slate-100 animate-pulse rounded-lg" />
              ) : (
                <Select
                  label="Select Patient"
                  options={patientOptions}
                  placeholder="-- Select Patient --"
                  required
                  {...register("patient")}
                  error={errors.patient?.message as string}
                  privacyBlur={privacyMode}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            <div className="md:col-span-2">
              <Input
                label="Full Patient Name"
                placeholder="John Doe"
                {...register("demographics.name")}
                error={(errors.demographics as Record<string, { message?: string }> | undefined)?.name?.message}
                required
                privacyBlur={privacyMode}
              />
            </div>

            <Input
              label="Age"
              type="number"
              {...register("demographics.age", { valueAsNumber: true })}
              error={(errors.demographics as Record<string, { message?: string }> | undefined)?.age?.message}
              required
            />

            <Select
              label="Sex"
              options={sexOptions}
              placeholder="Select Sex"
              {...register("demographics.sex")}
              error={(errors.demographics as Record<string, { message?: string }> | undefined)?.sex?.message}
              required
            />

            <Input
              label="Occupation"
              {...register("demographics.occupation")}
              placeholder="e.g. Engineer"
            />

            <Input
              label="Religion"
              {...register("demographics.religion")}
              placeholder="e.g. Christian"
            />

            <div className="md:col-span-2">
              <Input
                label="Address"
                {...register("demographics.address")}
                placeholder="Full address details..."
                privacyBlur={privacyMode}
              />
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
