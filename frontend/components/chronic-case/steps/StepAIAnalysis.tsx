"use client";

import { StepProps } from "../ChronicCaseWizard";
import { analyzeChronicCaseWithAI } from "@/services/chronicCaseService";
import { Sparkles, Loader2, ListTree, FlaskConical, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";
import { useMutation } from "@tanstack/react-query";
import { ChronicCase } from "@/types/chronicCase";
import { toast } from "sonner";
import { useEffect } from "react";
import { clsx } from "clsx";

// ---------------------------------------------------------------------------
// Loading skeleton for while AI is generating
// ---------------------------------------------------------------------------
function AnalysisSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-label="Generating AI analysis…">
      {/* Totality skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-36 bg-slate-200 rounded-full" />
        <div className="h-20 bg-slate-100 rounded-xl" />
      </div>
      {/* Miasm + Differentials skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-slate-200 rounded-full" />
          <div className="h-16 bg-slate-100 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-32 bg-slate-200 rounded-full" />
          <div className="h-16 bg-slate-100 rounded-xl" />
        </div>
      </div>
      {/* Rubrics skeleton */}
      <div className="space-y-2 pt-2">
        <div className="h-3 w-24 bg-slate-200 rounded-full" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Prescription Insight panel
// ---------------------------------------------------------------------------
function PrescriptionInsightPanel({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="bg-linear-to-br from-brand-primary/5 to-brand-accent/5 border border-brand-primary/15 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <FlaskConical className="w-4 h-4 text-brand-primary" />
        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          Prescription Cross-Check
        </span>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Step
// ---------------------------------------------------------------------------
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
  const prescriptionInsight = watch("homeopathicDiagnosis.prescriptionInsight" as keyof ChronicCase) as string | undefined;

  const analysisMutation = useMutation({
    mutationFn: analyzeChronicCaseWithAI,
    onSuccess: (result) => {
      setValue("homeopathicDiagnosis.totalityOfSymptoms", result.totalityOfSymptoms || "");
      setValue("homeopathicDiagnosis.miasmaticExpression", result.miasmaticExpression || "");
      setValue("homeopathicDiagnosis.differentialConsiderations", result.differentialConsiderations || "");
      setValue("homeopathicDiagnosis.repertorization", result.repertorization || []);
      // Store prescriptionInsight in the homeopathicDiagnosis node
      setValue("homeopathicDiagnosis.prescriptionInsight", result.prescriptionInsight || "");

      updateCaseData({
        homeopathicDiagnosis: {
          ...caseData.homeopathicDiagnosis,
          totalityOfSymptoms: result.totalityOfSymptoms,
          miasmaticExpression: result.miasmaticExpression,
          differentialConsiderations: result.differentialConsiderations,
          repertorization: result.repertorization,
          prescriptionInsight: result.prescriptionInsight,
        }
      });
      toast.success("AI synthesis complete — review and refine before proceeding.");
    },
    onError: (err) => {
      toast.error((err as Error).message || "AI analysis failed. Please try again.");
      analysisMutation.reset();
    },
  });

  // Auto-trigger analysis on first entry if the case isn't analysed yet
  const hasEnoughData = !!(
    caseData.presentingComplaints?.length ||
    caseData.initialPresentation?.patientNarration ||
    caseData.lifeSpaceInvestigation
  );

  useEffect(() => {
    const alreadyDone = caseData.homeopathicDiagnosis?.totalityOfSymptoms;
    if (!alreadyDone && hasEnoughData && !analysisMutation.isPending) {
      analysisMutation.mutate(caseData);
    }
    // run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAnalysis = () => analysisMutation.mutate(caseData);

  const onSubmit = (data: Partial<ChronicCase>) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Intelligent Synthesis"
        subtitle="AI-assisted clinical synthesis and homeopathic totality"
        onBack={prevStep}
        nextLabel="Final Management"
        headerActions={
          <Button
            type="button"
            onClick={runAnalysis}
            disabled={analysisMutation.isPending}
            variant="primary"
            className="px-6"
            leftIcon={
              analysisMutation.isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Sparkles className="w-4 h-4" />
            }
          >
            {analysisMutation.isPending ? "Synthesising…" : "Re-analyse"}
          </Button>
        }
      >
        <div className="space-y-5 text-sm">

          {/* Loading skeleton */}
          {analysisMutation.isPending && <AnalysisSkeleton />}

          {/* Error state */}
          {analysisMutation.isError && !analysisMutation.isPending && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-700">Analysis failed</p>
                <p className="text-xs text-red-500 mt-0.5">{(analysisMutation.error as Error).message}</p>
              </div>
            </div>
          )}

          {/* Results (shown when not loading) */}
          <div className={clsx("space-y-5 transition-opacity duration-500", analysisMutation.isPending && "opacity-0 pointer-events-none")}>
            <Textarea
              label="Totality of Symptoms (Review & Edit)"
              {...register("homeopathicDiagnosis.totalityOfSymptoms")}
              placeholder="AI will synthesise the case totality here…"
              className="min-h-[90px]"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Miasmatic Evaluation"
                {...register("homeopathicDiagnosis.miasmaticExpression")}
                placeholder="Dominant miasm with justification…"
                className="min-h-[80px]"
              />
              <Textarea
                label="Differential Considerations"
                {...register("homeopathicDiagnosis.differentialConsiderations")}
                placeholder="Remedy profiles for the doctor to study…"
                className="min-h-[80px]"
              />
            </div>

            {/* Repertorization rubrics table */}
            {repertorization && repertorization.length > 0 && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h3 className="eyebrow flex items-center gap-2 mb-4">
                  <ListTree className="w-4 h-4 text-brand-primary" /> Suggested Repertory Rubrics
                </h3>
                <div className="space-y-2">
                  {repertorization.map((item: Record<string, unknown>, index: number) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-xs">
                      <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Symptom</span>
                          <span className="text-slate-700 font-medium">{item.symptom as string}</span>
                        </div>
                        <div className="shrink-0 sm:text-right">
                          <span className="text-[9px] font-bold text-brand-primary/70 uppercase tracking-widest block mb-0.5">Rubric</span>
                          <span className="text-brand-primary font-bold">{item.rubric as string}</span>
                        </div>
                      </div>
                      <p className="text-slate-500 border-t border-slate-50 pt-2 mt-1 italic">
                        &quot;{item.explanation as string}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prescription Cross-Check */}
            <PrescriptionInsightPanel text={prescriptionInsight || (caseData.homeopathicDiagnosis as Record<string, unknown>)?.prescriptionInsight as string || ""} />
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
