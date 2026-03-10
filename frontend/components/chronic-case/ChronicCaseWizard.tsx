"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChronicCase } from "@/types/chronicCase";
import ChronicCaseStepper from "./ChronicCaseStepper";
import { useAuthStore } from "@/store/useAuthStore";

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

export default function ChronicCaseWizard({ patientId }: { patientId?: string }) {
  const { user } = useAuthStore();
  const aiEnabled = user?.clinic?.aiEnabled ?? true;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [caseData, setCaseData] = useState<Partial<ChronicCase>>({
    patient: patientId || "",
    status: "Draft",
  });

  // Filter steps based on conditions
  const filteredSteps = allSteps.filter(step => {
    // 1. Hide AI step if disabled
    if (step.id === "ai" && !aiEnabled) return false;
    // 2. Hide Female History if patient is Male
    if (step.id === "female" && caseData.demographics?.sex === "Male") return false;
    return true;
  });

  const nextStep = () => {
    if (currentStepIndex < filteredSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateCaseData = (updates: Partial<ChronicCase>) => {
    setCaseData((prev) => ({ ...prev, ...updates }));
  };

  const ActiveStep = filteredSteps[currentStepIndex].component;

  return (
    <div className="flex flex-col mx-auto w-full space-y-4 animate-in fade-in duration-500 pb-8">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl">Chronic Case Builder</h1>
        <p className="text-xs text-slate-500 font-medium tracking-tight">
          Government-standardized clinical record repository
        </p>
      </div>

      <ChronicCaseStepper steps={filteredSteps} currentStepIndex={currentStepIndex} />

      <div className="w-full">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 flex flex-col relative overflow-visible">
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
