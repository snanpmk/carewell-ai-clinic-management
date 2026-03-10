"use client";

import { useEffect, useState } from "react";
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

export default function NotesPage() {
  const router = useRouter();
  const { patientId, symptomData, aiNotes, reset: resetClinicStore } = useClinicStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ConsultationNotes>({
    defaultValues: {
      chiefComplaint: "",
      assessment: "",
      advice: "",
    },
  });

  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [apiError, setApiError] = useState<string | null>(null);

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
      setSaveStatus("success");
    },
    onError: (err: Error) => {
      setApiError(err.message);
      setSaveStatus("error");
    },
  });

  const onSubmit = (data: ConsultationNotes) => {
    setApiError(null);
    setSaveStatus("idle");
    mutation.mutate(data);
  };

  const handleStartNew = () => {
    resetClinicStore();
    router.push("/onboarding");
  };

  if (!aiNotes) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in-up">
      {/* Stepper */}
      <div className="mb-8">
        <Stepper currentStep={3} />
      </div>

      {/* Success State */}
      {saveStatus === "success" ? (
        <Card className="text-center py-10">
          <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Consultation Saved
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            The consultation record has been saved to the patient&apos;s profile.
          </p>
          <Button onClick={handleStartNew} className="w-full">
            Start New Consultation
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                AI Generated Consultation Notes
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Review and edit the notes below before saving to the patient record.
              </p>
              {/* Symptom summary */}
              {symptomData && (
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-400">Diagnosis:</span>
                  <span className="text-xs font-medium text-gray-600">
                    {symptomData.diagnosis || "None"}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">Prescription:</span>
                  <span className="text-xs font-medium text-gray-600">
                    {symptomData.prescription || "None"}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    Chief Complaint
                  </span>
                </div>
                <Textarea
                  {...register("chiefComplaint")}
                  label=""
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                    Assessment
                  </span>
                </div>
                <Textarea
                  {...register("assessment")}
                  label=""
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                    Advice
                  </span>
                </div>
                <Textarea
                  {...register("advice")}
                  label=""
                  rows={2}
                />
              </div>

              {apiError && <Alert type="error" message={apiError} />}

              <div className="space-y-2 pt-4">
                <Button
                  type="submit"
                  isLoading={mutation.isPending}
                  className="w-full"
                >
                  Save Consultation Record
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/symptoms")}
                  className="w-full"
                >
                  ← Back to Symptoms
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
