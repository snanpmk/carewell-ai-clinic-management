"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

import { Sparkles, ArrowRight, ChevronLeft, Loader2 } from "lucide-react";

export default function SymptomsPage() {
  const router = useRouter();
  const { patientData, patientId, setSymptomData, setAiNotes } = useClinicStore();

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
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data as SymptomData);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both pb-24">
      {/* Stepper */}
      <div className="mb-12">
        <Stepper currentStep={2} />
      </div>

      {/* AI Generating overlay */}
      {mutation.isPending && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-6 p-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-3xl bg-white border border-brand-primary/20 shadow-2xl flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-brand-primary animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold text-white uppercase tracking-tight">AI Clinical Synthesis</p>
            <p className="text-sm text-slate-300 font-medium mt-2">Distilling symptoms into clinical drafts...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center text-center mb-10">
        <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary mb-4 border border-brand-primary/20">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h1>Symptom Capture</h1>
        <p className="text-slate-500 font-medium mt-2">
          Hi{patientData?.name ? `, ${patientData.name}` : ""}. Let&apos;s map out the clinical presentation.
        </p>
      </div>

      <Card className="p-8 sm:p-10 shadow-2xl shadow-slate-200/40 border border-slate-200">
        {mutation.error && (
          <div className="mb-8">
            <Alert type="error" message={mutation.error.message} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
          <Textarea
            label="Clinical Narrative"
            placeholder="Describe the primary symptoms, modalities, and general observations..."
            required
            rows={4}
            {...register("symptoms")}
            error={errors.symptoms?.message}
            className="h-auto"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Input
              label="Chronology / Duration"
              placeholder="e.g. 3 days, since yesterday"
              required
              {...register("duration")}
              error={errors.duration?.message}
              className="h-14"
            />

            <Select
              label="Perceived Severity"
              required
              options={[
                { value: "mild", label: "Mild" },
                { value: "moderate", label: "Moderate" },
                { value: "severe", label: "Severe" },
              ]}
              {...register("severity")}
              error={errors.severity?.message}
              className="h-14"
            />
          </div>

          <Textarea
            label="Extended Context (Optional)"
            placeholder="Known triggers, family history connections, etc."
            rows={2}
            {...register("additionalNotes")}
          />

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="submit" 
              isLoading={mutation.isPending} 
              fullWidth
              variant="primary"
              className="h-16"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Analyze & Draft
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/onboarding")}
              fullWidth
              leftIcon={<ChevronLeft className="w-5 h-5" />}
              className="h-16"
            >
              Back
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
