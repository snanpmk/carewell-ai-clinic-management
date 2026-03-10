"use client";

import { useState, useEffect } from "react";
import { StepProps } from "../ChronicCaseWizard";
import { analyzeChronicCaseWithAI } from "@/services/chronicCaseService";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";

export default function StepAIAnalysis({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      homeopathicDiagnosis: {
        totalityOfSymptoms: caseData.homeopathicDiagnosis?.totalityOfSymptoms || "",
        miasmaticExpression: caseData.homeopathicDiagnosis?.miasmaticExpression || "",
        repertorization: caseData.homeopathicDiagnosis?.repertorization || [],
      }
    }
  });

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await analyzeChronicCaseWithAI(caseData);
      
      setValue("homeopathicDiagnosis.totalityOfSymptoms", result.totalityOfSymptoms || "");
      setValue("homeopathicDiagnosis.miasmaticExpression", result.miasmaticExpression || "");
      setValue("homeopathicDiagnosis.repertorization", result.repertorization || []);

      updateCaseData({
        homeopathicDiagnosis: {
          ...caseData.homeopathicDiagnosis,
          totalityOfSymptoms: result.totalityOfSymptoms,
          miasmaticExpression: result.miasmaticExpression,
          repertorization: result.repertorization,
        }
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to run AI analysis");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <StepLayout
      title="Miasmatic Analysis"
      subtitle="AI Totality & Expression"
      icon={<Sparkles className="w-5 h-5" />}
      iconVariant="gradient"
      onBack={prevStep}
      nextLabel="Final Management"
      error={error}
      headerActions={
        <Button
          type="button"
          onClick={runAnalysis}
          disabled={loading}
          variant="primary"
          className="shadow-md shadow-indigo-500/20 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none px-6"
          leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        >
          {loading ? "Analyzing..." : "Generate Analysis"}
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Totality */}
          <Textarea
            label="Totality of Symptoms"
            {...register("homeopathicDiagnosis.totalityOfSymptoms")}
            placeholder="Waiting for AI synthesis..."
            className="min-h-[100px]"
          />

          <Textarea
            label="Miasmatic Expression"
            {...register("homeopathicDiagnosis.miasmaticExpression")}
            placeholder="Psora, Sycosis, Syphilis dominant..."
            className="min-h-[140px]"
          />
        </div>
      </form>
    </StepLayout>
  );
}
