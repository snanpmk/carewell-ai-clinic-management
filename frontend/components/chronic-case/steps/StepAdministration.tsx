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
import { useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function StepAdministration({ caseData, updateCaseData, nextStep }: StepProps) {
  const { data: allPatientsRes } = useQuery<{ success: boolean; data: Patient[] }>({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const { register, handleSubmit, reset, control, formState: { isSubmitting } } = useForm<ChronicCase>({
    defaultValues: {
      patient: caseData.patient || "",
      header: {
        opNumber: caseData.header?.opNumber || "",
        unit: caseData.header?.unit || "",
        caseTakenBy: caseData.header?.caseTakenBy || "",
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

  // Fetch existing chronic cases - enabled whenever a patient is selected
  const { data: existingCases, isFetching: isLoadingExisting } = useQuery({
    queryKey: ["chronicCases", selectedPatientId],
    queryFn: () => getPatientChronicCases(selectedPatientId as string),
    enabled: !!selectedPatientId, 
  });

  const memoPatients = useMemo(() => allPatientsRes?.data || [], [allPatientsRes?.data]);

  useEffect(() => {
    if (!selectedPatientId) return;

    // 1. Logic for existing chronic case found
    if (existingCases && existingCases.length > 0) {
      const latestCase = existingCases[0];
      
      // Prevent infinite loop: Only reset if the case _id is actually different
      if (latestCase._id !== caseData._id) {
        updateCaseData(latestCase);
        
        reset({
          patient: selectedPatientId,
          header: {
            opNumber: latestCase.header?.opNumber || "",
            unit: latestCase.header?.unit || "",
            caseTakenBy: latestCase.header?.caseTakenBy || "",
          },
          demographics: {
            name: latestCase.demographics?.name || "",
            age: latestCase.demographics?.age || 0,
            sex: latestCase.demographics?.sex || "",
            religion: latestCase.demographics?.religion || "",
            caste: latestCase.demographics?.caste || "",
            occupation: latestCase.demographics?.occupation || "",
            phone: latestCase.demographics?.phone || "",
          },
          summaryDiagnosis: {
            diseaseDiagnosis: latestCase.summaryDiagnosis?.diseaseDiagnosis || "",
            homeopathicDiagnosis: latestCase.summaryDiagnosis?.homeopathicDiagnosis || "",
            result: latestCase.summaryDiagnosis?.result || "",
          }
        });
        
        toast.success("Active clinical record detected. Loading most recent analysis.");
      }
    } 
    // 2. Logic for NO existing chronic case (New Case)
    else if (existingCases && existingCases.length === 0) {
      // Only clear if we were previously looking at a different patient
      if (selectedPatientId !== caseData.patient) {
        updateCaseData({
          patient: selectedPatientId,
          status: "Draft",
          header: {},
          demographics: {},
          initialPresentation: {},
          presentingComplaints: [],
          historyOfPresentIllness: {},
          previousIllnessHistory: [],
          familyHistory: [],
          personalHistory: {},
          lifeSpaceInvestigation: {},
          physicalFeatures: {},
          physicalExamination: {},
          femaleHistory: {},
          analysisAndDiagnosis: {},
          management: {},
        });

        const patientRecord = memoPatients.find((p: Patient) => p._id === selectedPatientId);
        if (patientRecord) {
          // Prefill OP Number for new chronic cases
          getNextOPNumber().then(res => {
            reset({
              patient: selectedPatientId,
              header: { 
                opNumber: res.success ? res.data.opNumber : "", 
                unit: "", 
                caseTakenBy: "" 
              },
              demographics: {
                name: patientRecord.name || "",
                age: patientRecord.age || 0,
                sex: patientRecord.sex || patientRecord.gender || "",
                religion: "",
                caste: "",
                occupation: "",
                phone: patientRecord.phone || "",
              },
              summaryDiagnosis: { diseaseDiagnosis: "", homeopathicDiagnosis: "", result: "" }
            });
          });
        }
      }
    }
  }, [selectedPatientId, existingCases, memoPatients, reset, updateCaseData, caseData._id, caseData.patient]);

  const onSubmit = (data: ChronicCase) => {
    // Merge current form data into global state before proceeding
    updateCaseData(data);
    nextStep();
  };

  const patientOptions = useMemo(() => 
    (memoPatients || []).map((p: Patient) => ({
      value: p._id,
      label: `${p.name} (${p.phone})`,
    })), [memoPatients]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Administrative Overview"
        subtitle="Patient registry and clinical metadata"
        isFirstStep
        isSubmitting={isSubmitting}
      >
        <div className="space-y-8">
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between">
              <div className="eyebrow flex items-center gap-2">Patient Registry Lookup</div>
              {isLoadingExisting && <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />}
            </div>
            <div className="max-w-md">
              <Select label="Registered Patient" options={patientOptions} {...register("patient")} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="OP Number" {...register("header.opNumber")} placeholder="e.g. 2024/CR/001" />
            <Input label="Unit" {...register("header.unit")} placeholder="e.g. Unit I" />
            <Input label="Case Taken By" {...register("header.caseTakenBy")} placeholder="Student/Physician Name" />
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
