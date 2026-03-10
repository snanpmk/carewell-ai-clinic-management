import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ChronicCase } from "@/types/chronicCase";
import ChronicCaseStepper from "./ChronicCaseStepper";
import StepPatientDemographics from "@/components/chronic-case/steps/StepPatientDemographics";
import StepPresentingComplaints from "@/components/chronic-case/steps/StepPresentingComplaints";
import StepLifeSpace from "@/components/chronic-case/steps/StepLifeSpace";
import StepPhysicalFeatures from "@/components/chronic-case/steps/StepPhysicalFeatures";
import StepSpecialHistories from "@/components/chronic-case/steps/StepSpecialHistories";
import StepAIAnalysis from "@/components/chronic-case/steps/StepAIAnalysis";
import StepTreatment from "@/components/chronic-case/steps/StepTreatment";

export interface StepProps {
  caseData: Partial<ChronicCase>;
  updateCaseData: (updates: Partial<ChronicCase>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const steps = [
  { id: "demographics", title: "Demographics", component: StepPatientDemographics },
  { id: "complaints", title: "Complaints", component: StepPresentingComplaints },
  { id: "lifeSpace", title: "Mental Profile", component: StepLifeSpace },
  { id: "physical", title: "Physicals", component: StepPhysicalFeatures },
  { id: "special", title: "Special History", component: StepSpecialHistories },
  { id: "ai", title: "AI Analysis", component: StepAIAnalysis },
  { id: "treatment", title: "Treatment", component: StepTreatment },
];

export default function ChronicCaseWizard({ patientId }: { patientId?: string }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [caseData, setCaseData] = useState<Partial<ChronicCase>>({
    patient: patientId || "",
    status: "Draft",
  });

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCaseData = (updates: Partial<ChronicCase>) => {
    setCaseData((prev) => ({ ...prev, ...updates }));
  };

  const ActiveStep = steps[currentStepIndex].component;

  return (
    <div className="flex flex-col mx-auto w-full space-y-4 animate-in fade-in duration-500 pb-8">
      {/* Header Section - Condensed */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl">Chronic Case Builder</h1>
        </div>
        <p className="text-xs text-slate-500 font-medium tracking-tight ">
          Constitutional analysis & repertorization
        </p>
      </div>

      {/* Stepper Navigation */}
      <ChronicCaseStepper steps={steps} currentStepIndex={currentStepIndex} />

      {/* Main Form Container */}
      <div className="w-full">
        <div className="bg-white border border-slate-200 rounded-4xl shadow-2xl shadow-slate-200/40 flex flex-col relative overflow-visible">
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
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
