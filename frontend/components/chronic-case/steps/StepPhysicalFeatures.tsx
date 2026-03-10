"use client";

import { useForm, Controller } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { BadgeSelect } from "@/components/ui/BadgeSelect";
import { DynamicTable } from "@/components/ui/DynamicTable";
import StepLayout from "../StepLayout";
import { User, Thermometer, Wind, Zap } from "lucide-react";

const TENDENCIES = [
  "Hemorrhagic", "Suppurative", "Abscess", "Boils", "Catch cold", "Exhausted", "Spasms", "Cramps", "Sprain", "Perspire", "Growth fast", "Growth retarded", "Fatty", "Lean"
];

export default function StepPhysicalFeatures({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm({
    defaultValues: {
      physicalFeatures: {
        appearance: caseData.physicalFeatures?.appearance || {},
        regionalExamination: caseData.physicalFeatures?.regionalExamination || {},
        generals: caseData.physicalFeatures?.generals || {},
        reactionsToFactors: caseData.physicalFeatures?.reactionsToFactors || [],
        constitution: caseData.physicalFeatures?.constitution || { tendencies: [] },
      }
    }
  });

  const onSubmit = (data: Partial<ChronicCase>) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Physical Constitution"
        subtitle="Appearance, Generals & Reactivity"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-12">
          {/* Appearance & Regional Snapshot */}
          <div className="space-y-6">
            <div className="eyebrow text-brand-primary flex items-center gap-3">
              <User className="w-4 h-4" /> Physical Appearance
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Select label="Build" options={["Obese", "Stocky", "Thin"].map(v => ({label: v, value: v}))} {...register("physicalFeatures.appearance.build")} />
              <Select label="Stature" options={["Large", "Small"].map(v => ({label: v, value: v}))} {...register("physicalFeatures.appearance.stature")} />
              <Select label="Complexion" options={["Healthy", "Unwell", "Ill"].map(v => ({label: v, value: v}))} {...register("physicalFeatures.appearance.complexion")} />
              <Select label="Cleanliness" options={["Clean", "Dirty"].map(v => ({label: v, value: v}))} {...register("physicalFeatures.appearance.cleanliness")} />
            </div>
            <Textarea label="Regional Examination Notes" {...register("physicalFeatures.regionalExamination.headScalpHair")} placeholder="Summary of head, eyes, nose, throat, abdomen, extremities..." rows={3} />
          </div>

          {/* Functional Generals */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow text-brand-accent flex items-center gap-3">
              <Zap className="w-4 h-4" /> Functional Generals
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input label="Appetite" {...register("physicalFeatures.generals.appetite")} />
              <Input label="Thirst" {...register("physicalFeatures.generals.thirst")} />
              <Input label="Stool" {...register("physicalFeatures.generals.stool")} />
              <Input label="Sweat" {...register("physicalFeatures.generals.sweat")} />
              <Input label="Sleep & Dreams" {...register("physicalFeatures.generals.sleep")} />
              <Input label="Discharges" {...register("physicalFeatures.generals.discharges")} />
            </div>
          </div>

          {/* Reactions to Factors Table */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow text-brand-primary flex items-center gap-3">
              <Wind className="w-4 h-4" /> Reactivity to Environmental Factors
            </div>
            <DynamicTable 
              control={control}
              register={register}
              name="physicalFeatures.reactionsToFactors"
              label="Intolerance, Sensitivity & Modalities"
              emptyRow={{ factor: "", intolerance: "", aggravation: "", amelioration: "" }}
              columns={[
                { header: "Factor", accessor: "factor", placeholder: "e.g. Weather" },
                { header: "Intolerance", accessor: "intolerance" },
                { header: "Aggravation", accessor: "aggravation" },
                { header: "Amelioration", accessor: "amelioration" },
              ]}
            />
          </div>

          {/* Constitution & Tendencies */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <div className="eyebrow text-brand-accent flex items-center gap-3">
              <Thermometer className="w-4 h-4" /> Constitutional Profile
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Select label="Physical Makeup" options={["Carbon", "Nitrogenoid", "Oxygenoid"].map(v => ({label: v, value: v}))} {...register("physicalFeatures.constitution.physicalMakeup")} />
              <Select label="Temperament" options={["Choleric", "Melancholic", "Nervous", "Sanguine", "Phlegmatic"].map(v => ({label: v, value: v}))} {...register("physicalFeatures.constitution.temperament")} />
              <Select label="Thermal" options={["Hot", "Ambient", "Cold"].map(v => ({label: v, value: v}))} {...register("physicalFeatures.constitution.thermal")} />
              <Select label="Side Affinity" options={["Left", "Right", "Alternating", "None"].map(v => ({label: v, value: v}))} {...register("physicalFeatures.constitution.sideAffinity")} />
            </div>
            <Controller
              control={control}
              name="physicalFeatures.constitution.tendencies"
              render={({ field }) => (
                <BadgeSelect 
                  label="Diathetic Tendencies"
                  options={TENDENCIES}
                  selectedValues={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
