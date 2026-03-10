"use client";

import { StepProps } from "../ChronicCaseWizard";
import { analyzeChronicCaseWithAI } from "@/services/chronicCaseService";
import { Sparkles, Loader2, ListTree } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";
import { useMutation } from "@tanstack/react-query";
import { ChronicCase } from "@/types/chronicCase";

export default function StepAIAnalysis({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, setValue, watch } = useForm<ChronicCase>({
    defaultValues: {
      homeopathicDiagnosis: {
        totalityOfSymptoms: caseData.homeopathicDiagnosis?.totalityOfSymptoms || "",
        miasmaticExpression: caseData.homeopathicDiagnosis?.miasmaticExpression || "",
        differentialConsiderations: caseData.homeopathicDiagnosis?.differentialConsiderations || "",
        repertorization: caseData.homeopathicDiagnosis?.repertorization || [],
      }
    }
  });

  const repertorization = watch("homeopathicDiagnosis.repertorization");

  const analysisMutation = useMutation({
    mutationFn: analyzeChronicCaseWithAI,
    onSuccess: (result) => {
      setValue("homeopathicDiagnosis.totalityOfSymptoms", result.totalityOfSymptoms || "");
      setValue("homeopathicDiagnosis.miasmaticExpression", result.miasmaticExpression || "");
      setValue("homeopathicDiagnosis.differentialConsiderations", result.differentialConsiderations || "");
      setValue("homeopathicDiagnosis.repertorization", result.repertorization || []);

      updateCaseData({
        homeopathicDiagnosis: {
          ...caseData.homeopathicDiagnosis,
          totalityOfSymptoms: result.totalityOfSymptoms,
          miasmaticExpression: result.miasmaticExpression,
          differentialConsiderations: result.differentialConsiderations,
          repertorization: result.repertorization,
        }
      });
    }
  });

  const runAnalysis = () => {
    analysisMutation.mutate(caseData);
  };

  const onSubmit = (data: Partial<ChronicCase>) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Analytical Drafting"
        subtitle="AI-Assisted Synthesis & Totality"
        onBack={prevStep}
        nextLabel="Final Management"
        error={analysisMutation.error?.message}
        headerActions={
          <Button
            type="button"
            onClick={runAnalysis}
            disabled={analysisMutation.isPending}
            variant="primary"
            className="shadow-md shadow-indigo-500/20 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none px-6"
            leftIcon={analysisMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          >
            {analysisMutation.isPending ? "Analyzing..." : "Draft Totality"}
          </Button>
        }
      >
        <div className="space-y-4 text-sm">
          <div className="space-y-4">
            <Textarea
              label="Suggested Totality (Review & Edit)"
              {...register("homeopathicDiagnosis.totalityOfSymptoms")}
              placeholder="Awaiting synthesis..."
              className="min-h-[80px]"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Miasmatic Evaluation"
                {...register("homeopathicDiagnosis.miasmaticExpression")}
                placeholder="Dominant miasm..."
                className="min-h-[80px]"
              />

              <Textarea
                label="Differential Considerations"
                {...register("homeopathicDiagnosis.differentialConsiderations")}
                placeholder="Suggested remedy profiles..."
                className="min-h-[80px]"
              />
            </div>

            {/* Read-only Repertorization Display */}
            {repertorization && repertorization.length > 0 && (
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/60">
                <h3 className="eyebrow text-slate-900! flex items-center gap-2 mb-4">
                  <ListTree className="w-4 h-4 text-indigo-500" /> Suggested Rubrics
                </h3>
                <div className="space-y-3">
                  {repertorization.map((item: Record<string, unknown>, index: number) => (
                    <div key={index} className="bg-white p-3 rounded-xl border border-indigo-50/80 shadow-sm text-xs">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
                        <div className="flex-1">
                          <span className="font-bold text-slate-700">Symptom: </span>
                          <span className="text-slate-600">{item.symptom as string}</span>
                        </div>
                        <div className="flex-1">
                          <span className="font-bold text-indigo-600">Rubric: </span>
                          <span className="text-indigo-700 font-medium">{item.rubric as string}</span>
                        </div>
                      </div>
                      <p className="text-slate-500 italic border-t border-slate-50 pt-2 mt-1">
                        &quot;{item.explanation as string}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
