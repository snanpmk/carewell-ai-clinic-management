"use client";

import { Phone, MapPin, Stethoscope, FilePlus } from "lucide-react";
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
  bp,
}: PatientProfileInfoCardProps) {
  const { privacyMode } = useUIStore();
  const { user } = useAuthStore();
  const isStaff = user?.role === "staff";
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Profile Identity */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-white shadow-md flex items-center justify-center mb-4 overflow-hidden">
            <div className="w-full h-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-2xl font-semibold">
              {getInitials(patient.name)}
            </div>
          </div>
          <h2 className={clsx(
            "text-xl font-semibold text-slate-900 tracking-tight",
            privacyMode && "blur-md select-none"
          )}>
            {patient.name}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {patient.gender}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/5 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
              {patient.age} Years
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
            <span className="text-xl font-bold text-slate-900">{visitsCount}</span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Visits</span>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
            <span className="text-xl font-bold text-slate-900">{bp || '—'}</span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Latest BP</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-brand-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Primary Contact</p>
              <p className={clsx("text-sm font-medium text-slate-900", privacyMode && "blur-sm")}>
                {patient.phone}
              </p>
            </div>
          </div>

          {patient.address && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Address</p>
                <p className={clsx("text-sm font-medium text-slate-700 leading-relaxed", privacyMode && "blur-sm")}>
                  {patient.address}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!isStaff && (
          <div className="grid grid-cols-1 gap-2 mt-6">
            <button
              onClick={() => router.push(`/consultation/acute?patientId=${patientId}`)}
              className="flex items-center justify-center gap-2 h-10 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-brand-primary/30 hover:text-brand-primary transition-all shadow-sm"
            >
              <FilePlus className="w-3.5 h-3.5" /> Acute Session
            </button>
            <button
              onClick={() => router.push(`/consultation/chronic?patientId=${patientId}`)}
              className="flex items-center justify-center gap-2 h-10 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:opacity-90 transition-all shadow-md shadow-brand-primary/20"
            >
              <Stethoscope className="w-3.5 h-3.5" /> Chronic Evaluation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
