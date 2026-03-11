"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { saveConsultation, ConsultationNotes } from "@/services/consultationService";
import { useClinicStore } from "@/store/useClinicStore";

import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Stepper } from "@/components/ui/Stepper";
import { CheckCircle2, FileText, Sparkles, ChevronLeft, Save, Activity } from "lucide-react";

export default function NotesPage() {
  const router = useRouter();
  const { patientId, symptomData, aiNotes, reset: resetClinicStore } = useClinicStore();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ConsultationNotes>({
    defaultValues: {
      chiefComplaint: "",
      assessment: "",
      advice: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ConsultationNotes) =>
      saveConsultation({
        patientId: patientId!,
        symptoms: symptomData!.symptoms,
        diagnosis: symptomData!.diagnosis,
        prescription: symptomData!.prescription,
        additionalNotes: symptomData!.additionalNotes,
        aiGeneratedNotes: aiNotes!,
        doctorEditedNotes: data,
      }),
    onSuccess: () => {
      // Potentially redirect or show success state
    }
  });

  // Pre-fill editable notes with AI output when they become available
  useEffect(() => {
    if (aiNotes) {
      reset(aiNotes);
    }
  }, [aiNotes, reset]);

  // Handle redirection
  useEffect(() => {
    if (aiNotes === null && !patientId) {
      router.replace("/onboarding");
    }
  }, [patientId, aiNotes, router]);

  const onSubmit = (data: ConsultationNotes) => {
    mutation.mutate(data);
  };

  const handleStartNew = () => {
    resetClinicStore();
    router.push("/onboarding");
  };

  if (!aiNotes) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both pb-24">
      {/* Stepper */}
      <div className="mb-12">
        <Stepper currentStep={3} />
      </div>

      {/* Success State */}
      {mutation.isSuccess ? (
        <Card className="text-center py-16 px-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-[2rem] bg-brand-primary/10 flex items-center justify-center mb-8 border border-brand-primary/20 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-brand-primary" />
          </div>
          <h1 className="mb-3">Consultation Saved</h1>
          <p className="text-slate-500 mb-10 font-medium max-w-sm mx-auto">
            The clinical record has been successfully committed to the patient&apos;s digital history.
          </p>
          <div className="w-full max-w-xs space-y-3">
            <Button onClick={handleStartNew} fullWidth variant="primary">
              New Consultation
            </Button>
            <Button onClick={() => router.push('/dashboard')} fullWidth variant="ghost">
              Back to Dashboard
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary mb-4 border border-brand-primary/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h1>Clinical Review</h1>
            <p className="text-slate-500 font-medium mt-2">Finalize the AI-generated medical drafts</p>
          </div>

          <Card className="p-8 sm:p-10 space-y-8">
            <div className="border-b border-slate-100 pb-8">
              <h2 className="mb-4">Patient Assessment</h2>
              {symptomData && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="eyebrow text-slate-400 mb-1">Diagnosis</p>
                    <p className="font-extrabold text-slate-900 tracking-tight uppercase">{symptomData.diagnosis || "UNSPECIFIED"}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="eyebrow text-slate-400 mb-1">Prescription</p>
                    <p className="font-extrabold text-slate-900 tracking-tight uppercase">{symptomData.prescription || "UNSPECIFIED"}</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="group transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="eyebrow text-brand-primary">
                      Chief Complaint Synthesis
                    </span>
                  </div>
                  <Textarea
                    {...register("chiefComplaint")}
                    label=""
                    rows={3}
                    className="bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                <div className="group transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="eyebrow text-brand-accent">
                      Clinical Analysis
                    </span>
                  </div>
                  <Textarea
                    {...register("assessment")}
                    label=""
                    rows={4}
                    className="bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                <div className="group transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-slate-950/10 rounded-lg text-slate-900">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="eyebrow text-slate-900">
                      Management & Advice
                    </span>
                  </div>
                  <Textarea
                    {...register("advice")}
                    label=""
                    rows={4}
                    className="bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {mutation.error && <Alert type="error" message={mutation.error.message} />}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  isLoading={mutation.isPending}
                  fullWidth
                  variant="primary"
                  leftIcon={<Save className="w-5 h-5" />}
                >
                  Confirm & Commit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/symptoms")}
                  fullWidth
                  leftIcon={<ChevronLeft className="w-5 h-5" />}
                >
                  Edit Symptoms
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
