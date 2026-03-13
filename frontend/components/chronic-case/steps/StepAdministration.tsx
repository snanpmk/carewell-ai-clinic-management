"use client";

import { useForm, useWatch } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import StepLayout from "../StepLayout";
import { useQuery } from "@tanstack/react-query";
import { Patient, getAllPatients } from "@/services/patientService";
import { getPatientChronicCases } from "@/services/chronicCaseService";
import { getNextOPNumber } from "@/services/consultationService";
import { getClinicMembers, ClinicMember } from "@/services/authService";
import { useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function StepAdministration({ caseData, updateCaseData, nextStep }: StepProps) {
  const { user } = useAuthStore();
  const hasInitialized = useRef(false);

  const { data: allPatientsRes, isLoading: isLoadingPatients } = useQuery<{ success: boolean; data: Patient[] }>({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const { data: membersRes } = useQuery<{ success: boolean; data: ClinicMember[] }>({
    queryKey: ["clinicMembers"],
    queryFn: getClinicMembers,
  });

  const { register, handleSubmit, reset, control, formState: { isSubmitting } } = useForm<ChronicCase>({
    defaultValues: {
      patient: caseData.patient || "",
      header: {
        opNumber: caseData.header?.opNumber || "",
        unit: caseData.header?.unit || "",
        caseTakenBy: caseData.header?.caseTakenBy || user?.name || "",
      },
      demographics: {
        name: caseData.demographics?.name || "",
        age: caseData.demographics?.age || 0,
        sex: caseData.demographics?.sex || "",
        religion: caseData.demographics?.religion || "",
        caste: caseData.demographics?.caste || "",
        occupation: caseData.demographics?.occupation || "",
        phone: caseData.demographics?.phone || "",
      },
      summaryDiagnosis: {
        diseaseDiagnosis: caseData.summaryDiagnosis?.diseaseDiagnosis || "",
        homeopathicDiagnosis: caseData.summaryDiagnosis?.homeopathicDiagnosis || "",
        result: caseData.summaryDiagnosis?.result || "",
      }
    }
  });

  const selectedPatientId = useWatch({
    control,
    name: "patient",
  });

  const { data: existingCases, isFetching: isLoadingExisting } = useQuery({
    queryKey: ["chronicCases", selectedPatientId],
    queryFn: () => getPatientChronicCases(selectedPatientId as string),
    enabled: !!selectedPatientId, 
  });

  const memoPatients = useMemo(() => allPatientsRes?.data || [], [allPatientsRes?.data]);

  useEffect(() => {
    if (!selectedPatientId || isLoadingPatients) return;

    // 1. Logic for EXISTING chronic case found
    if (existingCases && existingCases.length > 0) {
      const latestCase = existingCases[0];
      
      if (latestCase._id !== caseData._id) {
        updateCaseData(latestCase);
        
        reset({
          ...latestCase, // Use full object spread for robustness
          patient: selectedPatientId,
          header: {
            ...latestCase.header,
            caseTakenBy: latestCase.header?.caseTakenBy || user?.name || "",
          }
        });
        
        toast.success("Existing clinical record loaded.");
      }
    } 
    // 2. Logic for NEW chronic case population
    else if (existingCases && existingCases.length === 0) {
      const patientRecord = memoPatients.find((p: Patient) => p._id === selectedPatientId);
      
      // Important: Only reset if the demographic name is currently different/empty 
      // OR if we just switched patients
      if (patientRecord && (caseData.patient !== selectedPatientId || !hasInitialized.current)) {
        hasInitialized.current = true;
        
        getNextOPNumber().then(res => {
          const newCaseDefaults = {
            patient: selectedPatientId,
            status: "Draft" as const,
            header: { 
              opNumber: res.success ? res.data.opNumber : "", 
              unit: "", 
              caseTakenBy: user?.name || "" 
            },
            demographics: {
              name: patientRecord.name || "",
              age: patientRecord.age || 0,
              sex: (patientRecord.gender || patientRecord.sex || "") as "Male" | "Female" | "Other",
              religion: "",
              caste: "",
              occupation: "",
              phone: patientRecord.phone || "",
            },
            summaryDiagnosis: { 
              diseaseDiagnosis: "", 
              homeopathicDiagnosis: "", 
              result: "" as "" | "Cured" | "Relieved" | "Referred" | "Otherwise" | "Expired"
            }
          };

          updateCaseData(newCaseDefaults);
          reset(newCaseDefaults);
        });
      }
    }
  }, [selectedPatientId, existingCases, memoPatients, isLoadingPatients, reset, updateCaseData, caseData._id, caseData.patient, user?.name]);

  const onSubmit = (data: ChronicCase) => {
    updateCaseData(data);
    nextStep();
  };

  const patientOptions = useMemo(() => 
    (memoPatients || []).map((p: Patient) => ({
      value: p._id,
      label: `${p.name} (${p.phone})`,
    })), [memoPatients]);

  const doctorOptions = useMemo(() => 
    (membersRes?.data || []).map((m: ClinicMember) => ({
      value: m.name,
      label: m.name,
    })), [membersRes?.data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Administrative Overview"
        subtitle="Patient registry and clinical metadata"
        patientContext={caseData.demographics?.name ? {
          name: caseData.demographics.name,
          age: caseData.demographics.age || 0,
          gender: caseData.demographics.sex || ""
        } : undefined}
        isFirstStep
        isSubmitting={isSubmitting}
      >
        <div className="space-y-8">
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between">
              <div className="eyebrow flex items-center gap-2">Patient Registry Lookup</div>
              {(isLoadingExisting || isLoadingPatients) && <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />}
            </div>
            <div className="max-w-md">
              <Select label="Registered Patient" options={patientOptions} {...register("patient")} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="OP Number" {...register("header.opNumber")} placeholder="e.g. 2024/CR/001" />
            <Input label="Unit" {...register("header.unit")} placeholder="e.g. Unit I" />
            <Select 
              label="Case Taken By" 
              options={doctorOptions} 
              placeholder="Select Member"
              {...register("header.caseTakenBy")} 
            />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="eyebrow mb-6">Patient Identification</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input label="Full Name" {...register("demographics.name")} />
              <Input label="Age" type="number" {...register("demographics.age")} />
              <Select label="Sex" options={[{label: 'Male', value:'Male'}, {label: 'Female', value:'Female'}, {label: 'Other', value:'Other'}]} {...register("demographics.sex")} />
              <Input label="Religion" {...register("demographics.religion")} />
              <Input label="Caste" {...register("demographics.caste")} />
              <Input label="Occupation" {...register("demographics.occupation")} />
              <Input label="Contact Number" {...register("demographics.phone")} />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="eyebrow mb-6">Initial Clinical Summary</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Disease Diagnosis" {...register("summaryDiagnosis.diseaseDiagnosis")} />
              <Input label="Homeopathic Diagnosis" {...register("summaryDiagnosis.homeopathicDiagnosis")} />
              <Select 
                label="Current Result Status" 
                options={["Cured", "Relieved", "Referred", "Otherwise", "Expired"].map(v => ({label: v, value: v}))} 
                {...register("summaryDiagnosis.result")} 
              />
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
