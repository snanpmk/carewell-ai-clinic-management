import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ChronicCase } from "@/types/chronicCase";
import { clsx } from "clsx";
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
  };

  const prevStep = () => {
    if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
  };

  const updateCaseData = (updates: Partial<ChronicCase>) => {
    setCaseData((prev) => ({ ...prev, ...updates }));
  };

  const ActiveStep = steps[currentStepIndex].component;

  return (
    <div className="flex flex-col h-full mx-auto w-full space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 shadow-xs shadow-blue-100">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          Chronic Case Builder
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Comprehensive constitutional analysis and repertorization
        </p>
      </div>

      {/* Stepper Navigation */}
      <ChronicCaseStepper steps={steps} currentStepIndex={currentStepIndex} />

      {/* Main Form Container */}
      <div className="flex-1 min-h-[500px]">
        <div className="h-full bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col relative">
          {/* Animated Transition for Steps */}
          <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="h-full"
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
