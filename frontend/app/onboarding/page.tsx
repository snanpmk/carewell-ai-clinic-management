"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { registerPatient, PatientFormData } from "@/services/patientService";
import { useClinicStore } from "@/store/useClinicStore";
import { useUIStore } from "@/store/useUIStore";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { User, Phone, ArrowRight, Sparkles } from "lucide-react";

// ── Validation Schema ──────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z
    .number()
    .min(1, "Age must be at least 1")
    .max(120, "Age must be at most 120"),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),
  email: z.string().optional(),
  address: z.string().optional(),
  medicalConditions: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setPatient = useClinicStore((s) => s.setPatient);
  const { privacyMode } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { gender: "Male" },
  });

  const mutation = useMutation({
    mutationFn: (data: PatientFormData) => registerPatient(data),
    onSuccess: (res, formData) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setPatient(res.data.patientId, formData);
      toast.success("Patient registered successfully!");
      router.push(`/consultation/acute?patientId=${res.data.patientId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register patient");
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data as PatientFormData);
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both pb-12 px-4 md:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-brand-primary/40" />
            <span className="eyebrow text-brand-primary/70">Patient Registry</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight">
            Patient <span className="font-semibold text-brand-primary">Onboarding</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed mt-1">Register new patients into the CareWell Homeopathic registry.</p>
        </div>
      </div>

      <Card className="p-6 sm:p-10 border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 bg-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-brand-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Essential Info */}
            <div className="space-y-10">
              <div className="eyebrow text-brand-primary flex items-center gap-4">
                 <div className="w-10 h-px bg-brand-primary/30" /> Personal Identity
              </div>
              
              <div className="space-y-8">
                <Input
                  label="Full Legal Name"
                  {...register("name")}
                  placeholder="e.g. Johnathan Doe"
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.name?.message}
                  required
                  privacyBlur={privacyMode}
                  className="h-14"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <Input
                    label="Age"
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    placeholder="25"
                    error={errors.age?.message}
                    required
                    className="h-14"
                  />

                  <Select
                    label="Gender Profile"
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                    {...register("gender")}
                    required
                    className="h-14"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <Input
                    label="Primary Contact"
                    {...register("phone")}
                    placeholder="+91 00000 00000"
                    leftIcon={<Phone className="w-5 h-5" />}
                    error={errors.phone?.message}
                    required
                    privacyBlur={privacyMode}
                    className="h-14"
                  />

                  <Input
                    label="Email (Optional)"
                    {...register("email")}
                    placeholder="patient@email.com"
                    privacyBlur={privacyMode}
                    className="h-14"
                  />
                </div>
              </div>
            </div>

            {/* Background Info */}
            <div className="space-y-10">
              <div className="eyebrow text-brand-accent flex items-center gap-4">
                 <div className="w-10 h-px bg-brand-accent/30" /> Clinical Context
              </div>

              <div className="space-y-8">
                <Textarea
                  label="Residential Address"
                  {...register("address")}
                  rows={3}
                  placeholder="Street details, locality, city..."
                  privacyBlur={privacyMode}
                />

                <div className="relative group">
                  <Textarea
                    label="Medical History Overview"
                    {...register("medicalConditions")}
                    rows={4}
                    placeholder="Asthma, Diabetes, Known Allergies, Surgical History..."
                  />
                  <p className="text-[11px] text-slate-400 mt-3 font-medium flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> Constitutional data for classical evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submission */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-slate-100 mt-16">
            <div className="text-left max-w-sm">
              <p className="text-base font-extrabold text-slate-900 tracking-tight uppercase mb-1">Secure Registration</p>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">By registering, you confirm the clinical data is accurate and follows institutional compliance.</p>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="h-16 w-full md:w-[320px]"
              isLoading={mutation.isPending}
              rightIcon={<ArrowRight className="w-6 h-6" />}
            >
              Onboard & Initialize
            </Button>
          </div>
        </form>
      </Card>
      
      {mutation.error && (
        <div className="rounded-[2rem] border-2 border-red-500 animate-in shake duration-500 overflow-hidden shadow-2xl">
          <Alert type="error" message={mutation.error.message} />
        </div>
      )}
    </div>
  );
}
