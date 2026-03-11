"use client";

import Link from "next/link";
import { Users, ChevronRight, CalendarPlus } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveConsultation } from "@/services/consultationService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const scheduleMutation = useMutation({
    mutationFn: saveConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      toast.success("Appointment scheduled successfully!");
      router.push("/appointments");
    },
    onError: () => {
      toast.error("Failed to schedule appointment.");
    }
  });

  const handleSchedule = (patient: PatientItem) => {
    const opNumber = window.prompt(`Enter OP Number for ${patient.name}:`);
    if (!opNumber) return;

    const symptoms = window.prompt("Enter purpose of visit / primary symptoms (required):");
    if (!symptoms || symptoms.length < 3) {
      toast.error("Valid symptoms are required to schedule an appointment.");
      return;
    }

    scheduleMutation.mutate({
      patientId: patient._id,
      opNumber,
      symptoms,
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
                        onClick={() => handleSchedule(patient)}
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
            <Link 
              key={patient._id}
              href={`/patients/${patient._id}`}
              className="flex flex-col p-6 hover:bg-slate-50 transition-all active:bg-slate-100 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-primary to-brand-accent text-white flex items-center justify-center font-semibold shadow-lg shadow-brand-primary/10 shrink-0 text-lg">
                  {patient.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={clsx(
                    "text-lg font-light text-slate-900 truncate tracking-tight group-hover:text-brand-primary transition-all",
                    privacyMode && "blur-sm select-none"
                  )}><span className="font-semibold">{patient.name}</span></h4>
                  <div className="flex items-center gap-2 mt-1 px-2.5 py-0.5 w-max rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>{patient.age} YRS</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span>{patient.gender}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-0.5 transition-transform group-hover:text-brand-primary" />
              </div>
              <div className="mt-5 text-sm flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex flex-col gap-0.5">
                  <span className={clsx("font-semibold text-slate-700 tracking-tight", privacyMode && "blur-sm select-none")}>{patient.phone}</span>
                  {patient.email && <span className={clsx("text-xs text-slate-400 font-medium truncate", privacyMode && "blur-sm select-none")}>{patient.email}</span>}
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSchedule(patient);
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
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
