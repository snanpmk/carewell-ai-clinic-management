"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PatientProfileHeaderProps {
  patientId: string;
}

export function PatientProfileHeader({ patientId }: PatientProfileHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 w-full">
      <div className="flex items-center gap-4">
        <Link 
          href="/patients"
          className="p-2.5 border border-slate-200 bg-white rounded-xl text-slate-500 hover:text-brand-primary hover:bg-slate-50 shadow-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col gap-0.5">
          <h1>Patient Profile</h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Comprehensive medical history & analytics</p>
        </div>
      </div>
      
      <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
        <Button
          onClick={() => router.push(`/consultation/acute?patientId=${patientId}`)}
          variant="primary"
          leftIcon={<Plus className="w-5 h-5 shrink-0" />}
        >
          New Consultation
        </Button>
      </div>
    </header>
  );
}
