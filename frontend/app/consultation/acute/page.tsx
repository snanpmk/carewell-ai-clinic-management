"use client";



interface Patient {
  _id: string;
  name: string;
  age: number;
  phone: string;
}

import { useState, Suspense, useEffect } from "react";
import { Sparkles, Save, User, AlertCircle, FileText, Loader2, Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { generateNotes, saveConsultation } from "@/services/consultationService";
import { getPatient, getAllPatients } from "@/services/patientService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

const formSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  symptoms: z.string().min(5, "Symptoms are required"),
  modalities: z.string().optional(),
  generals: z.string().optional(),
  mentals: z.string().optional(),
  diagnosis: z.string().optional(),
  prescription: z.string().min(2, "Final prescription is required"),
  additionalNotes: z.string().optional(),
  advice: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Patient {
  _id: string;
  name: string;
  age: number;
  phone: string;
}

function ConsultationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPatientId = searchParams.get("patientId");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: urlPatientId || "",
      prescription: "",
      advice: "",
    },
  });

  const selectedPatientId = watch("patientId");

  const { data: patientRes, isLoading: patientLoading } = useQuery({
    queryKey: ["patient", selectedPatientId],
    queryFn: () => getPatient(selectedPatientId as string),
    enabled: !!selectedPatientId,
  });

  const { data: allPatientsRes, isLoading: allPatientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  const allPatients = allPatientsRes?.data || [];
  const patient = patientRes?.data;

  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: generateNotes,
    onSuccess: (result) => {
      if (result.success) {
        setValue("advice", result.data.advice);
      }
    }
  });

  const aiNotes = generateMutation.data?.success ? generateMutation.data.data : null;

  const saveMutation = useMutation({
    mutationFn: saveConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      alert("Consultation saved successfully!");
      if (selectedPatientId) {
        router.push(`/patients/${selectedPatientId}`);
      } else {
        router.push("/appointments");
      }
    },
    onError: (error) => {
      alert(error.message || "Failed to save consultation.");
    }
  });

  const onGenerate = (data: FormData) => {
    generateMutation.mutate(data);
  };

  const handleSave = () => {
    const values = getValues();
    
    if (!values.patientId) {
      alert("Please select a patient before saving.");
      return;
    }
    if (!aiNotes) {
      alert("Please generate notes first.");
      return;
    }
    if (!values.prescription || values.prescription.length < 2) {
      alert("Please enter a Final Prescription before saving.");
      return;
    }

    saveMutation.mutate({
      patientId: values.patientId,
      symptoms: values.symptoms,
      modalities: values.modalities,
      generals: values.generals,
      mentals: values.mentals,
      diagnosis: values.diagnosis,
      prescription: values.prescription,
      additionalNotes: values.additionalNotes,
      aiGeneratedNotes: aiNotes,
      doctorEditedNotes: { 
        chiefComplaint: aiNotes.chiefComplaint,
        assessment: aiNotes.assessment,
        advice: values.advice || aiNotes.advice
      }
    });
  };

  const patientOptions = allPatients.map((p: Patient) => ({
    value: p._id,
    label: `${p.name} (${p.phone})`,
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase">New Consultation</h1>
          {patientLoading || allPatientsLoading ? (
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: Loading...</p>
          ) : patient ? (
            <p className="text-sm font-bold text-blue-600 mt-1 italic">Case: {patient?.name} {patient?.age ? `(${patient.age}Y)` : ""}</p>
          ) : (
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">Attention: Select a patient to begin</p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending || !aiNotes}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition-all active:scale-95
            ${!aiNotes ? 'bg-slate-200 cursor-not-allowed text-slate-400 shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200'}`}
        >
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Consultation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Input Form */}
        <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <User className="w-5 h-5 text-blue-500" />
            Patient Input
          </h2>

          <form onSubmit={handleSubmit(onGenerate)} className="space-y-5">
            {!urlPatientId && (
              <Select
                label="Select Patient"
                options={patientOptions}
                placeholder="-- Choose a patient --"
                {...register("patientId")}
                error={errors.patientId?.message}
              />
            )}

            <Textarea
              label="Chief Complaint / Symptoms"
              {...register("symptoms")}
              rows={3}
              placeholder="E.g. Migraine, cold"
              error={errors.symptoms?.message}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Textarea
                label="Modalities (Better / Worse)"
                {...register("modalities")}
                rows={2}
                placeholder="E.g. Worse from cold, better resting"
              />

              <Textarea
                label="Mentals / Disposition"
                {...register("mentals")}
                rows={2}
                placeholder="E.g. Irritable, weepy, anxious"
              />
            </div>

            <Textarea
              label="Physical Generals"
              {...register("generals")}
              rows={2}
              placeholder="E.g. Thirstless, craves salts, chilly"
            />

            <Input
              label="Diagnosis / Assessment (Optional)"
              {...register("diagnosis")}
              placeholder="E.g. Common Cold"
              leftIcon={<Activity className="w-4 h-4" />}
            />

            <Textarea
              label="Additional Notes"
              {...register("additionalNotes")}
              rows={2}
              placeholder="E.g. Worse in morning"
            />

            <button
              type="submit"
              disabled={generateMutation.isPending}
              className={`w-full py-3 flex items-center justify-center gap-2 rounded-lg text-sm font-bold tracking-wide text-white transition-all 
                ${generateMutation.isPending 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                }`}
            >
              {generateMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Notes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: AI Generated Notes */}
        <div className="space-y-6">
          <div className="bg-linear-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none" />
            
            <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-6 border-b border-indigo-200/60 pb-4 relative z-10">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              AI Structured Notes
            </h2>

            {aiNotes ? (
              <div className="space-y-5 flex-1 relative z-10 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100 shadow-sm">
                  <Textarea
                    label="Chief Complaint"
                    defaultValue={aiNotes.chiefComplaint}
                    readOnly
                    rows={4}
                    className="bg-transparent border-none p-0 text-sm font-medium text-slate-800 focus:ring-0 resize-y min-h-[80px] shadow-none"
                  />
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100 shadow-sm">
                  <Textarea
                    label="Assessment"
                    defaultValue={aiNotes.assessment}
                    readOnly
                    rows={4}
                    className="bg-transparent border-none p-0 text-sm font-medium text-slate-800 focus:ring-0 resize-y min-h-[120px] shadow-none"
                  />
                </div>

                {aiNotes.aiSuggestions && (
                  <div className="bg-amber-50/80 backdrop-blur-sm p-4 rounded-lg border border-amber-200 shadow-sm">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> Clinical Suggestions
                    </label>
                    <p className="text-sm font-medium text-amber-900 whitespace-pre-wrap leading-relaxed">
                      {aiNotes.aiSuggestions}
                    </p>
                  </div>
                )}

                <Textarea
                  label="Advice & Plan (Editable)"
                  {...register("advice")}
                  rows={8}
                  className="bg-white/80 border-indigo-100"
                />

                <div className="bg-emerald-50/80 backdrop-blur-sm p-4 rounded-lg border border-emerald-200 shadow-sm focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
                  <Input
                    label="Final Prescription (Required)"
                    {...register("prescription")}
                    placeholder="E.g. Nux Vomica 200c, 2 pills TID"
                    leftIcon={<FileText className="w-4 h-4 text-emerald-500" />}
                    error={errors.prescription?.message}
                    className="bg-white/80"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 text-indigo-300">
                <FileText className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-medium text-indigo-400">No notes generated yet.</p>
                <p className="text-sm mt-2 max-w-xs leading-relaxed">Fill out the patient symptoms on the left and click &quot;Generate&quot; to create structured medical notes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center h-64 items-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <ConsultationForm />
    </Suspense>
  );
}
