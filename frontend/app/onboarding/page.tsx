"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { registerPatient, PatientFormData } from "@/services/patientService";
import { useClinicStore } from "@/store/useClinicStore";

import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { User, Phone, MapPin, Activity, ArrowRight, Loader2, ChevronRight } from "lucide-react";

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
      router.push(`/consultation?patientId=${res.data.patientId}`);
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
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      {...register("name")}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all focus:ring-4 focus:ring-blue-500/5"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-2 font-bold ml-1 flex items-center gap-1">✕ {errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Age</label>
                    <input
                      type="number"
                      {...register("age", { valueAsNumber: true })}
                      placeholder="25"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all focus:ring-4 focus:ring-blue-500/5"
                    />
                    {errors.age && <p className="text-xs text-red-500 mt-2 font-bold ml-1 uppercase tracking-tighter">{errors.age.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gender</label>
                    <div className="relative">
                      <select
                        {...register("gender")}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                    <div className="relative group">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                       <input
                        {...register("phone")}
                        placeholder="+91 0000 0000"
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition-all focus:ring-4 focus:ring-blue-500/5"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-2 font-bold ml-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email (Optional)</label>
                    <input
                      {...register("email")}
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all focus:ring-4 focus:ring-blue-500/5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Background Info */}
            <div className="space-y-8">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-3">
                 <div className="w-8 h-px bg-emerald-500 opacity-30" /> Residence & Medical Info
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Present Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-5 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <textarea
                      {...register("address")}
                      rows={2}
                      placeholder="Location details..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Known Medical Conditions</label>
                  <div className="relative group">
                    <Activity className="absolute left-4 top-5 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <textarea
                      {...register("medicalConditions")}
                      rows={2}
                      placeholder="Asthma, Diabetes, Allergies..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                    />
                  </div>
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
            
            <button
              type="submit"
              disabled={mutation.isPending}
              className={`min-w-[280px] py-5 px-8 flex items-center justify-center gap-3 rounded-2xl text-base font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95
                ${mutation.isPending 
                  ? "bg-slate-300 cursor-not-allowed shadow-none" 
                  : "bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/20 hover:shadow-blue-500/40"
                }`}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Record...
                </>
              ) : (
                <>
                  Register & Start Visit
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
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
