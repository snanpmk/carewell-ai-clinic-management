"use client";

import { toast } from "sonner";
import { Suspense, useEffect } from "react";
import { Sparkles, Save, User, FileText, Loader2, Activity } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { generateNotes, saveConsultation } from "@/services/consultationService";
import { getPatient, getAllPatients } from "@/services/patientService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { clsx } from "clsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConsultationNotes } from "@/services/consultationService";

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

const emptyNotes: ConsultationNotes = {
  chiefComplaint: "",
  assessment: "",
  advice: "",
};

function ConsultationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPatientId = searchParams.get("patientId");
  const { privacyMode } = useUIStore();
  const { user } = useAuthStore();
  const aiEnabled = user?.clinic?.aiEnabled ?? true;

  const {
    register,
    handleSubmit,
    setValue,
    control,
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



  const selectedPatientId = useWatch({
    control,
    name: "patientId",
  });

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
        toast.success("AI clinical draft generated.");
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "AI Analysis failed.");
      generateMutation.reset();
    }
  });

  const aiNotes = generateMutation.data?.success ? generateMutation.data.data : null;

  const saveMutation = useMutation({
    mutationFn: saveConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Consultation saved successfully!");
      if (selectedPatientId) {
        router.push(`/patients/${selectedPatientId}`);
      } else {
        router.push("/appointments");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save consultation.");
      saveMutation.reset();
    }
  });

  const onFormError = () => {
    toast.error("Required fields missing: Please provide Symptoms and a valid Prescription.");
  };

  const onGenerate = (data: FormData) => {
    if (aiEnabled) {
      generateMutation.mutate(data);
    } else {
      handleSave();
    }
  };

  const triggerAnalysis = () => {
    const values = getValues();
    if (!values.patientId) {
      toast.error("Please select a patient first.");
      return;
    }
    if (!values.symptoms || values.symptoms.length < 5) {
      toast.error("Please provide at least 5 characters of symptoms for AI analysis.");
      return;
    }
    handleSubmit(onGenerate, onFormError)();
  };

  const handleSave = () => {
    const values = getValues();

    if (!values.patientId) {
      toast.error("Please select a patient before saving.");
      return;
    }
    
    if (aiEnabled && !aiNotes) {
      toast.warning("Please trigger AI analysis to generate medical drafts first.");
      return;
    }

    if (!values.prescription || values.prescription.length < 2) {
      toast.error("A valid prescription is required to save the case.");
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
      aiGeneratedNotes: aiNotes || emptyNotes,
      doctorEditedNotes: { 
        chiefComplaint: aiNotes?.chiefComplaint || values.symptoms,
        assessment: aiNotes?.assessment || values.diagnosis || "",
        advice: values.advice || aiNotes?.advice || ""
      }
    });
  };

  const patientOptions = allPatients.map((p: Patient) => ({
      value: p._id,
      label: `${p.name} (${p.phone})`,
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both w-full pb-12 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Acute Consultation</h1>
          <div className="mt-2 flex items-center gap-3">
            {patientLoading || allPatientsLoading ? (
              <p className="text-xs font-medium text-slate-400">Syncing patient data...</p>
            ) : patient ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Active Patient:</span>
                <span className={clsx("text-sm font-semibold text-slate-900", privacyMode && "blur-sm select-none")}>
                  {patient?.name} {patient?.age ? `(${patient.age}Y)` : ""}
                </span>
              </div>
            ) : (
              <p className="text-xs font-medium text-amber-600">Please select a patient to begin clinical entry</p>
            )}
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending || (aiEnabled && !aiNotes)}
          variant="primary"
          className="h-11 rounded-xl"
          leftIcon={saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        >
          Save Clinical Record
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Side: Input Form */}
        <div className="xl:col-span-5 space-y-8 bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-lg font-bold text-slate-800">Clinical Input</h2>
          </div>

          <form onSubmit={handleSubmit(onGenerate)} className="space-y-6">
            {!urlPatientId && (
              <Select
                label="Target Patient"
                options={patientOptions}
                placeholder="Search patient registry..."
                {...register("patientId")}
                error={errors.patientId?.message}
              />
            )}

            <Textarea
              label="Chief Complaint"
              {...register("symptoms")}
              rows={4}
              placeholder="Primary symptoms reported by patient..."
              error={errors.symptoms?.message}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Textarea
                label="Modalities"
                {...register("modalities")}
                rows={2}
                placeholder="Better / Worse from..."
              />

              <Textarea
                label="Mentals"
                {...register("mentals")}
                rows={2}
                placeholder="Disposition, mood..."
              />
            </div>

            <Textarea
              label="Physical Generals"
              {...register("generals")}
              rows={2}
              placeholder="Thirst, appetite, sleep, thermal..."
            />

            <Input
              label="Assessment / Diagnosis"
              {...register("diagnosis")}
              placeholder="E.g. Common Cold"
              leftIcon={<Activity className="w-5 h-5" />}
            />

            <Textarea
              label="Additional Context"
              {...register("additionalNotes")}
              rows={2}
              placeholder="Any other observations..."
            />

            <Button
              type="button"
              onClick={aiEnabled ? triggerAnalysis : handleSave}
              isLoading={generateMutation.isPending || saveMutation.isPending}
              variant={aiEnabled ? "secondary" : "primary"}
              fullWidth
              leftIcon={aiEnabled ? <Sparkles className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              className="mt-4 h-12 rounded-xl"
            >
              {aiEnabled ? "Analyze & Draft Notes" : "Save Clinical Record"}
            </Button>
          </form>
        </div>

        {/* Right Side: AI Generated Notes */}
        {aiEnabled ? (
          <div className="xl:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col relative overflow-hidden group">
              <div className="mb-8 border-b border-slate-100 pb-6 relative z-10">
                <h2 className="text-lg font-bold text-slate-800">AI Clinical Assistant</h2>
              </div>


              {aiNotes ? (
                <div className="space-y-8 flex-1 relative z-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
                      <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-3">Drafted Complaint</p>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed">&quot;{aiNotes.chiefComplaint}&quot;</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
                      <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-3">Clinical Logic</p>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed border-l-4 border-brand-accent/20 pl-4">{aiNotes.assessment}</p>
                    </div>
                  </div>

                  {aiNotes.aiSuggestions && (
                    <div className="bg-brand-primary/5 p-6 rounded-xl border border-brand-primary/10 shadow-inner">
                      <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Sparkles className="w-4 h-4" /> Analytical Suggestions
                       </label>
                      <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {aiNotes.aiSuggestions}
                      </p>
                    </div>
                  )}

                  <div className="space-y-6">
                    <Textarea
                      label="Final Plan & Patient Advice"
                      {...register("advice")}
                      rows={6}
                      placeholder="Enter management plan and instructions..."
                      className="bg-white border-slate-200 text-slate-900 focus:border-brand-primary h-auto"
                      labelClassName="text-slate-700"
                    />

                    <div className="p-1 rounded-xl border border-slate-100 bg-slate-50 shadow-inner">
                      <div className="rounded-lg p-6">
                        <Input
                          label="Final Prescription"
                          {...register("prescription")}
                          placeholder="Remedy Name, Potency, Dosage..."
                          leftIcon={<FileText className="w-5 h-5 text-brand-primary" />}
                          error={errors.prescription?.message}
                          className="bg-white border-slate-200 text-slate-900 h-12"
                          labelClassName="text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-8 relative z-10 text-slate-400">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                    <FileText className="w-8 h-8 opacity-30" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Awaiting Diagnosis</p>
                  <p className="text-sm font-medium text-slate-400 max-w-xs leading-relaxed">
                    Fill out the clinical symptoms on the left and trigger the AI analysis to generate medical drafts.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="xl:col-span-7 space-y-8">
             <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-sm h-full">
                <div className="border-b border-slate-100 pb-6 mb-8">
                  <h2 className="text-lg font-bold text-slate-800">Manual Documentation</h2>
                </div>
                
                <div className="space-y-8">
                  <Textarea
                    label="Management Plan & Advice"
                    {...register("advice")}
                    rows={8}
                    placeholder="Enter patient instructions and follow-up plan..."
                  />

                  <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-inner">
                    <Input
                      label="Final Prescription"
                      {...register("prescription")}
                      placeholder="Remedy Name, Potency, Dosage..."
                      leftIcon={<FileText className="w-5 h-5 text-brand-primary" />}
                      error={errors.prescription?.message}
                      className="h-12"
                    />
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center h-64 items-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>}>
      <ConsultationForm />
    </Suspense>
  );
}
