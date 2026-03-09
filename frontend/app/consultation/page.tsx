"use client";

import { useState, use, Suspense } from "react";
import { Sparkles, Save, User, Clock, AlertCircle, FileText, Loader2, Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { generateNotes, saveConsultation } from "@/services/consultationService";
import { getPatient, getAllPatients } from "@/services/patientService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  symptoms: z.string().min(5, "Symptoms are required"),
  modalities: z.string().optional(),
  generals: z.string().optional(),
  mentals: z.string().optional(),
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function ConsultationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPatientId = searchParams.get("patientId");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(urlPatientId);

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiNotes, setAiNotes] = useState<{
    chiefComplaint: string;
    assessment: string;
    advice: string;
    aiSuggestions?: string;
  } | null>(null);
  
  // Doctor editable fields
  const [editedNotes, setEditedNotes] = useState("");

  const { data: patientRes, isLoading: patientLoading } = useQuery({
    queryKey: ["patient", urlPatientId],
    queryFn: () => getPatient(urlPatientId as string),
    enabled: !!urlPatientId,
  });

  const { data: allPatientsRes, isLoading: allPatientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
    enabled: !urlPatientId,
  });

  const allPatients = allPatientsRes?.data || [];
  const patient = urlPatientId ? patientRes?.data : allPatients.find((p: any) => p._id === selectedPatientId);

  const queryClient = useQueryClient();

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
    onError: () => {
      alert("Failed to save consultation.");
    }
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onGenerate = async (data: FormData) => {
    setIsGenerating(true);
    try {
      const result = await generateNotes(data as any);
      if (result.success) {
        setAiNotes(result.data);
        setEditedNotes(result.data.advice); // Default pre-fill
      } else {
        alert("Failed to generate notes");
      }
    } catch (error) {
      console.error(error);
      alert("AI Service unavailable.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!selectedPatientId) {
      alert("Please select a patient before saving.");
      return;
    }
    if (!aiNotes) {
      alert("Please generate notes first.");
      return;
    }
    const formData = getValues();
    if (!formData.prescription || formData.prescription.length < 2) {
      alert("Please enter a Final Prescription before saving.");
      return;
    }

    saveMutation.mutate({
      patientId: selectedPatientId,
      symptoms: formData.symptoms,
      modalities: formData.modalities,
      generals: formData.generals,
      mentals: formData.mentals,
      diagnosis: formData.diagnosis,
      prescription: formData.prescription,
      additionalNotes: formData.additionalNotes,
      aiGeneratedNotes: aiNotes,
      doctorEditedNotes: { 
        chiefComplaint: aiNotes.chiefComplaint,
        assessment: aiNotes.assessment,
        advice: editedNotes // Capture what doctor typed
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase">New Consultation</h1>
          {patientLoading || (!urlPatientId && allPatientsLoading) ? (
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
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Patient</label>
                {allPatientsLoading ? (
                  <p className="text-sm text-slate-500">Loading patients...</p>
                ) : (
                  <select
                    value={selectedPatientId || ""}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
                  >
                    <option value="">-- Choose a patient --</option>
                    {allPatients.map((p: any) => (
                      <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div>
              <label className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-1.5">Chief Complaint / Symptoms</label>
              <textarea
                {...register("symptoms")}
                rows={3}
                placeholder="E.g. Migraine, cold"
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-slate-50"
              />
              {errors.symptoms && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.symptoms.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Modalities (Better / Worse)</label>
                <textarea
                  {...register("modalities")}
                  rows={2}
                  placeholder="E.g. Worse from cold, better resting"
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Mentals / Disposition</label>
                <textarea
                  {...register("mentals")}
                  rows={2}
                  placeholder="E.g. Irritable, weepy, anxious"
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Physical Generals</label>
              <textarea
                {...register("generals")}
                rows={2}
                placeholder="E.g. Thirstless, craves salts, chilly"
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Diagnosis / Assessment (Optional)</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    {...register("diagnosis")}
                    placeholder="E.g. Common Cold"
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Additional Notes</label>
              <textarea
                {...register("additionalNotes")}
                rows={2}
                placeholder="E.g. Worse in morning"
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-3 flex items-center justify-center gap-2 rounded-lg text-sm font-bold tracking-wide text-white transition-all 
                ${isGenerating 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                }`}
            >
              {isGenerating ? (
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
                  <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Chief Complaint</label>
                  <textarea
                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-800 focus:ring-0 resize-y min-h-[80px]"
                    defaultValue={aiNotes.chiefComplaint}
                    readOnly
                    rows={4}
                  />
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100 shadow-sm">
                  <label className="block text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Assessment</label>
                  <textarea
                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-800 focus:ring-0 resize-y min-h-[120px]"
                    defaultValue={aiNotes.assessment}
                    readOnly
                    rows={4}
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

                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400">
                  <label className="flex text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1 items-center justify-between">
                    Advice & Plan (Editable)
                  </label>
                  <textarea
                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-800 focus:ring-0 resize-y min-h-[160px]"
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    rows={8}
                  />
                </div>
                <div className="bg-emerald-50/80 backdrop-blur-sm p-4 rounded-lg border border-emerald-200 shadow-sm focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
                  <label className="flex text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 items-center justify-between">
                    Final Prescription (Required)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      type="text"
                      {...register("prescription")}
                      placeholder="E.g. Nux Vomica 200c, 2 pills TID"
                      className="w-full rounded-lg border border-emerald-300 pl-9 pr-3 py-3 text-sm font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/80"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 text-indigo-300">
                <FileText className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-medium text-indigo-400">No notes generated yet.</p>
                <p className="text-sm mt-2 max-w-xs leading-relaxed">Fill out the patient symptoms on the left and click "Generate" to create structured medical notes.</p>
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
