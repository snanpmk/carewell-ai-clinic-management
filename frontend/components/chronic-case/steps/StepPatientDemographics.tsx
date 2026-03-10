"use client";

import { StepProps } from "../ChronicCaseWizard";
import { User, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { getAllPatients } from "@/services/patientService";
import { getPatientChronicCases } from "@/services/chronicCaseService";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { demographicsSchema } from "@/lib/validations/chronicCase";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useUIStore } from "@/store/useUIStore";
import StepLayout from "../StepLayout";
import { toast } from "sonner";

interface Patient {
  _id: string;
  name: string;
  age: number;
  phone: string;
  sex?: string;
  address?: string;
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
    reset,
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

  // Fetch existing chronic cases for the selected patient
  const { data: existingCases, isFetching: isLoadingExisting } = useQuery({
    queryKey: ["chronicCases", selectedPatientId],
    queryFn: () => getPatientChronicCases(selectedPatientId as string),
    enabled: !!selectedPatientId && selectedPatientId !== caseData.patient, 
  });

  const memoPatients = useMemo(() => allPatientsRes?.data || [], [allPatientsRes?.data]);

  // Handle case auto-population
  useEffect(() => {
    // 1. If we have existing chronic cases for the NEWLY selected patient
    if (selectedPatientId && existingCases && existingCases.length > 0 && selectedPatientId !== caseData.patient) {
      const latestCase = existingCases[0];
      
      // Update parent wizard state with EVERYTHING from the existing case
      updateCaseData(latestCase);
      
      // Update local form fields for this step specifically
      reset({
        patient: selectedPatientId,
        demographics: {
          name: latestCase.demographics?.name || "",
          age: latestCase.demographics?.age || 0,
          sex: latestCase.demographics?.sex || "",
          religion: latestCase.demographics?.religion || "",
          occupation: latestCase.demographics?.occupation || "",
          address: latestCase.demographics?.address || "",
        }
      });
      
      toast.success("Existing chronic case found and loaded for update.");
    } 
    // 2. If patient changed but NO existing chronic case found
    else if (selectedPatientId && existingCases && existingCases.length === 0 && selectedPatientId !== caseData.patient) {
      // Clear previous case data but keep current patient ID
      updateCaseData({
        patient: selectedPatientId,
        status: "Draft",
        // Reset major objects to empty
        demographics: {},
        initialPresentation: {},
        presentingComplaints: [],
        historyOfPresentIllness: {},
        previousIllnessHistory: [],
        familyHistory: [],
        personalHistory: {},
        lifeSpaceInvestigation: {},
        physicalFeatures: {},
        homeopathicDiagnosis: {},
        management: {},
      });

      // Sync demographics from patient record
      const patient = (memoPatients as Patient[]).find((p: Patient) => p._id === selectedPatientId);
      if (patient) {
        reset({
          patient: selectedPatientId,
          demographics: {
            name: patient.name || "",
            age: patient.age || 0,
            sex: patient.sex || "",
            religion: "",
            occupation: "",
            address: patient.address || "",
          }
        });
      }
    }
    // 3. Fallback for initial sync from patient record (if no cases fetch happened yet)
    else if (selectedPatientId && !existingCases) {
      const patient = (memoPatients as Patient[]).find((p: Patient) => p._id === selectedPatientId);
      if (patient) {
        setValue("demographics.name", patient.name);
        setValue("demographics.age", patient.age);
        setValue("demographics.sex", patient.sex || "");
      }
    }
  }, [selectedPatientId, existingCases, memoPatients, setValue, reset, updateCaseData, caseData.patient]);

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
            <div className="max-w-md relative">
              {allPatientsLoading ? (
                <div className="h-10 w-full bg-slate-100 animate-pulse rounded-lg" />
              ) : (
                <>
                  <Select
                    label="Select Patient"
                    options={patientOptions}
                    placeholder="Select Patient"
                    required
                    {...register("patient")}
                    error={errors.patient?.message as string}
                    privacyBlur={privacyMode}
                  />
                  {isLoadingExisting && (
                    <div className="absolute right-10 top-[38px]">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                    </div>
                  )}
                </>
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
