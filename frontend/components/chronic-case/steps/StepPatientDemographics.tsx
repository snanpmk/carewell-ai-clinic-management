"use client";

import { StepProps } from "../ChronicCaseWizard";
import { ClipboardList, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { getAllPatients } from "@/services/patientService";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { demographicsSchema } from "@/lib/validations/chronicCase";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface Patient {
  _id: string;
  name: string;
  age: number;
  phone: string;
  sex?: string;
}

import StepLayout from "../StepLayout";

export default function StepPatientDemographics({ caseData, updateCaseData, nextStep }: StepProps) {
  const { data: allPatientsRes, isLoading: allPatientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const allPatients = allPatientsRes?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const selectedPatientId = watch("patient");

  // Update form fields when a patient is selected
  useEffect(() => {
    if (selectedPatientId) {
      const patient = allPatients.find((p: Patient) => p._id === selectedPatientId);
      if (patient) {
        setValue("demographics.name", patient.name);
        setValue("demographics.age", patient.age);
        setValue("demographics.sex", patient.sex || "");
      }
    }
  }, [selectedPatientId, allPatients, setValue]);

  const onSubmit = (data: any) => {
    updateCaseData(data);
    nextStep();
  };

  const patientOptions = allPatients.map((p: Patient) => ({
    value: p._id,
    label: `${p.name} (${p.phone || "No Phone"})`,
  }));

  const sexOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  return (
    <StepLayout
      title="Administrative Data"
      subtitle="Patient Demographics & Identification"
      icon={<ClipboardList className="w-5 h-5" />}
      iconVariant="blue"
      isFirstStep
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Selection */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> Choose Registered Patient
          </h3>
          <div className="max-w-md">
            {allPatientsLoading ? (
              <div className="h-11 w-full bg-slate-100 animate-pulse rounded-xl" />
            ) : (
              <Select
                label="Select Patient"
                options={patientOptions}
                placeholder="-- Select Patient --"
                required
                {...register("patient")}
                error={errors.patient?.message as string}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div className="md:col-span-2">
            <Input
              label="Full Patient Name"
              placeholder="John Doe"
              {...register("demographics.name")}
              error={(errors.demographics as any)?.name?.message}
              required
            />
          </div>

          <Input
            label="Age"
            type="number"
            {...register("demographics.age", { valueAsNumber: true })}
            error={(errors.demographics as any)?.age?.message}
            required
          />

          <Select
            label="Sex"
            options={sexOptions}
            placeholder="Select Sex"
            {...register("demographics.sex")}
            error={(errors.demographics as any)?.sex?.message}
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
            />
          </div>
        </div>
      </form>
    </StepLayout>
  );
}

