"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, MapPin, Activity, Zap, Layers } from "lucide-react";
import StepLayout from "../StepLayout";

export default function StepPresentingComplaints({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<Partial<ChronicCase>>({
    defaultValues: {
      presentingComplaints: caseData.presentingComplaints || [
        { complaintType: "Chief", location: {}, modalities: {} }
      ],
      historyOfPresentIllness: {
        narrative: caseData.historyOfPresentIllness?.narrative || "",
        onset: caseData.historyOfPresentIllness?.onset || "",
        cause: caseData.historyOfPresentIllness?.cause || "",
        progression: caseData.historyOfPresentIllness?.progression || "",
        frequency: caseData.historyOfPresentIllness?.frequency || "",
        previousTreatments: caseData.historyOfPresentIllness?.previousTreatments || "",
      }
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "presentingComplaints"
  });

  const onSubmit = (data: Partial<ChronicCase>) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Presenting Complaints"
        subtitle="Mapping the complete symptom totality and clinical history"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-12">
          {/* Section 3: Presenting Complaints */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="eyebrow flex items-center gap-3">
                <Activity className="w-4 h-4" /> Granular Symptom Analysis
              </div>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={() => append({ complaintType: "Associated", location: {}, modalities: {} })}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Complaint
              </Button>
            </div>

            <div className="space-y-10">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 relative group animate-in fade-in duration-500">
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Type & Location */}
                    <div className="lg:col-span-4 space-y-6">
                      <Select 
                        label="Type" 
                        options={[{label: 'Chief', value:'Chief'}, {label: 'Associated', value:'Associated'}]} 
                        {...register(`presentingComplaints.${index}.complaintType`)} 
                      />
                      <div className="p-5 bg-white rounded-2xl border border-slate-100 space-y-4">
                        <div className="eyebrow !text-[9px] flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> Anatomical Location
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input label="System" {...register(`presentingComplaints.${index}.location.system`)} placeholder="e.g. Resp" />
                          <Input label="Organ" {...register(`presentingComplaints.${index}.location.organ`)} placeholder="e.g. Lungs" />
                          <Input label="Tissue" {...register(`presentingComplaints.${index}.location.tissue`)} />
                          <Input label="Direction" {...register(`presentingComplaints.${index}.location.direction`)} />
                          <Input label="Extension" {...register(`presentingComplaints.${index}.location.extension`)} className="col-span-2" />
                          <Input label="Duration" {...register(`presentingComplaints.${index}.location.duration`)} className="col-span-2" />
                        </div>
                      </div>
                    </div>

                    {/* Sensation & Modalities */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <Textarea 
                          label="Sensation" 
                          {...register(`presentingComplaints.${index}.sensation`)} 
                          placeholder="Burning, throbbing, stitching..."
                          rows={4}
                        />
                        <div className="p-5 bg-white rounded-2xl border border-slate-100 space-y-4">
                          <div className="eyebrow !text-[9px] flex items-center gap-2">
                            <Zap className="w-3 h-3" /> Modalities
                          </div>
                          <Input label="Aggravation (<)" {...register(`presentingComplaints.${index}.modalities.aggravation`)} />
                          <Input label="Amelioration (>)" {...register(`presentingComplaints.${index}.modalities.amelioration`)} />
                          <Input label="Equivalent (=)" {...register(`presentingComplaints.${index}.modalities.equivalent`)} />
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <Textarea 
                          label="Accompaniments" 
                          {...register(`presentingComplaints.${index}.accompaniments`)} 
                          placeholder="Concomitant symptoms..."
                          rows={4}
                        />
                        <div className="p-5 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 h-full flex flex-col justify-center text-center italic text-xs text-slate-500">
                          Mapping Loc/Sens/Mod/Acc for complete homeopathic totality.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: HPI */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <div className="eyebrow flex items-center gap-3">
              <Layers className="w-4 h-4" /> History of Present Illness (HPI)
            </div>
            <Textarea 
              label="Chronological Development" 
              {...register("historyOfPresentIllness.narrative")} 
              placeholder="Describe how the current illness developed over time..."
              rows={4}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input label="Onset" {...register("historyOfPresentIllness.onset")} />
              <Input label="Probable Cause" {...register("historyOfPresentIllness.cause")} />
              <Input label="Frequency" {...register("historyOfPresentIllness.frequency")} />
              <Input label="Prev. Treatments" {...register("historyOfPresentIllness.previousTreatments")} />
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
