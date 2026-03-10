"use client";

import { useState } from "react";
import { StepProps } from "../ChronicCaseWizard";
import { createChronicCase } from "@/services/chronicCaseService";
import { useRouter } from "next/navigation";
import { ClipboardList, ChevronLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { treatmentSchema, TreatmentFormData } from "@/lib/validations/chronicCase";

export default function StepTreatment({ caseData, updateCaseData, prevStep }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      management: {
        treatmentPlan: caseData.management?.treatmentPlan || "",
        firstPrescription: {
          medicine: caseData.management?.firstPrescription?.medicine || "",
          potency: caseData.management?.firstPrescription?.potency || "",
          dose: caseData.management?.firstPrescription?.dose || "",
        },
      },
    },
  });

  const onSave = async (data: any) => {
    setLoading(true);
    setError("");

    try {
      const finalizedCase = { ...caseData, ...data, status: "Completed" as const };
      await createChronicCase(finalizedCase);
      router.push(`/patients/${caseData.patient}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save chronic case.");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center";
  const inputClass = "w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]";
  const textareaClass = "w-full bg-slate-50/50 border border-slate-200/80 text-slate-900 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none font-medium shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]";
  const hintClass = "text-[11px] font-bold text-slate-400 mb-3 block italic leading-relaxed";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100/80">
        <div className="w-12 h-12 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 shadow-xs shadow-blue-100">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Management & Prescription</h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Treatment & Remedial Plan</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-6 text-sm">
        <div className="space-y-6">
          {/* Plan */}
          <div>
            <label className={labelClass}>
              Treatment Strategy
            </label>
            <textarea
              {...register("management.treatmentPlan")}
              placeholder="Overall strategy and clinical goals..."
              className={`${textareaClass} min-h-[100px]`}
            />
          </div>

          {/* Prescription Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>
                First Prescription
              </label>
              <input
                type="text"
                {...register("management.firstPrescription.medicine")}
                placeholder="Medicine name..."
                className={`${inputClass} ${errors.management?.firstPrescription?.medicine ? "border-red-500" : ""}`}
              />
              {errors.management?.firstPrescription?.medicine && (
                <p className="text-[10px] text-red-500 font-bold">{errors.management.firstPrescription.medicine.message}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className={labelClass}>Potency</label>
              <select
                {...register("management.firstPrescription.potency")}
                className={`${inputClass} appearance-none ${errors.management?.firstPrescription?.potency ? "border-red-500" : ""}`}
              >
                <option value="">Select Potency...</option>
                <option value="30 CH">30 CH</option>
                <option value="200 CH">200 CH</option>
                <option value="1M">1M</option>
                <option value="10M">10M</option>
                <option value="0/1">0/1 (LM)</option>
                <option value="Q">Mother Tincture (Q)</option>
              </select>
              {errors.management?.firstPrescription?.potency && (
                <p className="text-[10px] text-red-500 font-bold">{errors.management.firstPrescription.potency.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Dose</label>
              <input
                type="text"
                {...register("management.firstPrescription.dose")}
                placeholder="e.g. 4 pills TDS..."
                className={`${inputClass} ${errors.management?.firstPrescription?.dose ? "border-red-500" : ""}`}
              />
              {errors.management?.firstPrescription?.dose && (
                <p className="text-[10px] text-red-500 font-bold">{errors.management.firstPrescription.dose.message}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100/80">
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="shadow-md shadow-blue-500/20"
            leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {loading ? "Finalizing..." : "Complete Case"}
          </Button>
        </div>
      </form>
    </div>
  );
}
