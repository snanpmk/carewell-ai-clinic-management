"use client";

import { useForm, Controller } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { BadgeSelect } from "@/components/ui/BadgeSelect";
import { DynamicTable } from "@/components/ui/DynamicTable";
import { Textarea } from "@/components/ui/Textarea";
import StepLayout from "../StepLayout";
import { Brain, CloudRain, Zap } from "lucide-react";

const MENTAL_TRAITS = [
  "Fastidious", "Lazy", "Hasty", "Changeable mood", "Careless", "Obedient", "Loquacious", "Jealous",
  "Timid", "Imbecile", "Idiotic", "Hypochondriac", "Melancholic", "Envious", "Fearful", "Sluggish",
  "Obstinate", "Peevish", "Introverted", "Extroverted", "Yielding", "Nervous", "Restless", "Suspicious",
  "Religious", "Proud", "Rude", "Cruel", "Violent", "Discontented", "Gentle", "Quiet", "Cheerful",
  "Humorous", "Sympathetic", "Affectionate", "Sentimental", "Romantic", "Gloomy", "Sad", "Optimistic",
  "Pessimistic", "Hopeless", "Shy", "Despondent", "Apathetic"
];

export default function StepLifeSpace({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm({
    defaultValues: {
      lifeSpaceInvestigation: {
        mentalFeatures: caseData.lifeSpaceInvestigation?.mentalFeatures || [],
        emotionalFactors: caseData.lifeSpaceInvestigation?.emotionalFactors || [],
        reactionPatterns: caseData.lifeSpaceInvestigation?.reactionPatterns || [],
        otherFeatures: caseData.lifeSpaceInvestigation?.otherFeatures || {},
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
        title="Mental State"
        subtitle="Life space investigation and mental disposition"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-12">
          {/* Mental Features */}
          <div className="space-y-6">
            <div className="eyebrow flex items-center gap-3">
              <Brain className="w-4 h-4" /> Mental & Behavioural Features
            </div>
            <Controller
              control={control}
              name="lifeSpaceInvestigation.mentalFeatures"
              render={({ field }) => (
                <BadgeSelect 
                  options={MENTAL_TRAITS}
                  selectedValues={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Emotional Upsets Table */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow flex items-center gap-3">
              <CloudRain className="w-4 h-4" /> Historical Emotional Upsets
            </div>
            <DynamicTable 
              control={control}
              register={register}
              name="lifeSpaceInvestigation.emotionalFactors"
              label="Causative Factors (Ailments From)"
              emptyRow={{ factor: "", occasion: "", duration: "" }}
              columns={[
                { header: "Factor (Anger, Grief, etc.)", accessor: "factor", placeholder: "e.g. Grief" },
                { header: "Occasion/Event", accessor: "occasion" },
                { header: "Duration", accessor: "duration" },
              ]}
            />
          </div>

          {/* Reaction Patterns Table */}
          <div className="pt-10 border-t border-slate-100 space-y-6">
            <div className="eyebrow flex items-center gap-3">
              <Zap className="w-4 h-4" /> Reaction Patterns
            </div>
            <DynamicTable 
              control={control}
              register={register}
              name="lifeSpaceInvestigation.reactionPatterns"
              label="Environmental & Social Reactions"
              emptyRow={{ trigger: "", aversion: "", desire: "", aggravation: "" }}
              columns={[
                { header: "Trigger (Music, Company, etc.)", accessor: "trigger" },
                { header: "Aversion", accessor: "aversion" },
                { header: "Desire", accessor: "desire" },
                { header: "Aggravation", accessor: "aggravation" },
                { header: "Amelioration", accessor: "amelioration" },
              ]}
            />
          </div>

          {/* Other Features */}
          <div className="pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Textarea label="Memory & Perception" {...register("lifeSpaceInvestigation.otherFeatures.memory")} placeholder="Memory loss, hallucinations, concentration..." />
            <Textarea label="Thought & Logic" {...register("lifeSpaceInvestigation.otherFeatures.thinking")} placeholder="Thinking patterns, delusions, fantasies..." />
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
