"use client";

import Link from "next/link";
import { Users, ChevronRight, CalendarPlus, X, Loader2 } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveConsultation, getNextOPNumber } from "@/services/consultationService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export interface PatientItem {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
}

interface PatientsListProps {
  patients: PatientItem[];
}

export function PatientsList({ patients }: PatientsListProps) {
  const { privacyMode } = useUIStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [schedulingPatient, setSchedulingPatient] = useState<PatientItem | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      opNumber: "",
      symptoms: ""
    }
  });

  useEffect(() => {
    if (schedulingPatient) {
      getNextOPNumber().then(res => {
        if (res.success) {
          setValue("opNumber", res.data.opNumber);
        }
      });
    } else {
      reset();
    }
  }, [schedulingPatient, setValue, reset]);

  const scheduleMutation = useMutation({
    mutationFn: saveConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      toast.success("Appointment scheduled successfully!");
      setSchedulingPatient(null);
      router.push("/appointments");
    },
    onError: () => {
      toast.error("Failed to schedule appointment.");
    }
  });

  const onSubmit = (data: { opNumber: string; symptoms: string }) => {
    if (!schedulingPatient) return;

    scheduleMutation.mutate({
      patientId: schedulingPatient._id,
      opNumber: data.opNumber,
      symptoms: data.symptoms,
      status: "Scheduled",
      aiGeneratedNotes: { chiefComplaint: "", assessment: "", advice: "" },
      doctorEditedNotes: { chiefComplaint: "", assessment: "", advice: "" },
    });
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden text-sm">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto p-4">
        <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 eyebrow border-b border-slate-100 rounded-tl-xl">Name</th>
              <th className="px-6 py-4 eyebrow border-b border-slate-100">Profile</th>
              <th className="px-6 py-4 eyebrow border-b border-slate-100">Contact</th>
              <th className="px-6 py-4 eyebrow border-b border-slate-100 text-right rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-24 text-center text-slate-500">
                  <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                  <p className="font-semibold text-slate-400 uppercase tracking-[0.2em] text-[10px]">No patients found</p>
                  <p className="text-xs text-slate-400 mt-2 italic font-light">Try adjusting your search criteria</p>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center font-semibold shadow-md shadow-brand-primary/10 shrink-0 text-base">
                        {patient.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <Link href={`/patients/${patient._id}`} className={clsx(
                          "font-semibold text-slate-900 tracking-tight group-hover:text-brand-primary transition-all text-base",
                          privacyMode && "blur-sm select-none"
                        )}>
                          {patient.name}
                        </Link>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider opacity-70">ID: {patient._id?.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight bg-brand-primary/5 text-brand-primary border border-brand-primary/10">
                      {patient.age}Y • {patient.gender}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className={clsx("text-slate-700 font-semibold tracking-tight", privacyMode && "blur-sm select-none")}>{patient.phone}</p>
                    {patient.email && <p className={clsx("text-xs text-slate-400 mt-0.5 font-medium", privacyMode && "blur-sm select-none")}>{patient.email}</p>}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => setSchedulingPatient(patient)}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 rounded-xl text-[10px] border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                        leftIcon={<CalendarPlus className="w-3.5 h-3.5" />}
                        disabled={scheduleMutation.isPending}
                      >
                        Schedule
                      </Button>
                      <Link 
                        href={`/patients/${patient._id}`}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-[11px] font-semibold text-brand-primary hover:bg-brand-primary hover:text-white transition-all border border-brand-primary/20"
                      >
                        View Profile
                        <ChevronRight className="w-3.5 h-3.5 ml-1.5 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden divide-y divide-slate-100">
        {patients.length === 0 ? (
           <div className="py-24 text-center text-slate-500 px-6">
             <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No patients found</p>
           </div>
        ) : (
          patients.map((patient) => (
            <div 
              key={patient._id}
              className="flex flex-col p-6 hover:bg-slate-50 transition-all active:bg-slate-100 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center font-semibold shadow-lg shadow-brand-primary/10 shrink-0 text-lg">
                  {patient.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0" onClick={() => router.push(`/patients/${patient._id}`)}>
                  <h4 className={clsx(
                    "text-lg font-semibold text-slate-900 truncate tracking-tight group-hover:text-brand-primary transition-all",
                    privacyMode && "blur-sm select-none"
                  )}>{patient.name}</h4>
                  <div className="flex items-center gap-2 mt-1 px-2.5 py-0.5 w-max rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>{patient.age} YRS</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span>{patient.gender}</span>
                  </div>
                </div>
                <ChevronRight 
                  onClick={() => router.push(`/patients/${patient._id}`)}
                  className="w-5 h-5 text-slate-300 group-hover:translate-x-0.5 transition-transform group-hover:text-brand-primary cursor-pointer" 
                />
              </div>
              <div className="mt-5 text-sm flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex flex-col gap-0.5">
                  <span className={clsx("font-semibold text-slate-700 tracking-tight", privacyMode && "blur-sm select-none")}>{patient.phone}</span>
                  {patient.email && <span className={clsx("text-xs text-slate-400 font-medium truncate", privacyMode && "blur-sm select-none")}>{patient.email}</span>}
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setSchedulingPatient(patient);
                  }}
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 rounded-xl text-[10px] border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                  leftIcon={<CalendarPlus className="w-3.5 h-3.5" />}
                  disabled={scheduleMutation.isPending}
                >
                  Schedule
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Appointment Modal */}
      {schedulingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-300 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Schedule Appointment</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">For {schedulingPatient.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSchedulingPatient(null)}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">OP Number</label>
                <Input 
                  {...register("opNumber", { required: "OP Number is required" })}
                  placeholder="e.g. OP-2026-001"
                  error={errors.opNumber?.message}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Purpose of Visit / Symptoms</label>
                <Textarea 
                  {...register("symptoms", { 
                    required: "Symptoms are required",
                    minLength: { value: 3, message: "Please enter at least 3 characters" }
                  })}
                  placeholder="Reason for visit..."
                  rows={3}
                  error={errors.symptoms?.message}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSchedulingPatient(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleMutation.isPending}
                  className="flex-1 py-3 rounded-xl bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                >
                  {scheduleMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Schedule Visit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
