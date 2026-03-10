"use client";

import { useForm, Controller } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { BadgeSelect } from "@/components/ui/BadgeSelect";
import StepLayout from "../StepLayout";
import { Heart, Baby, Coffee, Users2 } from "lucide-react";

export default function StepPersonalHistory({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm({
    defaultValues: {
      personalHistory: {
        familyStatus: caseData.personalHistory?.familyStatus || { type: "", details: "" },
        developmentMilestones: caseData.personalHistory?.developmentMilestones || {},
        birthHistory: caseData.personalHistory?.birthHistory || {},
        habitsHobbies: caseData.personalHistory?.habitsHobbies || { addictions: [] },
        domesticRelations: caseData.personalHistory?.domesticRelations || {},
        sexualRelations: caseData.personalHistory?.sexualRelations || { type: "", details: "" },
      }
    }
  });

  const onSubmit = (data: any) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Personal & Social History"
        subtitle="Life Situation, Development & Habits"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-12">
          {/* A. Life Situation & Family */}
          <div className="space-y-6">
            <p className="eyebrow text-brand-primary flex items-center gap-3">
              <Users2 className="w-4 h-4" /> Life Situation & Family Status
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Family Type" 
                options={["Nuclear", "Joint", "Extended"].map(v => ({label: v, value: v}))} 
                {...register("personalHistory.familyStatus.type")} 
              />
              <Input label="Family Details" {...register("personalHistory.familyStatus.details")} placeholder="Members, ages, health status..." />
            </div>
          </div>

          {/* B. Development Milestones & Birth */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <p className="eyebrow text-brand-accent flex items-center gap-3">
              <Baby className="w-4 h-4" /> Development & Birth Archive
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Select 
                label="Fontanella Closure" 
                options={["Early", "Normal", "Late"].map(v => ({label: v, value: v}))} 
                {...register("personalHistory.developmentMilestones.fontanellaClosure")} 
              />
              <Input label="Head Holding" {...register("personalHistory.developmentMilestones.headHolding")} />
              <Input label="Walking" {...register("personalHistory.developmentMilestones.walking")} />
              <Input label="Talking" {...register("personalHistory.developmentMilestones.talking")} />
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select 
                label="Birth Type" 
                options={["Normal", "Abnormal", "Premature"].map(v => ({label: v, value: v}))} 
                {...register("personalHistory.birthHistory.type")} 
              />
              <Input label="Birth Weight (kg)" type="number" step="0.1" {...register("personalHistory.birthHistory.weightKg")} />
              <Input label="Immunization" {...register("personalHistory.birthHistory.immunization")} placeholder="BCG, Polio, etc." />
              <Textarea label="Mother's Condition (Pregnancy)" {...register("personalHistory.birthHistory.motherConditionDuringPregnancy")} className="md:col-span-3" />
            </div>
          </div>

          {/* C. Habits & Hobbies */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <p className="eyebrow text-brand-primary flex items-center gap-3">
              <Coffee className="w-4 h-4" /> Habits & Addictions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Select 
                label="Food / Diet" 
                options={["Vegetarian", "Egg vegetarian", "Non vegetarian"].map(v => ({label: v, value: v}))} 
                {...register("personalHistory.habitsHobbies.diet")} 
              />
              <Controller
                control={control}
                name="personalHistory.habitsHobbies.addictions"
                render={({ field }) => (
                  <BadgeSelect 
                    label="Addictions"
                    options={["Tea", "Coffee", "Smoking", "Chewing", "Drinking", "Drugging"]}
                    selectedValues={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          {/* Domestic & Sexual Relations */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <p className="eyebrow text-red-500 flex items-center gap-3">
              <Heart className="w-4 h-4" /> Relational Dynamics
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Textarea label="Domestic Relations" {...register("personalHistory.domesticRelations.family")} placeholder="Family, neighbors, friends, colleagues..." />
              <div className="space-y-4">
                <Select 
                  label="Sexual Relations" 
                  options={["Premarital", "Marital", "Extramarital", "Others"].map(v => ({label: v, value: v}))} 
                  {...register("personalHistory.sexualRelations.type")} 
                />
                <Input label="Relation Details" {...register("personalHistory.sexualRelations.details")} />
              </div>
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
