"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { generateNotes, SymptomData } from "@/services/consultationService";
import { useClinicStore } from "@/store/useClinicStore";

import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Stepper } from "@/components/ui/Stepper";

const schema = z.object({
  symptoms: z.string().min(3, "Please describe your symptoms"),
  duration: z.string().min(1, "Please enter the duration"),
  severity: z.enum(["mild", "moderate", "severe"], {
    message: "Please select a severity level",
  }),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SymptomsPage() {
  const router = useRouter();
  const { patientData, patientId, setSymptomData, setAiNotes } = useClinicStore();
  const [apiError, setApiError] = useState<string | null>(null);

  // Redirect back if no patient registered
  useEffect(() => {
    if (!patientId) router.replace("/onboarding");
  }, [patientId, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { severity: "moderate" },
  });

  const mutation = useMutation({
    mutationFn: (data: SymptomData) => generateNotes(data),
    onSuccess: (res, formData) => {
      setSymptomData(formData);
      setAiNotes(res.data);
      router.push("/notes");
    },
    onError: (err: Error) => {
      setApiError(err.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    setApiError(null);
    mutation.mutate(data as SymptomData);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in-up">
      {/* Stepper */}
      <div className="mb-8">
        <Stepper currentStep={2} />
      </div>

      {/* AI Generating overlay */}
      {mutation.isPending && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold animate-pulse-blue">
            AI is generating consultation notes…
          </p>
          <p className="text-sm text-gray-400">This usually takes 1–3 seconds</p>
        </div>
      )}

      <Card>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Describe Your Symptoms</h2>
              <p className="text-sm text-gray-500 mt-1">
                Hi{patientData?.name ? `, ${patientData.name}` : ""}. Please describe how you&apos;re feeling.
              </p>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="mb-4">
            <Alert type="error" message={apiError} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Textarea
            label="Symptoms"
            placeholder="e.g. migraine, nausea, sensitivity to light"
            required
            rows={3}
            {...register("symptoms")}
            error={errors.symptoms?.message}
          />

          <Input
            label="Duration"
            placeholder="e.g. 2 days, 1 week"
            required
            {...register("duration")}
            error={errors.duration?.message}
          />

          <Select
            label="Severity Level"
            required
            options={[
              { value: "mild", label: "Mild – Manageable, not affecting daily life" },
              { value: "moderate", label: "Moderate – Noticeable, affects activities" },
              { value: "severe", label: "Severe – Significant disruption" },
            ]}
            {...register("severity")}
            error={errors.severity?.message}
          />

          <Textarea
            label="Additional Notes"
            placeholder="e.g. pain is worse in the morning, started after travel"
            rows={2}
            {...register("additionalNotes")}
          />

          <div className="pt-2 space-y-2">
            <Button type="submit" isLoading={mutation.isPending}>
              ✦ Generate AI Consultation Notes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/onboarding")}
            >
              ← Back to Registration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
