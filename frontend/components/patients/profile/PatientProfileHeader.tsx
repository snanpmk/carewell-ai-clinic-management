"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PatientProfileHeaderProps {
  patientId: string;
}

export function PatientProfileHeader({}: PatientProfileHeaderProps) {
  return (
    <div className="flex items-center gap-5 sm:gap-6 shrink-0">
      <Link 
        href="/patients"
        className="p-3 border border-slate-200 bg-white rounded-2xl text-slate-500 hover:text-brand-primary hover:bg-slate-50 shadow-sm transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-[1px] w-8 bg-brand-primary/40" />
          <span className="eyebrow text-brand-primary/70">Patient Registry</span>
        </div>
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">
          Clinical <span className="font-semibold text-brand-primary">Profile</span>
        </h1>
      </div>
    </div>
  );
}
