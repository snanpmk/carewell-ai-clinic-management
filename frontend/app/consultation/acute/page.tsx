"use client";

import { toast } from "sonner";
import { Suspense } from "react";
import { Sparkles, Save, User, FileText, Loader2, Activity } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { generateNotes, saveConsultation } from "@/services/consultationService";
import { getPatient, getAllPatients } from "@/services/patientService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store/useUIStore";
import { clsx } from "clsx";
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
  prescription: z.string().optional(),
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

import { Button } from "@/components/ui/Button";

function ConsultationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPatientId = searchParams.get("patientId");
  const { privacyMode } = useUIStore();

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
      }
    },
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
    onError: (error) => {
      toast.error(error.message || "Failed to save consultation.");
    }
  });

  const onGenerate = (data: FormData) => {
    generateMutation.mutate(data);
  };

  const handleSave = () => {
    const values = getValues();

    if (!values.patientId) {
      toast.error("Please select a patient before saving.");
      return;
    }
    if (!aiNotes) {
      toast.warning("Please generate clinical notes first.");
      return;
    }
    if (!values.prescription || values.prescription.length < 2) {
      toast.error("Please enter a Final Prescription before saving.");
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
    <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both w-full pb-12 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex-1">
          <h1>New Consultation</h1>
          <div className="mt-2 flex items-center gap-3">
            {patientLoading || allPatientsLoading ? (
              <p className="eyebrow text-slate-400">Loading Patient Data...</p>
            ) : patient ? (
              <div className="flex items-center gap-2">
                <span className="eyebrow text-brand-primary">Active Case:</span>
                <span className={clsx("text-sm font-black text-slate-900 uppercase tracking-tight italic", privacyMode && "blur-sm select-none")}>
                  {patient?.name} {patient?.age ? `(${patient.age}Y)` : ""}
                </span>
              </div>
            ) : (
              <p className="eyebrow text-amber-500">Select a patient to begin</p>
            )}
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending || !aiNotes}
          variant="primary"
          leftIcon={saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        >
          Save Case
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Side: Input Form */}
        <div className="xl:col-span-5 space-y-8 bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Clinical Input</h2>
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
              type="submit"
              isLoading={generateMutation.isPending}
              variant="secondary"
              fullWidth
              leftIcon={<Sparkles className="w-5 h-5" />}
              className="mt-4 h-14"
            >
              Analyze & Draft Notes
            </Button>
          </form>
        </div>

        {/* Right Side: AI Generated Notes */}
        <div className="xl:col-span-7">
          <div className="bg-slate-950 p-6 sm:p-10 rounded-[2.5rem] border border-slate-900 shadow-2xl h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-primary/10 transition-all duration-700" />

            <div className="mb-8 border-b border-white/5 pb-6 relative z-10">
              <h2 className="text-xl  text-slate-200! uppercase italic tracking-tight">AI  Clinical Assistant</h2>
            </div>


            {aiNotes ? (
              <div className="space-y-8 flex-1 relative z-10 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-inner backdrop-blur-md">
                    <p className="eyebrow text-brand-primary mb-3">Drafted Complaint</p>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed italic">&quot;{aiNotes.chiefComplaint}&quot;</p>
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-inner backdrop-blur-md">
                    <p className="eyebrow text-brand-accent mb-3">Clinical Logic</p>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed italic border-l-4 border-brand-accent/20 pl-4">{aiNotes.assessment}</p>
                  </div>
                </div>

                {aiNotes.aiSuggestions && (
                  <div className="bg-brand-primary/5 p-6 rounded-3xl border border-brand-primary/10 shadow-inner">
                    <label className="eyebrow text-brand-primary mb-3 flex items-center gap-2">
                       <Sparkles className="w-4 h-4" /> Analytical Suggestions
                     </label>
                    <p className="text-sm font-medium text-slate-300 whitespace-pre-wrap leading-relaxed">
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
                    className="bg-white/5 border-white/10 text-white focus:border-brand-accent h-auto"
                    labelClassName="text-slate-200!"
                  />

                  <div className="bg-linear-to-br from-brand-primary/10 to-transparent p-1 rounded-4xl border border-brand-primary/20 shadow-2xl">
                    <div className="bg-slate-900 rounded-[1.9rem] p-6 border border-white/5">
                      <Input
                        label="Final Prescription"
                        {...register("prescription")}
                        placeholder="Remedy Name, Potency, Dosage..."
                        leftIcon={<FileText className="w-5 h-5 text-brand-primary" />}
                        error={errors.prescription?.message}
                        className="bg-white/5 border-white/10 text-white h-14"
                        labelClassName="text-slate-200!"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 relative z-10 text-slate-400">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                  <FileText className="w-10 h-10 opacity-30" />
                </div>
                <p className="eyebrow mb-2 text-slate-300!">Awaiting Diagnosis</p>
                <p className="text-sm font-medium text-slate-400 max-w-xs leading-relaxed">
                  Fill out the clinical symptoms on the left and trigger the AI analysis to generate medical drafts.
                </p>
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
    <Suspense fallback={<div className="flex justify-center h-64 items-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>}>
      <ConsultationForm />
    </Suspense>
  );
}

