"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChronicCase } from "@/types/chronicCase";
import ChronicCaseStepper from "./ChronicCaseStepper";
import { useAuthStore } from "@/store/useAuthStore";
import { getChronicCase } from "@/services/chronicCaseService";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import StepAdministration from "./steps/StepAdministration";
import StepInitialPresentation from "./steps/StepInitialPresentation";
import StepPresentingComplaints from "./steps/StepPresentingComplaints";
import StepMedicalHistory from "./steps/StepMedicalHistory";
import StepPersonalHistory from "./steps/StepPersonalHistory";
import StepLifeSpace from "./steps/StepLifeSpace";
import StepPhysicalFeatures from "./steps/StepPhysicalFeatures";
import StepPhysicalExamination from "./steps/StepPhysicalExamination";
import StepFemaleHistory from "./steps/StepFemaleHistory";
import StepDiagnosisAnalysis from "./steps/StepDiagnosisAnalysis";
import StepAIAnalysis from "./steps/StepAIAnalysis";
import StepTreatment from "./steps/StepTreatment";

export interface StepProps {
  caseData: Partial<ChronicCase>;
  updateCaseData: (updates: Partial<ChronicCase>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const allSteps = [
  { id: "header", title: "Administration", component: StepAdministration },
  { id: "narrative", title: "Initial Presentation", component: StepInitialPresentation },
  { id: "complaints", title: "Complaints & HPI", component: StepPresentingComplaints },
  { id: "medical", title: "Medical History", component: StepMedicalHistory },
  { id: "personal", title: "Personal History", component: StepPersonalHistory },
  { id: "mental", title: "Mental Profile", component: StepLifeSpace },
  { id: "physical_feat", title: "Physical Constitution", component: StepPhysicalFeatures },
  { id: "physical_exam", title: "Physical Exam", component: StepPhysicalExamination },
  { id: "female", title: "Female History", component: StepFemaleHistory },
  { id: "ai", title: "AI Analysis", component: StepAIAnalysis },
  { id: "diagnosis", title: "Analysis & Diagnosis", component: StepDiagnosisAnalysis },
  { id: "treatment", title: "Plan & Prescription", component: StepTreatment },
];

export default function ChronicCaseWizard({
  patientId,
  caseId,
}: {
  patientId?: string;
  caseId?: string;
}) {
  const { user } = useAuthStore();
  const aiEnabled = user?.clinic?.aiEnabled ?? true;

  // Load existing case if caseId provided (edit mode)
  const { data: fetchedCase, isLoading: caseLoading } = useQuery({
    queryKey: ["chronicCase", caseId],
    queryFn: () => getChronicCase(caseId!),
    enabled: !!caseId,
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [caseData, setCaseData] = useState<Partial<ChronicCase>>({
    patient: patientId || "",
    status: "Draft",
  });

  // Sync when fetchedCase arrives (only once or when caseId changes)
  const [lastFetchedId, setLastFetchedId] = useState<string | null>(null);
  if (fetchedCase && fetchedCase._id !== lastFetchedId) {
    setCaseData(fetchedCase);
    setLastFetchedId(fetchedCase._id || null);
  }

  // Filter steps based on conditions
  const filteredSteps = allSteps.filter((step) => {
    if (step.id === "ai" && !aiEnabled) return false;
    if (step.id === "female" && caseData.demographics?.sex === "Male") return false;
    return true;
  });

  const nextStep = () => {
    if (currentStepIndex < filteredSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (index: number) => {
    setCurrentStepIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateCaseData = (updates: Partial<ChronicCase>) => {
    setCaseData((prev) => ({ ...prev, ...updates }));
  };

  if (caseId && caseLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary mb-4" />
        <p className="text-sm font-medium">Loading case record…</p>
      </div>
    );
  }

  const ActiveStep = filteredSteps[currentStepIndex].component;
  const isEditMode = !!caseData._id;

  return (
    <div className="flex flex-col mx-auto w-full space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-[1px] w-8 bg-brand-primary/40" />
          <span className="eyebrow text-brand-primary/70">Clinical Intelligence</span>
        </div>
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">
          {isEditMode ? (
            <>
              Edit Case{" "}
              <span className="font-semibold text-brand-primary">Record</span>
            </>
          ) : (
            <>
              Chronic Case <span className="font-semibold text-brand-primary">Builder</span>
            </>
          )}
        </h1>
        <p className="text-sm text-slate-500 max-w-md leading-relaxed">
          {isEditMode
            ? "Update the patient's chronic case record. Navigate between sections freely."
            : "Initialize a standardized clinical record with AI-assisted symptom synthesis."}
        </p>
      </div>

      <ChronicCaseStepper
        steps={filteredSteps}
        currentStepIndex={currentStepIndex}
        onStepClick={goToStep}
        isUpdateMode={isEditMode}
      />

      <div className="w-full">
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm flex flex-col relative overflow-visible">
          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={filteredSteps[currentStepIndex].id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ActiveStep
                  caseData={caseData}
                  updateCaseData={updateCaseData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
