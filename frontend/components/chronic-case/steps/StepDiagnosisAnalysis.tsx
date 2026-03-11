"use client";

import { useForm, Controller } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { BadgeSelect } from "@/components/ui/BadgeSelect";
import { DynamicTable } from "@/components/ui/DynamicTable";
import StepLayout from "../StepLayout";
import { Microscope, Search, Target } from "lucide-react";
import { toast } from "sonner";

export default function StepDiagnosisAnalysis({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm({
    defaultValues: {
      analysisAndDiagnosis: {
        provisionalDiagnosis: caseData.analysisAndDiagnosis?.provisionalDiagnosis || "",
        differentialDiagnosis: caseData.analysisAndDiagnosis?.differentialDiagnosis || "",
        symptomAnalysis: caseData.analysisAndDiagnosis?.symptomAnalysis || {},
        laboratoryFindings: caseData.analysisAndDiagnosis?.laboratoryFindings || "",
        finalDiagnosis: caseData.analysisAndDiagnosis?.finalDiagnosis || {},
        evaluation: caseData.analysisAndDiagnosis?.evaluation || { miasmaticExpression: [] },
        repertorization: caseData.analysisAndDiagnosis?.repertorization || { table: [] },
      }
    }
  });

  const onSubmit = (data: Partial<ChronicCase>) => {
    updateCaseData(data);
    nextStep();
  };

  const onFormError = () => {
    toast.error("Required fields missing in Analysis & Diagnosis.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onFormError)} className="contents">
      <StepLayout
        title="Analysis & Diagnosis"
        subtitle="Clinical Synthesis & Homeopathic Totality"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-12">
          {/* Analysis Table */}
          <div className="space-y-6">
            <div className="eyebrow text-brand-primary flex items-center gap-3">
              <Search className="w-4 h-4" /> Symptom Analysis
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Textarea 
                label="Basic / Common / Pathognomonic" 
                {...register("analysisAndDiagnosis.symptomAnalysis.basicCommon")} 
                placeholder="List diagnostic symptoms..." 
                rows={3}
              />
              <Textarea 
                label="Determinative / Uncommon / Characteristic" 
                {...register("analysisAndDiagnosis.symptomAnalysis.determinativeUncommon")} 
                placeholder="List individualized symptoms..." 
                rows={3}
              />
            </div>
          </div>

          {/* Laboratory Findings */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow text-brand-accent flex items-center gap-3">
              <Microscope className="w-4 h-4" /> Investigations & Labs
            </div>
            <Textarea 
              label="Laboratory Summary" 
              {...register("analysisAndDiagnosis.laboratoryFindings")} 
              placeholder="Urine, Stool, Blood, Imaging, ECG, etc." 
              rows={3}
            />
          </div>

          {/* Totality & Miasm */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <div className="eyebrow text-brand-primary flex items-center gap-3">
              <Target className="w-4 h-4" /> Evaluation of Totality
            </div>
            <Textarea 
              label="Totality of Symptoms" 
              {...register("analysisAndDiagnosis.evaluation.totalityOfSymptoms")} 
              rows={4}
            />
            <Controller
              control={control}
              name="analysisAndDiagnosis.evaluation.miasmaticExpression"
              render={({ field }) => (
                <BadgeSelect 
                  label="Miasmatic Expression"
                  options={["Psora", "Sycosis", "Syphilis"]}
                  selectedValues={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Repertorization Table */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow text-slate-900! flex items-center gap-3">
              Repertorial Analysis
            </div>
            <Input label="Name of Repertory" {...register("analysisAndDiagnosis.repertorization.repertoryName")} placeholder="e.g. Kent, Synthesis..." />
            <DynamicTable 
              control={control}
              register={register}
              name="analysisAndDiagnosis.repertorization.table"
              label="Symptoms & Rubrics"
              emptyRow={{ symptom: "", rubric: "", explanation: "" }}
              columns={[
                { header: "Symptom", accessor: "symptom" },
                { header: "Rubric", accessor: "rubric" },
                { header: "Explanation", accessor: "explanation" },
              ]}
            />
          </div>

          {/* Final Diagnosis */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow text-brand-accent flex items-center gap-3">
              Final Conclusions
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Disease Diagnosis" {...register("analysisAndDiagnosis.finalDiagnosis.disease")} />
              <Input label="Hahnemannian Classification" {...register("analysisAndDiagnosis.finalDiagnosis.hahnemannianClassification")} />
              <Input label="Miasm Dominance" {...register("analysisAndDiagnosis.finalDiagnosis.miasmDominance")} />
              <Input label="Homeopathic Diagnosis" {...register("analysisAndDiagnosis.finalDiagnosis.homeopathicDiagnosis")} />
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
