"use client";

import { useForm } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { DynamicTable } from "@/components/ui/DynamicTable";
import StepLayout from "../StepLayout";
import { History, Users } from "lucide-react";

export default function StepMedicalHistory({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm({
    defaultValues: {
      previousIllnessHistory: caseData.previousIllnessHistory || [],
      familyHistory: caseData.familyHistory || [],
    }
  });

  const onSubmit = (data: Partial<ChronicCase>) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Medical History"
        subtitle="Historical pathologies and genetic background"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-16">
          {/* Section 5: Previous Illness */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-2xl text-brand-primary">
                <History className="w-5 h-5" />
              </div>
              <p className="eyebrow">Previous Clinical Events</p>
            </div>
            <DynamicTable 
              control={control}
              register={register}
              name="previousIllnessHistory"
              label="Illness, trauma, fright, burns, drug allergy, operations, etc."
              addLabel="Add Event"
              emptyRow={{ age: "", event: "", treatment: "", remarks: "" }}
              columns={[
                { header: "Age", accessor: "age", placeholder: "e.g. 12y" },
                { header: "Clinical Event", accessor: "event", placeholder: "e.g. Typhoid" },
                { header: "Treatment Adopted", accessor: "treatment" },
                { header: "Remarks", accessor: "remarks" },
              ]}
            />
          </div>

          {/* Section 6: Family History */}
          <div className="space-y-6 pt-10 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-accent/10 rounded-2xl text-brand-accent">
                <Users className="w-5 h-5" />
              </div>
              <p className="eyebrow">Genetic & Family Archive</p>
            </div>
            <DynamicTable 
              control={control}
              register={register}
              name="familyHistory"
              label="Family Members & Associated Diseases"
              addLabel="Add Member"
              emptyRow={{ relation: "", disease: "", status: "Alive", age: "" }}
              columns={[
                { header: "Relation", accessor: "relation", placeholder: "e.g. Father" },
                { header: "Diseases", accessor: "disease", placeholder: "e.g. Diabetes" },
                { header: "Status", accessor: "status", placeholder: "Alive/Dead" },
                { header: "Age", accessor: "age" },
              ]}
            />
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
