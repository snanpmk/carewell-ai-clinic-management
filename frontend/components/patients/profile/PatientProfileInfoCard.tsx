"use client";

import { Phone, MapPin, User, Stethoscope, FilePlus } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface PatientContent {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address?: string;
  existingConditions?: string;
}

interface PatientProfileInfoCardProps {
  patient: PatientContent;
  patientId: string;
  visitsCount: number;
  chronicCount: number;
  bp?: string;
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function PatientProfileInfoCard({
  patient,
  patientId,
  visitsCount,
  chronicCount,
  bp,
}: PatientProfileInfoCardProps) {
  const { privacyMode } = useUIStore();
  const { user } = useAuthStore();
  const isStaff = user?.role === "staff";
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-brand-primary via-brand-accent to-brand-primary/40" />

      <div className="p-6">
        {/* Avatar + Name row */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <span className="text-2xl font-bold text-white">{getInitials(patient.name)}</span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className={clsx(
                "text-xl font-bold text-slate-900 tracking-tight truncate",
                privacyMode && "blur-md select-none"
              )}
            >
              {patient.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {patient.age}Y
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {patient.gender}
              </span>
              {patient.existingConditions && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wide truncate max-w-[140px]">
                    {patient.existingConditions}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats pills */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <p className="text-lg font-bold text-slate-900">{visitsCount}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Visits</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <p className="text-lg font-bold text-slate-900">{chronicCount}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Chronic</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <p className="text-lg font-bold text-slate-900">{bp || "—"}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">BP</p>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/5 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact</p>
              <p className={clsx("text-sm font-semibold text-slate-800 truncate", privacyMode && "blur-sm select-none")}>
                {patient.phone}
              </p>
            </div>
          </div>

          {patient.address && !isStaff && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Residence</p>
                <p className={clsx("text-sm font-semibold text-slate-700 leading-tight truncate", privacyMode && "blur-sm select-none")}>
                  {patient.address}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!isStaff && (
          <div className="flex gap-2 mt-6 pt-5 border-t border-slate-100">
            <button
              onClick={() => router.push(`/consultation/acute?patientId=${patientId}`)}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
            >
              <FilePlus className="w-3.5 h-3.5" /> Acute
            </button>
            <button
              onClick={() => router.push(`/consultation/chronic?patientId=${patientId}`)}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-brand-primary text-white text-[11px] font-bold hover:opacity-90 transition-all shadow-md shadow-brand-primary/20"
            >
              <Stethoscope className="w-3.5 h-3.5" /> Chronic Case
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
