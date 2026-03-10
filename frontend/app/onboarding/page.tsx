"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { registerPatient, PatientFormData } from "@/services/patientService";
import { useClinicStore } from "@/store/useClinicStore";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { User, Phone, ArrowRight } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

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
      router.push(`/consultation/acute?patientId=${res.data.patientId}`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      setError(err?.response?.data?.message || err.message || "Failed to register patient");
    },
  });

  const onSubmit = (data: FormValues) => {
    setError(null);
    mutation.mutate(data as PatientFormData);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
             <div className="p-2 bg-blue-100 rounded-xl"><User className="w-6 h-6 text-blue-600" /></div>
             Registration
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium italic">Onboard new patients into the CareWell Homeo clinic system.</p>
        </div>
      </div>

      <Card className="p-6 sm:p-10 border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-50 to-transparent rounded-bl-full pointer-events-none opacity-40" />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Essential Info */}
            <div className="space-y-8">
              <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-3">
                 <div className="w-8 h-px bg-blue-500 opacity-30" /> Identity & Profile
              </h3>
              
              <div className="space-y-6">
                <Input
                  label="Full Name"
                  {...register("name")}
                  placeholder="e.g. John Doe"
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.name?.message}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Age"
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    placeholder="25"
                    error={errors.age?.message}
                    required
                  />

                  <Select
                    label="Gender"
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                    {...register("gender")}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number"
                    {...register("phone")}
                    placeholder="+91 0000 0000"
                    leftIcon={<Phone className="w-4 h-4" />}
                    error={errors.phone?.message}
                    required
                  />

                  <Input
                    label="Email (Optional)"
                    {...register("email")}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Background Info */}
            <div className="space-y-8">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-3">
                 <div className="w-8 h-px bg-emerald-500 opacity-30" /> Residence & Medical Info
              </h3>

              <div className="space-y-6">
                <Textarea
                  label="Present Address"
                  {...register("address")}
                  rows={2}
                  placeholder="Location details..."
                  className="pl-12"
                />

                <div className="relative">
                  <Textarea
                    label="Known Medical Conditions"
                    {...register("medicalConditions")}
                    rows={2}
                    placeholder="Asthma, Diabetes, Allergies..."
                    className="pl-12"
                  />
                  <p className="text-[10px] text-slate-400 mt-2 italic ml-1">* Important for classical homeopathic evaluation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submission */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100 mt-12">
            <div className="text-left">
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Security Check</p>
              <p className="text-xs text-slate-400 font-medium">All clinical records are encrypted and HIPAA compliant.</p>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="min-w-[280px]"
              isLoading={mutation.isPending}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Register & Start Visit
            </Button>
          </div>
        </form>
      </Card>
      
      {error && (
        <div className="rounded-2xl border-2 border-red-500 animate-in shake duration-500 overflow-hidden">
          <Alert type="error" message={error} />
        </div>
      )}
    </div>
  );
}
