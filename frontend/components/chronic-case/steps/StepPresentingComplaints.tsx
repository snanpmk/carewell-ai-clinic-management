"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, MapPin, Activity, Zap, Layers, Sparkles, Loader2, Wand2 } from "lucide-react";
import StepLayout from "../StepLayout";
import { extractLSMA } from "@/services/chronicCaseService";
import { toast } from "sonner";
import { useState } from "react";

export default function StepPresentingComplaints({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, control, setValue, formState: { isSubmitting } } = useForm<Partial<ChronicCase>>({
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

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "presentingComplaints"
  });

  const [isExtracting, setIsExtracting] = useState(false);

  const handleMagicSync = async () => {
    const narration = caseData.initialPresentation?.patientNarration;
    if (!narration || narration.length < 20) {
      toast.error("Please provide a detailed 'Patient Narration' in Step 2 first.");
      return;
    }

    try {
      setIsExtracting(true);
      const result = await extractLSMA(narration);
      
      if (result.symptoms && result.symptoms.length > 0) {
        // Map AI results to the form structure
        const mappedSymptoms = result.symptoms.map(sym => ({
          complaintType: sym.complaintType || "Chief",
          location: {
            system: sym.location?.system || "",
            organ: sym.location?.organ || "",
            tissue: sym.location?.tissue || "",
            direction: sym.location?.direction || "",
            extension: sym.location?.extension || "",
            duration: sym.location?.duration || "",
          },
          sensation: sym.sensation || "",
          modalities: {
            aggravation: sym.modalities?.aggravation || "",
            amelioration: sym.modalities?.amelioration || "",
            equivalent: sym.modalities?.equivalent || "",
          },
          accompaniments: sym.accompaniments || "",
        }));

        // Replace the current list with the AI extracted ones
        replace(mappedSymptoms);
        toast.success(`Magic Sync complete: ${mappedSymptoms.length} symptoms extracted.`);
      } else {
        toast.info("AI couldn't find distinct symptoms in the narration.");
      }
    } catch (err) {
      toast.error("AI Magic Sync failed. Please try again or fill manually.");
    } finally {
      setIsExtracting(false);
    }
  };

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div className="eyebrow flex items-center gap-3">
                <Activity className="w-4 h-4" /> Granular Symptom Analysis
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={handleMagicSync}
                  disabled={isExtracting}
                  className="bg-brand-primary shadow-lg shadow-brand-primary/20"
                  leftIcon={isExtracting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                >
                  {isExtracting ? "Syncing..." : "Magic AI Sync"}
                </Button>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={() => append({ complaintType: "Associated", location: {}, modalities: {} })}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Card
                </Button>
              </div>
            </div>

            {/* AI Insight Notification */}
            {!fields.length && !isExtracting && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">No Symptoms Recorded</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
                  Start by adding a card manually or use the Magic AI Sync to extract symptoms from the narration.
                </p>
                <Button variant="outline" size="sm" onClick={() => append({ complaintType: "Chief", location: {}, modalities: {} })}>
                  Add First Symptom
                </Button>
              </div>
            )}

            <div className="space-y-10">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xs relative group animate-in zoom-in-95 duration-500">
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
                        options={[{label: 'Chief Complaint', value:'Chief'}, {label: 'Associated Complaint', value:'Associated'}]} 
                        {...register(`presentingComplaints.${index}.complaintType`)} 
                      />
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <div className="eyebrow !text-[9px] flex items-center gap-2 text-brand-primary">
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
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                          <div className="eyebrow !text-[9px] flex items-center gap-2 text-brand-primary">
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
                          placeholder="Concomitant symptoms (e.g. sweating with pain)..."
                          rows={4}
                          className="h-full"
                        />
                        <div className="p-5 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 text-center italic text-[10px] text-slate-400">
                          LSMA Mapping — Part of Homeopathic Totality
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
